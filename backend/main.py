import sys
import json
import shutil
import tempfile
import zipfile
import subprocess
from pathlib import Path
from typing import Optional

# Add root to path so we can import analyzer
sys.path.insert(0, str(Path(__file__).parent.parent))

from fastapi import FastAPI, APIRouter, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response, FileResponse
from fastapi.staticfiles import StaticFiles

from analyzer.scanner import scan_project
from analyzer.parser import parse_files
from analyzer.long_function import detect_long_functions
from analyzer.complexity import calculate_complexity
from analyzer.maintainability import calculate_maintainability
from analyzer.duplication import detect_duplicate_functions

app = FastAPI(title="Code Quality Analyzer API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# All API routes are grouped under /api so the single production server
# can handle both the API and the React SPA without a separate proxy.
router = APIRouter(prefix="/api")


@router.get("/health")
def health():
    return {"status": "ok", "version": "1.0.0"}


@router.get("/languages")
def languages():
    return {
        "languages": [
            {"id": "python", "name": "Python", "available": True},
            {"id": "javascript", "name": "JavaScript", "available": False},
            {"id": "typescript", "name": "TypeScript", "available": False},
            {"id": "java", "name": "Java", "available": False},
            {"id": "cpp", "name": "C++", "available": False},
            {"id": "go", "name": "Go", "available": False},
            {"id": "rust", "name": "Rust", "available": False},
        ]
    }


def run_analysis(project_path: str) -> dict:
    python_files = scan_project(project_path)

    if not python_files:
        raise HTTPException(
            status_code=400, detail="No Python files found in the project"
        )

    parsed_files = parse_files(python_files)
    long_functions_raw = detect_long_functions(parsed_files)
    complexity_raw = calculate_complexity(parsed_files)
    maintainability_raw = calculate_maintainability(parsed_files)
    duplicates_raw = detect_duplicate_functions(parsed_files)

    # Build merged function map
    function_map: dict[tuple, dict] = {}

    for item in complexity_raw:
        key = (str(item["file"]), item["function"])
        function_map[key] = {
            "file": Path(item["file"]).name,
            "file_path": str(item["file"]),
            "function": item["function"],
            "complexity": item["complexity"],
            "maintainability": 0.0,
            "line_count": 0,
            "is_long": False,
            "is_duplicate": False,
        }

    for item in maintainability_raw:
        key = (str(item["file"]), item["function"])
        if key in function_map:
            function_map[key]["maintainability"] = item["maintainability"]

    for item in long_functions_raw:
        key = (str(item["file"]), item["function"])
        if key in function_map:
            function_map[key]["is_long"] = True
            function_map[key]["line_count"] = item["line_count"]

    duplicate_keys = set()
    for item in duplicates_raw:
        duplicate_keys.add((str(item["duplicate_file"]), item["duplicate_function"]))

    for key, func in function_map.items():
        if (func["file_path"], func["function"]) in duplicate_keys:
            func["is_duplicate"] = True

    functions = list(function_map.values())
    # Remove internal field
    for f in functions:
        f.pop("file_path", None)

    total_functions = len(functions)
    avg_complexity = (
        sum(f["complexity"] for f in functions) / total_functions
        if total_functions
        else 0
    )
    avg_maintainability = (
        sum(f["maintainability"] for f in functions) / total_functions
        if total_functions
        else 0
    )
    long_count = sum(1 for f in functions if f["is_long"])
    dup_count = len(duplicates_raw)

    # Overall score heuristic (0-100)
    score = 100.0
    score -= min(max(avg_complexity - 1, 0) * 8, 40)
    score -= min((100 - avg_maintainability) * 0.3, 30)
    score -= min(long_count * 5, 15)
    score -= min(dup_count * 5, 15)
    overall_score = max(0, min(100, round(score)))

    return {
        "summary": {
            "total_files": len(python_files),
            "total_functions": total_functions,
            "avg_complexity": round(avg_complexity, 2),
            "avg_maintainability": round(avg_maintainability, 2),
            "long_functions_count": long_count,
            "duplicates_count": dup_count,
            "overall_score": overall_score,
        },
        "functions": functions,
        "long_functions": [
            {
                "file": Path(str(f["file"])).name,
                "function": f["function"],
                "line_count": f["line_count"],
            }
            for f in long_functions_raw
        ],
        "duplicates": [
            {
                "original_file": Path(str(d["original_file"])).name,
                "original_function": d["original_function"],
                "duplicate_file": Path(str(d["duplicate_file"])).name,
                "duplicate_function": d["duplicate_function"],
            }
            for d in duplicates_raw
        ],
    }


@router.post("/analyze")
async def analyze(
    file: Optional[UploadFile] = File(None),
    github_url: Optional[str] = Form(None),
    language: str = Form("python"),
):
    if language != "python":
        raise HTTPException(
            status_code=400, detail=f"Language '{language}' is not yet supported"
        )

    if not file and not github_url:
        raise HTTPException(
            status_code=400, detail="Either a ZIP file or github_url is required"
        )

    temp_dir = tempfile.mkdtemp()

    try:
        if file:
            if not (file.filename or "").endswith(".zip"):
                raise HTTPException(
                    status_code=400, detail="Only ZIP files are supported"
                )

            zip_path = Path(temp_dir) / "upload.zip"
            content = await file.read()
            zip_path.write_bytes(content)

            extract_dir = Path(temp_dir) / "project"
            extract_dir.mkdir()

            # Safe extraction: reject any member whose resolved path
            # escapes the destination directory (Zip Slip protection).
            try:
                with zipfile.ZipFile(zip_path, "r") as z:
                    resolved_extract = extract_dir.resolve()
                    for member in z.infolist():
                        member_path = (extract_dir / member.filename).resolve()
                        try:
                            member_path.relative_to(resolved_extract)
                        except ValueError:
                            raise HTTPException(
                                status_code=400,
                                detail="Invalid ZIP: contains path traversal entries",
                            )
                        z.extract(member, extract_dir)
            except zipfile.BadZipFile:
                raise HTTPException(
                    status_code=400, detail="Uploaded file is not a valid ZIP archive"
                )

            project_path = str(extract_dir)

        else:
            # Validate URL: only allow HTTPS GitHub/GitLab/Bitbucket URLs.
            import re
            allowed = re.compile(
                r"^https://(github\.com|gitlab\.com|bitbucket\.org)/[\w.\-]+/[\w.\-]+(\.git)?/?$"
            )
            if not allowed.match(github_url.strip()):
                raise HTTPException(
                    status_code=400,
                    detail=(
                        "Only HTTPS URLs from github.com, gitlab.com, or "
                        "bitbucket.org are accepted"
                    ),
                )

            clone_dir = Path(temp_dir) / "repo"
            result = subprocess.run(
                ["git", "clone", "--depth=1", github_url.strip(), str(clone_dir)],
                capture_output=True,
                text=True,
                timeout=60,
            )
            if result.returncode != 0:
                raise HTTPException(
                    status_code=400,
                    detail=f"Failed to clone repository: {result.stderr.strip()}",
                )
            project_path = str(clone_dir)

        return run_analysis(project_path)

    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)


@router.post("/report/html")
async def report_html(
    file: Optional[UploadFile] = File(None),
    github_url: Optional[str] = Form(None),
    language: str = Form("python"),
):
    """Return an HTML report for the analyzed project."""
    data = await analyze(file=file, github_url=github_url, language=language)
    s = data["summary"]

    rows = "".join(
        f"<tr><td>{f['file']}</td><td>{f['function']}</td>"
        f"<td>{f['complexity']}</td><td>{f['maintainability']}</td>"
        f"<td>{f['line_count']}</td>"
        f"<td>{'Yes' if f['is_duplicate'] else 'No'}</td></tr>"
        for f in data["functions"]
    )

    html = f"""<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Code Quality Report</title>
<style>
body{{font-family:sans-serif;background:#0D1117;color:#c9d1d9;padding:2rem}}
h1{{color:#58A6FF}}table{{border-collapse:collapse;width:100%}}
th,td{{border:1px solid #30363D;padding:.5rem;text-align:left}}
th{{background:#161B22}}
</style></head>
<body>
<h1>Code Quality Report</h1>
<h2>Summary</h2>
<ul>
<li>Overall Score: {s['overall_score']}/100</li>
<li>Total Files: {s['total_files']}</li>
<li>Total Functions: {s['total_functions']}</li>
<li>Avg Complexity: {s['avg_complexity']}</li>
<li>Avg Maintainability: {s['avg_maintainability']}</li>
<li>Long Functions: {s['long_functions_count']}</li>
<li>Duplicates: {s['duplicates_count']}</li>
</ul>
<h2>Functions</h2>
<table>
<tr><th>File</th><th>Function</th><th>Complexity</th>
<th>Maintainability</th><th>Lines</th><th>Duplicate</th></tr>
{rows}
</table>
</body></html>"""

    return Response(
        content=html,
        media_type="text/html",
        headers={"Content-Disposition": "attachment; filename=report.html"},
    )


@router.post("/report/json")
async def report_json(
    file: Optional[UploadFile] = File(None),
    github_url: Optional[str] = Form(None),
    language: str = Form("python"),
):
    """Return a JSON report download."""
    data = await analyze(file=file, github_url=github_url, language=language)
    return Response(
        content=json.dumps(data, indent=2),
        media_type="application/json",
        headers={"Content-Disposition": "attachment; filename=report.json"},
    )


# ---------------------------------------------------------------------------
# Register API router — all endpoints are now reachable at /api/*
# ---------------------------------------------------------------------------
app.include_router(router)

# ---------------------------------------------------------------------------
# Static file serving — production only (frontend/dist must be built first).
# In development the Vite dev server serves the frontend instead.
# ---------------------------------------------------------------------------
_DIST = Path(__file__).parent.parent / "frontend" / "dist"

if _DIST.exists():
    # Serve compiled JS/CSS/image assets
    app.mount("/assets", StaticFiles(directory=str(_DIST / "assets")), name="assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_spa(full_path: str):
        """Return the requested file from the build output, or index.html for
        any path that doesn't correspond to a real file (SPA client-side routing)."""
        target = _DIST / full_path
        if target.is_file():
            return FileResponse(str(target))
        return FileResponse(str(_DIST / "index.html"))

from pathlib import Path


def scan_project(project_path: str) -> list[Path]:
    """
    Scan a project directory recursively and return all Python files.
    """

    python_files: list[Path] = []

    project = Path(project_path)

    for file in project.rglob("*.py"):
        python_files.append(file)

    return python_files
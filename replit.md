# Code Quality Analyzer

A modern web application that analyzes Python code quality metrics — cyclomatic complexity, maintainability, long functions, and duplicate detection.

## Architecture

```
/
├── analyzer/          # Existing Python analyzer engine (DO NOT MODIFY)
│   ├── scanner.py     # Recursive file scanner
│   ├── parser.py      # AST parser
│   ├── long_function.py
│   ├── complexity.py
│   ├── maintainability.py
│   ├── duplication.py
│   └── report.py
├── backend/           # FastAPI server
│   └── main.py        # REST API wrapping analyzer
├── frontend/          # React + TypeScript + Tailwind SPA
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── api.ts
│       └── types.ts
└── sample_project/    # Sample Python project for testing
```

## Running

Two workflows must run simultaneously:

- **Backend**: `uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload`
- **Frontend**: `cd frontend && npm run dev` (serves on port 5000, proxies `/api/*` → backend port 8000)

## Tech Stack

- **Backend**: Python 3, FastAPI, Uvicorn
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Framer Motion, Recharts, React Router

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Health check |
| GET | /languages | Available languages |
| POST | /analyze | Analyze ZIP or GitHub URL |

## User Preferences

- Keep the existing `analyzer/` modules unchanged — they are the analysis engine
- Professional dark theme matching GitHub/VS Code aesthetic
- Subtle animations only — no neon or excessive motion

import ast
from pathlib import Path


def parse_files(python_files: list[Path]) -> dict[Path, ast.AST]:
    """
    Parse Python files into AST objects.
    """

    parsed_files: dict[Path, ast.AST] = {}

    for file in python_files:
        try:
            code = file.read_text(encoding="utf-8")
            tree = ast.parse(code)
            parsed_files[file] = tree

        except SyntaxError as e:
            print(f"Syntax Error in {file}: {e}")

        except Exception as e:
            print(f"Error reading {file}: {e}")

    return parsed_files
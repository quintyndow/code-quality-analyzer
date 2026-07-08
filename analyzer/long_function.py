import ast
from pathlib import Path


def detect_long_functions(
    parsed_files: dict[Path, ast.AST],
    max_lines: int = 50
) -> list[dict]:
    """
    Detect functions whose length exceeds the given threshold.
    """

    long_functions = []

    for file, tree in parsed_files.items():

        for node in ast.walk(tree):

            if isinstance(node, ast.FunctionDef):

                line_count = node.end_lineno - node.lineno + 1

                if line_count > max_lines:
                    long_functions.append({
                        "file": file,
                        "function": node.name,
                        "line_count": line_count
                    })

    return long_functions
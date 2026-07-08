import ast
from pathlib import Path


def calculate_maintainability(
    parsed_files: dict[Path, ast.AST]
) -> list[dict]:
    """
    Calculate a simple maintainability score for each function.
    """

    results = []

    for file, tree in parsed_files.items():

        for node in ast.walk(tree):

            if isinstance(node, ast.FunctionDef):

                line_count = node.end_lineno - node.lineno + 1

                complexity = 1

                for child in ast.walk(node):

                    if isinstance(
                        child,
                        (
                            ast.If,
                            ast.For,
                            ast.While,
                            ast.Try,
                            ast.ExceptHandler,
                            ast.With,
                            ast.Match,
                        ),
                    ):
                        complexity += 1

                score = 100

                score -= line_count * 0.5
                score -= complexity * 5

                score = max(0, round(score, 2))

                results.append(
                    {
                        "file": file,
                        "function": node.name,
                        "maintainability": score,
                    }
                )

    return results
import ast
from pathlib import Path


def calculate_complexity(parsed_files: dict[Path, ast.AST]) -> list[dict]:
    """
    Calculate Cyclomatic Complexity for each function.
    """

    results = []

    complexity_nodes = (
        ast.If,
        ast.For,
        ast.While,
        ast.Try,
        ast.ExceptHandler,
        ast.With,
        ast.Match,
    )

    for file, tree in parsed_files.items():

        for node in ast.walk(tree):

            if isinstance(node, ast.FunctionDef):

                complexity = 1

                for child in ast.walk(node):

                    if isinstance(child, complexity_nodes):
                        complexity += 1

                results.append({
                    "file": file,
                    "function": node.name,
                    "complexity": complexity
                })

    return results
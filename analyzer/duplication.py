import ast
from pathlib import Path


def detect_duplicate_functions(
    parsed_files: dict[Path, ast.AST]
) -> list[dict]:
    """
    Detect duplicate function implementations.
    """

    results = []
    seen_functions = {}

    for file, tree in parsed_files.items():

        for node in ast.walk(tree):

            if isinstance(node, ast.FunctionDef):

                function_body = ast.dump(node, annotate_fields=False)

                if function_body in seen_functions:

                    previous = seen_functions[function_body]

                    results.append(
                        {
                            "original_file": previous["file"],
                            "original_function": previous["function"],
                            "duplicate_file": file,
                            "duplicate_function": node.name,
                        }
                    )

                else:

                    seen_functions[function_body] = {
                        "file": file,
                        "function": node.name,
                    }

    return results
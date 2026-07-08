def generate_report(
    long_functions,
    complexity_results,
    maintainability_results,
    duplicate_functions,
):
    print("=" * 60)
    print("           CODE QUALITY ANALYZER REPORT")
    print("=" * 60)

    print("\nLONG FUNCTIONS")
    print("-" * 30)

    if not long_functions:
        print("No long functions detected.")
    else:
        for item in long_functions:
            print(
                f"{item['file']} -> {item['function']} "
                f"({item['line_count']} lines)"
            )

    print("\nCOMPLEXITY")
    print("-" * 30)

    for item in complexity_results:
        print(
            f"{item['file']} -> "
            f"{item['function']} : {item['complexity']}"
        )

    print("\nMAINTAINABILITY")
    print("-" * 30)

    for item in maintainability_results:
        print(
            f"{item['file']} -> "
            f"{item['function']} : {item['maintainability']}"
        )

    print("\nDUPLICATE FUNCTIONS")
    print("-" * 30)

    if not duplicate_functions:
        print("No duplicate functions detected.")
    else:
        for item in duplicate_functions:
            print(
                f"{item['duplicate_file']} -> "
                f"{item['duplicate_function']}"
            )
            print(
                f"Duplicate of "
                f"{item['original_file']} -> "
                f"{item['original_function']}"
            )
            print()

    print("=" * 60)
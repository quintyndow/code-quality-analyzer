from analyzer.scanner import scan_project
from analyzer.parser import parse_files
from analyzer.long_function import detect_long_functions
from analyzer.complexity import calculate_complexity
from analyzer.maintainability import calculate_maintainability
from analyzer.duplication import detect_duplicate_functions
from analyzer.report import generate_report


def main():

    python_files = scan_project("sample_project")

    parsed_files = parse_files(python_files)

    long_functions = detect_long_functions(parsed_files)

    complexity = calculate_complexity(parsed_files)

    maintainability = calculate_maintainability(parsed_files)

    duplicates = detect_duplicate_functions(parsed_files)

    generate_report(
        long_functions,
        complexity,
        maintainability,
        duplicates,
    )


if __name__ == "__main__":
    main()
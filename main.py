from analyzer.scanner import scan_project
from analyzer.parser import parse_files

python_files = scan_project("sample_project")

parsed_files = parse_files(python_files)

for file, tree in parsed_files.items():
    print(file)
    print(type(tree))
    print("-" * 40)
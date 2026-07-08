export interface Language {
  id: string;
  name: string;
  available: boolean;
}

export interface FunctionResult {
  file: string;
  function: string;
  complexity: number;
  maintainability: number;
  line_count: number;
  is_long: boolean;
  is_duplicate: boolean;
}

export interface LongFunction {
  file: string;
  function: string;
  line_count: number;
}

export interface Duplicate {
  original_file: string;
  original_function: string;
  duplicate_file: string;
  duplicate_function: string;
}

export interface Summary {
  total_files: number;
  total_functions: number;
  avg_complexity: number;
  avg_maintainability: number;
  long_functions_count: number;
  duplicates_count: number;
  overall_score: number;
}

export interface AnalysisResult {
  summary: Summary;
  functions: FunctionResult[];
  long_functions: LongFunction[];
  duplicates: Duplicate[];
}

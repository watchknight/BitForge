export type Language = 'cpp' | 'python' | 'javascript';

export type DataStructureType = 'array' | 'linked-list' | 'tree' | 'graph' | 'grid';

export interface ComplexityInfo {
  bestTime: string;
  avgTime: string;
  worstTime: string;
  space: string;
  whyTime: string;
  whySpace: string;
}

export interface CommonMistake {
  title: string;
  misconception: string;
  fix: string;
  exampleSnippet?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TopicAnalogy {
  title: string;
  story: string;
  keyLesson: string;
}

export interface Topic {
  id: string;
  title: string;
  subtitle: string;
  categoryId: string;
  categoryName: string;
  dataStructureType: DataStructureType;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  analogy: TopicAnalogy;
  defaultInput: any;
  inputPlaceholder?: string;
  inputDescription?: string;
  complexity: ComplexityInfo;
  commonMistakes: CommonMistake[];
  quiz: QuizQuestion[];
  codeSnippets: Record<Language, string>;
  isFlagship: boolean;
}

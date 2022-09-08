import { IMapFile } from '@/types/cocos/MazeRover/Map.d';

export interface ILevelInfoJson {
  language: string[];
  description?: Record<string, string> | null;
  template: string;
  code?: Record<string, string> | null;
  showSnippetBar?: boolean;
  game: string;
  title: string;
  map: IMapFile;
  tips?: Record<string, string[]> | null;
  snippets?: string[];
}

export interface ICollectionItemJson {
  title: string;
  level?: number;
  id?: string;
  url?: string;
  language?: string[] | null;
  defaultLanguage?: string;
  snippets?: string[];
  questions?: (string | [string, number | number[]])[];
}

export interface IQuestionSubProblemJson {
  content: string;
  options: [string, boolean][];
  explanation: string;
  explanationVideo?: string | null;
  type: 'single';
  random?: boolean | null;
}

export interface IQuestionInfoJson {
  title?: string | null;
  type: string;
  content?: string | null;
  subproblems: IQuestionSubProblemJson[];
  explanation?: string | null;
}

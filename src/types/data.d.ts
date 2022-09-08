import { IMapFile } from '@/types/cocos/MazeRover/Map.d';

export type CodeLanguageType = 'cpp' | 'python' | 'scratch' | 'go';

export enum CollectionItemType {
  Empty,
  Level,
  Paper,
  Slide,
  Video,
  OJ,
  Questions,
}

export enum SubProblemType {
  Single = 'single',
}

export interface ILevelInfo {
  supportedLanguages: CodeLanguageType[];
  defaultLanguage?: CodeLanguageType;
  allowedSnippets?: string[];
  cocosHTMLUri: string;
  codeRunnerTemplate: string;
  showSnippetBar: boolean;
  defaultCode: Record<string, string>;
  description: Record<string, string>;
  tips: Record<string, string[]>;
  title: string;
  mapData: IMapFile | string;
}

export interface IQustionSubProblem {
  content: string;
  options: [string, boolean][];
  explanation: string;
  explanationVideo?: string;
  type: SubProblemType;
  optionMap: number[];
  optionMapRevert: number[];
}

export interface IQuestionInfo {
  title?: string;
  content?: string;
  explanation?: string;
  subProblems: IQustionSubProblem[];
}

export interface ICollectionItemBase {
  level: number;
  title: string;
  type: CollectionItemType;
  id?: string;
  rawId: string;
}

export interface ICollectionItemLevel extends ICollectionItemBase {
  type: CollectionItemType.Level;
  language: CodeLanguageType[];
  defaultLanguage?: CodeLanguageType;
  allowedSnippets?: string[];
}

export interface ICollectionItemVideo extends ICollectionItemBase {
  type: CollectionItemType.Video;
  url: string;
}

export interface ICollectionItemOJ extends ICollectionItemBase {
  type: CollectionItemType.OJ;
  id: string;
}

export interface ICollectionItemQuestions extends ICollectionItemBase {
  type: CollectionItemType.Questions;
  id: string;
  questions: string[];
  scores: Record<string, number[]>;
}

export interface ICollectionInfo {
  title: string;
  toc: ICollectionItemBase[];
}

export interface IPaperInfo {
  title: string;
  text: string;
}

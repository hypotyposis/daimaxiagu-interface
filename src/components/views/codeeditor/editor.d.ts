import { CSSProperties } from 'react';
import { OnChange as MonacoOnChange } from '@monaco-editor/react';
import { CodeMirrorOnChange } from './CodeMirrorEditor';
import { ScratchOnChange } from './ScratchEditor/ScratchEditor';

export interface IMixCodeEditorInstance {
  type: MixCodeEditorType;
  getValue: () => string;
  setValue: (value: string) => void;
  getCode: () => string;
  insert?: (value: string) => void;
}

export interface IMixCodeEditorArguments {
  editor?: MixCodeEditorType | 'auto';
  onMount?: (instance: IMixCodeEditorInstance) => unknown;
  onChange?: MonacoOnChange | CodeMirrorOnChange | ScratchOnChange;
  language?: string;
  code?: string;
  style?: CSSProperties;
  transparent?: boolean;
  readOnly?: boolean;
  throttleTime?: number;
}

export enum MixCodeEditorType {
  MonacoEditor = 'monaco',
  CodeMirrorNext = 'codemirror',
  Scratch = 'scratch',
}

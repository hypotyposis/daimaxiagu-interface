import React from 'react';
import Editor, {
  loader,
  OnChange as MonacoOnChange,
} from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import {
  IMixCodeEditorArguments,
  MixCodeEditorType,
  IMixCodeEditorInstance,
} from './editor.d';

import oneDarkTheme from './monaco-onedark-pro.json';
import { OSS_PUBLIC_ASSETS_BASE } from '@/utils/config';

const monacoTheme = oneDarkTheme;

// 使用 OSS
loader.config({
  paths: {
    vs: `${OSS_PUBLIC_ASSETS_BASE}/vs`,
  },
});

export class MonacoCodeEditorInstance implements IMixCodeEditorInstance {
  type: MixCodeEditorType = MixCodeEditorType.MonacoEditor;

  instance: editor.IStandaloneCodeEditor;

  constructor(instance: editor.IStandaloneCodeEditor) {
    this.instance = instance;
  }

  getValue() {
    return this.instance?.getValue() ?? '';
  }

  setValue(value: string) {
    this.instance?.setValue(value);
  }

  getCode() {
    return this.instance?.getValue() ?? '';
  }
}

const MonacoEditor = React.memo<IMixCodeEditorArguments>(
  ({ language, onMount, onChange, code }) => {
    const onMountFunctionRef = React.useRef(() => onMount);
    React.useEffect(() => {
      onMountFunctionRef.current = () => onMount;
    }, [onMount]);
    const onChangeFunctionRef = React.useRef(() => onChange);
    React.useEffect(() => {
      onChangeFunctionRef.current = () => onChange;
    }, [onChange]);
    return (
      <Editor
        height="100%"
        width="100%"
        language={language}
        theme="vs-dark"
        value={code ?? ''}
        options={{
          scrollBeyondLastLine: false,
          fontSize: 18,
          fontFamily:
            'Source Code Pro, Menlo, Monaco, "Courier New", monospace',
        }}
        onMount={(editorInstance, monaco) => {
          monaco.editor.defineTheme(
            'onedarkpro',
            monacoTheme as unknown as editor.IStandaloneThemeData,
          );
          monaco.editor.setTheme('onedarkpro');
          onMountFunctionRef.current()?.(
            new MonacoCodeEditorInstance(editorInstance),
          );
        }}
        onChange={onChangeFunctionRef.current() as MonacoOnChange}
      />
    );
  },
);

export default MonacoEditor;

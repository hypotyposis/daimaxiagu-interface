import React from 'react';
import CodeMirrorEditor from './CodeMirrorEditor';
import MonacoEditor from './MonacoEditor';
import ScratchEditor from './ScratchEditor/ScratchEditor';
import { IMixCodeEditorArguments, MixCodeEditorType } from './editor.d';

const MixCodeEditor = React.memo<IMixCodeEditorArguments>(
  ({
    editor = 'auto',
    onMount,
    onChange,
    language,
    code = '',
    style = {},
    transparent = false,
    readOnly = false,
    throttleTime = 0,
  }) => {
    if (language === 'scratch') {
      return (
        <ScratchEditor
          language={language}
          onMount={onMount}
          onChange={onChange}
          code={code}
          style={style}
          transparent={transparent}
          readOnly={readOnly}
          throttleTime={throttleTime}
        />
      );
    } else {
      switch (
        editor === 'auto' || editor === undefined
          ? MixCodeEditorType.CodeMirrorNext
          : editor
      ) {
        case MixCodeEditorType.MonacoEditor: {
          return (
            <MonacoEditor
              language={language}
              onMount={onMount}
              onChange={onChange}
              code={code}
              style={style}
              transparent={transparent}
              readOnly={readOnly}
              throttleTime={throttleTime}
            />
          );
        }
        case MixCodeEditorType.CodeMirrorNext: {
          return (
            <CodeMirrorEditor
              language={language}
              onMount={onMount}
              onChange={onChange}
              code={code}
              style={style}
              transparent={transparent}
              readOnly={readOnly}
              throttleTime={throttleTime}
            />
          );
        }
        default: {
          return <></>;
        }
      }
    }
  },
);

export default MixCodeEditor;

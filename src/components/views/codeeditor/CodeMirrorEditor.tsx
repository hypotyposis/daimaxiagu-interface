import React from 'react';
import { throttle, debounce } from 'lodash';
import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import {
  EditorView,
  ViewUpdate,
  keymap,
  drawSelection,
} from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { json } from '@codemirror/lang-json';
import { python } from '@codemirror/lang-python';
import { markdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';
import { autocompletion } from '@codemirror/autocomplete';
import {
  indentUnit,
  indentOnInput,
  getIndentation,
} from '@codemirror/language';
import { standardKeymap, indentWithTab } from '@codemirror/commands';
import {
  IMixCodeEditorArguments,
  MixCodeEditorType,
  IMixCodeEditorInstance,
} from './editor.d';

import './codemirror.css';

const codemirrorLanguage = EditorState.phrases.of({
  // @codemirror/view
  'Control character': '控制字符',
  // @codemirror/fold
  'Folded lines': '已折叠的行',
  'Unfolded lines': '未折叠的行',
  to: '至',
  'folded code': '已折叠的代码',
  unfold: '未折叠',
  'Fold line': '折叠该行',
  'Unfold line': '展开该行',
  // @codemirror/search
  'Go to line': '跳转至行',
  go: '跳转',
  Find: '查找',
  Replace: '替换',
  next: '下一个匹配项',
  previous: '上一个匹配项',
  all: '选择所有',
  'match case': '区分大小写',
  regexp: '使用正则表达式',
  replace: '替换',
  'replace all': '全部替换',
  close: '关闭',
  'current match': '当前匹配',
  'on line': '位于行上',
  // @codemirror/lint
  Diagnostics: '检查程序',
  'No diagnostics': '无检查程序',
});

export class CodeMirrorEditorInstance implements IMixCodeEditorInstance {
  type: MixCodeEditorType = MixCodeEditorType.CodeMirrorNext;

  instance: EditorView;

  setValue: (value: string) => void;

  constructor(view: EditorView) {
    this.instance = view;
    this.setValue = throttle(
      (value: string) => {
        this.instance.dispatch({
          changes: {
            from: 0,
            to: this.instance.state.doc.length,
            insert: value,
          },
        });
      },
      200,
      { leading: true, trailing: true },
    );
  }

  getValue() {
    return this.instance.state.doc.toString();
  }

  getCode() {
    return this.instance.state.doc.toString();
  }

  insert(value: string) {
    const { doc } = this.instance.state;
    const mainSelection = this.instance.state.selection.main;
    const lines = value.split('\n').map(s => s.trimEnd());
    const len = lines.length - 1;
    const beginWithNewLine = len > 0 && lines[0] === '';
    const baseIndent =
      getIndentation(this.instance.state, mainSelection.from) ?? 0;
    let indentText = '';
    for (let i = 0; i < baseIndent; i++) {
      indentText += ' ';
    }
    let onBlankLine = /^\s+$/.test(
      doc.sliceString(doc.lineAt(mainSelection.from).from, mainSelection.from),
    );
    const from = onBlankLine
      ? doc.lineAt(mainSelection.from).from
      : mainSelection.from;
    const _newLines: string[] = [];
    if (beginWithNewLine && !onBlankLine) {
      _newLines.push('');
      onBlankLine = true;
    }
    for (let i = beginWithNewLine ? 1 : 0; i <= len; i++) {
      _newLines.push(onBlankLine ? `${indentText}${lines[i]}` : lines[i]);
      onBlankLine = true;
    }
    this.instance.dispatch(
      {
        changes: { from, to: mainSelection.to, insert: '' },
      },
      this.instance.state.replaceSelection(_newLines.join('\n')),
    );
  }
}

export type CodeMirrorOnChange = (
  value: string,
  viewUpdate: ViewUpdate,
) => void;

const CodeMirrorEditor = React.memo<IMixCodeEditorArguments>(
  ({
    language,
    onMount,
    onChange,
    code,
    style = {},
    readOnly = false,
    throttleTime = 0,
  }) => {
    const refs = React.useRef<ReactCodeMirrorRef>();

    const _onChange: any = React.useMemo(
      () =>
        throttleTime > 0
          ? throttle(
              (value: string, viewUpdate: ViewUpdate) => {
                (onChange as CodeMirrorOnChange)?.(value, viewUpdate);
              },
              throttleTime,
              { leading: false, trailing: true },
            )
          : (value: string, viewUpdate: ViewUpdate) => {
              (onChange as CodeMirrorOnChange)?.(value, viewUpdate);
            },
      [onChange, throttleTime],
    );
    const onChangeFunctionRef = React.useRef(() => _onChange);
    React.useEffect(() => {
      onChangeFunctionRef.current = () => _onChange;
    }, [_onChange]);

    const _onMount = React.useMemo(() => {
      return debounce(() => {
        if (refs.current?.view !== undefined) {
          onMount?.(new CodeMirrorEditorInstance(refs.current.view));
        }
      }, 100);
    }, []);
    const onMountFunctionRef = React.useRef(() => _onMount);
    React.useEffect(() => {
      onMountFunctionRef.current = () => _onMount;
    }, [_onMount]);

    const extensions = React.useMemo(() => {
      const extensions = [
        autocompletion({
          activateOnTyping: true,
        }),
        codemirrorLanguage,
        EditorState.tabSize.of(4),
        indentUnit.of('    '),
        keymap.of(standardKeymap),
        keymap.of([indentWithTab]),
        drawSelection(),
        EditorView.editable.of(!readOnly),
      ];
      switch (language?.toLowerCase()) {
        case 'c':
        case 'cpp':
        case 'c++': {
          extensions.push(cpp());
          break;
        }
        case 'python':
        case 'python2':
        case 'python3': {
          extensions.push(python());
          break;
        }
        case 'java': {
          extensions.push(java());
          break;
        }
        case 'json': {
          extensions.push(json());
          break;
        }
        case 'md':
        case 'markdown': {
          extensions.push(markdown());
          break;
        }
        default: {
          break;
        }
      }
      extensions.push(indentOnInput());
      return extensions;
    }, [language, readOnly]);

    React.useEffect(() => {
      onMountFunctionRef.current()?.();
    }, [refs.current]);

    return (
      <CodeMirror
        ref={refs as any}
        extensions={extensions}
        height={'100%'}
        width={'100%'}
        value={code}
        autoFocus
        theme={oneDark}
        onChange={onChangeFunctionRef.current()}
        indentWithTab={false}
        style={{
          fontSize: 18,
          fontFamily:
            'Source Code Pro, Menlo, Monaco, "Courier New", monospace',
          height: '100%',
          width: '100%',
          ...style,
        }}
      />
    );
  },
);

export default CodeMirrorEditor;

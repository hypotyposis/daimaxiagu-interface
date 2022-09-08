import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { ILevelToolKit } from '.';

import { IMixCodeEditorInstance } from '@/components/views/codeeditor/editor.d';
import MixCodeEditor from '@/components/views/codeeditor/MixCodeEditor';
import { GameLevelSliceActions } from '@/utils/redux/gameLevel/slice';
import { useSelector, useAppDispatch } from '@/utils/redux/hooks';

export interface ICodeWorkspace {
  levelToolkit?: ILevelToolKit;
}

export default React.memo<ICodeWorkspace>(({ levelToolkit }) => {
  const dispatch = useAppDispatch();
  const codeTimestamp = useSelector(state => state.gameLevel.changeTimestamp);
  const currentLanguage = useSelector(state => state.gameLevel.currentLanguage);
  const allowedLanguages = useSelector(
    state => state.gameLevel.levelData!.supportedLanguages,
  );
  const defaultCode = useSelector(
    state =>
      state.gameLevel.levelData!.defaultCode[state.gameLevel.currentLanguage] ??
      '',
  );
  const code = useSelector(state => state.gameLevel.importedCode);
  const editorRef = React.useRef<IMixCodeEditorInstance>();
  const getCodeFunctionRef = React.useRef(() => code);
  React.useEffect(() => {
    if (code !== undefined) {
      editorRef.current?.setValue(code);
    }
    getCodeFunctionRef.current = () => code;
  }, [code, codeTimestamp]);
  return (
    <Box
      sx={{
        flexGrow: 1,
        position: 'relative',
        overflowY: 'auto',
      }}
    >
      {currentLanguage === 'scratch' &&
      allowedLanguages.indexOf('python') !== -1 ? (
        <Button
          variant="outlined"
          onClick={() => {
            const code = editorRef.current?.getCode?.() ?? '';
            dispatch(
              GameLevelSliceActions.setCode({ code, language: 'python' }),
            );
          }}
          sx={{
            position: 'absolute',
            right: '10px',
            top: '10px',
            zIndex: 10,
          }}
        >
          生成Python代码
        </Button>
      ) : (
        <Button
          variant="outlined"
          onClick={async () => {
            dispatch(GameLevelSliceActions.setCode(defaultCode));
          }}
          sx={{
            position: 'absolute',
            right: '10px',
            top: '10px',
            zIndex: 10,
          }}
        >
          重置代码
        </Button>
      )}
      <MixCodeEditor
        editor="auto"
        language={currentLanguage}
        throttleTime={1000}
        onMount={instance => {
          editorRef.current = instance;
          if (levelToolkit) {
            levelToolkit.editorInstance = instance;
          }
          instance.setValue(getCodeFunctionRef.current() ?? defaultCode);
        }}
        onChange={(value: string) => {
          dispatch(GameLevelSliceActions.updateCode(value));
        }}
      />
    </Box>
  );
});

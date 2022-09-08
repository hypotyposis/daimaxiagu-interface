import React from 'react';
import Box from '@mui/material/Box';

import { getOJDefaultCode } from '../middleware';

import HeadBar from './HeadBar';
import Console from './Console';
import SubmitButton from './SubmitButton';
import RunConsoleButton from './RunConsoleButton';
import ConsoleVisibleToggle from './ConsoleVisibleToggle';
import ImportSampleInputForm from './ImportSampleInputForm';

import { useSelector, useAppDispatch } from '@/utils/redux/hooks';
import { GameLevelSliceActions } from '@/utils/redux/gameLevel/slice';
import MixCodeEditor from '@/components/views/codeeditor/MixCodeEditor';
import { IMixCodeEditorInstance } from '@/components/views/codeeditor/editor.d';
import { SidebarTopPad } from '@/components/views/collection/Sidebar/SidebarContainer';

export default React.memo(() => {
  const dispatch = useAppDispatch();
  const currentLanguage = useSelector(
    state => state.gameLevel.ojCurrentLanguage,
  );
  const codeTimestamp = useSelector(state => state.gameLevel.ojChangeTimestamp);
  const code = useSelector(state => state.gameLevel.ojImportedCode);
  const editorRef = React.useRef<IMixCodeEditorInstance>();
  const getCodeFunctionRef = React.useRef(() => code);

  React.useEffect(() => {
    if (code !== undefined) {
      editorRef.current?.setValue?.(code);
    }
    getCodeFunctionRef.current = () => code;
  }, [code, codeTimestamp]);

  return (
    <Box
      sx={{
        height: '100%',
        flexGrow: 1,
        width: 0,
        position: 'relative',
        flexDirection: 'column',
        display: 'flex',
      }}
    >
      <HeadBar />
      <Box
        sx={{
          flexGrow: 1,
          position: 'relative',
          overflowY: 'auto',
        }}
      >
        <MixCodeEditor
          editor="auto"
          language={currentLanguage}
          throttleTime={1000}
          onMount={instance => {
            editorRef.current = instance;
            instance.setValue(
              getCodeFunctionRef.current() ?? getOJDefaultCode(currentLanguage),
            );
          }}
          onChange={(value: string) => {
            dispatch(GameLevelSliceActions.updateOJCode(value));
          }}
        />
      </Box>
      <Console />
      <SidebarTopPad
        sx={{
          flexShrink: 0,
          borderTop: '1px solid #fff2',
          background: '#0004',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          minHeight: '50px !important',
        }}
      >
        <Box>
          <ConsoleVisibleToggle />
          <ImportSampleInputForm />
        </Box>
        <Box>
          <RunConsoleButton />
          <SubmitButton />
        </Box>
      </SidebarTopPad>
    </Box>
  );
});

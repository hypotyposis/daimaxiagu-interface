import React from 'react';
import Box from '@mui/material/Box';
import { Resizable } from 're-resizable';

import { CocosCommandSender, CocosEventSender } from '../EmbeddedCocos';

import PhoneRotateMask from './PhoneRotateMask';
import EditorSideHeader from './EditorSideHeader';
import LevelDescription from './LevelDescription';
import CodeWorkspace from './CodeWorkspace';
import SnippetPicker from './SnippetPicker';
import GameContainer from './GameContainer';
import TipBox from './TipBox';
import SnackBarProvider, { SnackBarHandler } from './SnackBarProvider';
import ControlButtons from './ControlButtons';
import GameRecordButton from './GameRecorder';

import { IMixCodeEditorInstance } from '@/components/views/codeeditor/editor.d';

import './style.css';

export interface ILevelToolKit {
  subscribe: (
    eventName: string,
    handler: (eventName: string, eventData: unknown) => void,
  ) => string;
  subscribeOnce: (
    eventName: string,
    handler: (eventName: string, eventData: unknown) => void,
  ) => void;
  unsubscribe: (token: string) => void;
  editorInstance?: IMixCodeEditorInstance;
  commandSender?: CocosCommandSender;
  eventSender?: CocosEventSender;
  snackBarHandler?: SnackBarHandler;
  cocosIframe?: HTMLIFrameElement;
  runCode?: () => void;
}

export interface ILevelV2Props {
  hasNextLevel?: boolean;
  hasLastLevel?: boolean;
  onNextLevel?: () => void;
  onLastLevel?: () => void;
  onLevelPass?: () => void;
  hideCocos?: boolean;
  debugCocosUri?: string;
}

let pubSubIdCounter = 0;

export default React.memo<ILevelV2Props>(
  ({
    hasNextLevel = false,
    hasLastLevel = false,
    onNextLevel,
    onLastLevel,
    onLevelPass,
    hideCocos,
    debugCocosUri,
  }) => {
    const cocosPubSubId = React.useMemo(() => `${pubSubIdCounter++}`, []);
    const levelToolkit = React.useMemo<ILevelToolKit>(() => {
      return {
        subscribe(
          eventName: string,
          handler: (eventName: string, eventData: unknown) => void,
        ): string {
          return PubSub.subscribe(
            `cocos.${cocosPubSubId}.${eventName}`,
            handler,
          );
        },
        subscribeOnce(
          eventName: string,
          handler: (eventName: string, eventData: unknown) => void,
        ) {
          return PubSub.subscribeOnce(
            `cocos.${cocosPubSubId}.${eventName}`,
            handler,
          );
        },
        unsubscribe(token: string) {
          PubSub.unsubscribe(token);
        },
      };
    }, []);

    return (
      <>
        <PhoneRotateMask />
        <Box sx={{ width: '100%', height: '100%', display: 'flex' }}>
          <Resizable
            defaultSize={{ width: '50%', height: '100%' }}
            enable={{ right: true }}
            minWidth="200px"
            maxWidth="80%"
            style={{
              display: 'flex',
              flexDirection: 'column',
              flexWrap: 'nowrap',
              backgroundColor: '#282c34',
              position: 'relative',
            }}
            handleClasses={{
              right: 'editor-side-resize-bar',
            }}
            onResize={() => {
              window.dispatchEvent(new Event('resize'));
            }}
          >
            <EditorSideHeader
              hasNextLevel={hasNextLevel}
              hasLastLevel={hasLastLevel}
              onNextLevel={onNextLevel}
              onLastLevel={onLastLevel}
            />
            <LevelDescription />
            <CodeWorkspace levelToolkit={levelToolkit} />
            <SnippetPicker levelToolkit={levelToolkit} />
          </Resizable>
          <Box sx={{ height: '100%', flexGrow: 1, position: 'relative' }}>
            <SnackBarProvider levelToolkit={levelToolkit} />
            <GameContainer
              cocosPubSubId={cocosPubSubId}
              levelToolkit={levelToolkit}
              hide={hideCocos}
              debugCocosUri={debugCocosUri}
              onNextLevel={onNextLevel}
              onLevelPass={onLevelPass}
            />
            <TipBox />
            <ControlButtons levelToolkit={levelToolkit} />
            <GameRecordButton levelToolkit={levelToolkit} />
          </Box>
        </Box>
      </>
    );
  },
);

import React from 'react';
import Box from '@mui/material/Box';
import PubSub from 'pubsub-js';

import EmbeddedCocos from '../EmbeddedCocos';
import { getGameWebSocket } from '../../collection/gameMiddleware';
import { ILevelToolKit } from '.';

import { devMode } from '@/utils/config';
import { GameLevelSliceActions } from '@/utils/redux/gameLevel/slice';
import { useAppDispatch, useSelector } from '@/utils/redux/hooks';

export interface IGameContainer {
  cocosPubSubId: string;
  levelToolkit: ILevelToolKit;
  hide?: boolean;
  debugCocosUri?: string;
  onNextLevel?: () => void;
  onLevelPass?: () => void;
}

export default React.memo<IGameContainer>(
  ({
    hide = false,
    debugCocosUri,
    cocosPubSubId,
    levelToolkit,
    onNextLevel,
    onLevelPass,
  }) => {
    const dispatch = useAppDispatch();
    const cocosUri = useSelector(
      state => state.gameLevel.levelData!.cocosHTMLUri,
    );
    const sessionId = useSelector(state => state.gameLevel.gameSessionId);
    const levelId = useSelector(state => state.gameLevel.levelId);

    React.useEffect(() => {
      return () => {
        dispatch(
          GameLevelSliceActions.joinGameRoom({
            roomId: undefined,
            sessionId: undefined,
          }),
        );
      };
    }, []);

    React.useEffect(() => {
      dispatch(GameLevelSliceActions.setGameState('Loading'));
      levelToolkit.commandSender?.('SwitchLevel', { levelId });
    }, [levelId]);

    React.useEffect(() => {
      if (sessionId) {
        const gameWebSocket = getGameWebSocket(sessionId);
        if (gameWebSocket) {
          gameWebSocket.onmessage = event => {
            const data =
              typeof event.data === 'string'
                ? JSON.parse(event.data)
                : event.data;
            const { submissionId } = data;
            if (typeof data.command === 'string') {
              dispatch(GameLevelSliceActions.setGameState('Running'));
              const { command } = data;
              levelToolkit.commandSender?.('CommandsDispatch', {
                command,
                submissionId,
              });
            }
            if (
              typeof data.change === 'string' &&
              typeof data.id === 'string'
            ) {
              dispatch(GameLevelSliceActions.setGameState('Running'));
              const { change, id } = data;
              levelToolkit.commandSender?.('ChangesDispatch', {
                change,
                id,
                submissionId,
              });
            }
          };
        } else {
          console.error('游戏服务器失败!');
        }
      }
    }, [sessionId]);

    if (hide) {
      return (
        <Box
          sx={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'black',
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
          }}
        >
          <h1 style={{ color: 'white' }}>Game Window Here</h1>
        </Box>
      );
    } else {
      return (
        <EmbeddedCocos
          debugMode={debugCocosUri !== undefined || devMode}
          uri={debugCocosUri ?? cocosUri}
          onEvent={(event, data) => {
            PubSub.publish(`cocos.${cocosPubSubId}.${event}`, data);
            switch (event) {
              case 'JoinedRoomById': {
                const { roomId, sessionId } = data;
                dispatch(
                  GameLevelSliceActions.joinGameRoom({ roomId, sessionId }),
                );
                break;
              }
              case 'LoadMapComplete': {
                dispatch(GameLevelSliceActions.setGameState('Start'));
                break;
              }
              case 'GameAction': {
                if (data.action === 'GameComplete') {
                  onLevelPass?.();
                  dispatch(GameLevelSliceActions.setGameState('Start'));
                }
                break;
              }
              case 'NextGame': {
                onNextLevel?.();
                dispatch(GameLevelSliceActions.setGameState('Loading'));
                break;
              }
              default:
            }
          }}
          onMount={(commandSender, eventSender, cocosIframe) => {
            levelToolkit.commandSender = commandSender;
            levelToolkit.eventSender = eventSender;
            levelToolkit.cocosIframe = cocosIframe;
            dispatch(GameLevelSliceActions.setGameState('Loading'));
            commandSender('SwitchLevel', { levelId });
          }}
        />
      );
    }
  },
);

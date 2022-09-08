import React from 'react';
import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ErrorIcon from '@mui/icons-material/Error';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import StopIcon from '@mui/icons-material/Stop';
import AlertTitle from '@mui/material/AlertTitle';

import { ILevelToolKit } from '..';
import { checkError } from '../checkError';

import { postCode } from '@/utils/api/game';
import { GameLevelSliceActions } from '@/utils/redux/gameLevel/slice';
import { useSelector, useAppDispatch } from '@/utils/redux/hooks';

export interface IGameGoButtonProps {
  levelToolkit: ILevelToolKit;
}

export default React.memo<IGameGoButtonProps>(({ levelToolkit }) => {
  const dispatch = useAppDispatch();
  const gameState = useSelector(state => state.gameLevel.gameState);
  const sessionId = useSelector(state => state.gameLevel.gameSessionId);
  const roomId = useSelector(state => state.gameLevel.gameRoomId);
  const codeRunnerTemplate = useSelector(
    state => state.gameLevel.levelData!.codeRunnerTemplate,
  );
  const currentLanguage = useSelector(state => state.gameLevel.currentLanguage);
  const userId = useSelector(state => state.user.userId);
  const levelId = useSelector(state => state.gameLevel.levelId);
  const levelData = useSelector(state => state.gameLevel.levelData);
  const collectionId = useSelector(state => state.gameLevel.collectionId);
  const collectionData = useSelector(state => state.gameLevel.collectionData);

  const runCode = React.useCallback(() => {
    if (!sessionId || !roomId || !levelToolkit.editorInstance) {
      return;
    }
    const run = () => {
      const code = levelToolkit.editorInstance?.getCode() ?? '';
      postCode(
        code,
        codeRunnerTemplate,
        currentLanguage === 'scratch' ? 'python' : currentLanguage,
        sessionId,
        roomId,
        userId,
        collectionId,
        collectionData?.title ?? '',
        levelId,
        levelData!.title,
        (error, status, { message, offset }) => {
          if (error) {
            levelToolkit.eventSender?.('PopupMessage', {
              title: '网络错误',
              text: error.message,
              duration: 5000,
              severity: 'error',
            });
            dispatch(GameLevelSliceActions.setGameState('Error'));
          } else {
            switch (status) {
              case 'runtime complete': {
                levelToolkit.eventSender?.('PopupMessage', {
                  title: '运行完毕',
                  duration: 2000,
                  severity: 'success',
                });
                dispatch(GameLevelSliceActions.setGameState('Runned'));
                break;
              }
              case 'runtime terminated': {
                levelToolkit.eventSender?.('PopupMessage', {
                  title: '运行被终止',
                  duration: 2000,
                  severity: 'success',
                });
                dispatch(GameLevelSliceActions.setGameState('Runned'));
                break;
              }
              case 'compile failure': {
                levelToolkit.snackBarHandler?.push(
                  <>
                    <AlertTitle>编译错误</AlertTitle>
                    {checkError(
                      currentLanguage as any,
                      offset ?? 0,
                      'compile',
                      message,
                    ).map(({ line, column, message, type }) => (
                      <p key={message}>{`${
                        line <= 0 ? '' : `${line.toString()}行`
                      }${column <= 0 ? '' : `${column.toString()}列`}${
                        line > 0 && column > 0 ? ':\n' : ''
                      }${type ? `[${type}] ` : ''}${message}`}</p>
                    ))}
                  </>,
                  {
                    duration: -1,
                    severity: 'warning',
                  },
                );
                dispatch(GameLevelSliceActions.setGameState('Error'));
                break;
              }
              case 'runtime error': {
                levelToolkit.snackBarHandler?.push(
                  <>
                    <AlertTitle>运行错误</AlertTitle>
                    {checkError(
                      currentLanguage as any,
                      offset ?? 0,
                      'runtime',
                      message,
                    ).map(({ line, column, message, type }) => (
                      <p key={message}>{`${
                        line <= 0 ? '' : `${line.toString()}行`
                      }${column <= 0 ? '' : `${column.toString()}列`}${
                        line > 0 && column > 0 ? ':\n' : ''
                      }${type ? `[${type}] ` : ''}${message}`}</p>
                    ))}
                  </>,
                  {
                    duration: -1,
                    severity: 'warning',
                  },
                );
                dispatch(GameLevelSliceActions.setGameState('Error'));
                break;
              }
              default: {
                levelToolkit.eventSender?.('PopupMessage', {
                  title: '网络错误',
                  text: `unsupported status: ${status}`,
                  duration: 5000,
                  severity: 'error',
                });
                dispatch(GameLevelSliceActions.setGameState('Error'));
              }
            }
          }
        },
      );
    };
    dispatch(GameLevelSliceActions.setGameState('Compiling'));
    levelToolkit.commandSender?.('TryRandomizeMap', {}, (error, result) => {
      if (error) {
        console.error(error);
        dispatch(GameLevelSliceActions.setGameState('Error'));
      } else if (result) {
        levelToolkit.subscribeOnce('LoadMapComplete', () => {
          run();
        });
      } else {
        run();
      }
    });
  }, [
    levelToolkit,
    sessionId,
    roomId,
    codeRunnerTemplate,
    levelId,
    levelData,
    collectionId,
  ]);

  React.useEffect(() => {
    levelToolkit.runCode = runCode;
  }, [runCode]);

  return (
    <>
      <LoadingButton
        color={gameState === 'Error' ? 'error' : 'primary'}
        loading={gameState === 'Compiling' || gameState === 'Loading'}
        loadingPosition="center"
        sx={{
          position: 'absolute',
          bottom: '20px',
          cursor: `${gameState === 'Running' ? 'wait' : 'pointer'} !important`,
          pointerEvents: 'painted',
        }}
        variant="outlined"
        size="large"
        startIcon={
          {
            Start: <PlayArrowIcon />,
            Compiling: <PlayArrowIcon />,
            Running: <StopIcon />,
            Error: <ErrorIcon />,
            Runned: <PlayArrowIcon />,
            Loading: <PlayArrowIcon />,
          }[gameState]
        }
        onClick={() => {
          switch (gameState) {
            case 'Start': {
              runCode();
              break;
            }
            case 'Running': {
              levelToolkit.commandSender?.('CommandsExecutionAbort', {}, () => {
                dispatch(GameLevelSliceActions.setGameState('Runned'));
              });
              break;
            }
            case 'Runned': {
              dispatch(GameLevelSliceActions.setGameState('Loading'));
              levelToolkit.subscribeOnce('LoadMapComplete', () => {
                dispatch(GameLevelSliceActions.setGameState('Compiling'));
                runCode();
              });
              levelToolkit.commandSender?.('ReloadGameState', {});
              break;
            }
            case 'Error': {
              dispatch(GameLevelSliceActions.setGameState('Runned'));
              levelToolkit.snackBarHandler?.clear?.();
              break;
            }
            default: {
              break;
            }
          }
        }}
      >
        {
          {
            Start: '运行我的代码',
            Compiling: '',
            Running: '停止',
            Error: '编译错误',
            Runned: '复位并运行我的代码',
            Loading: '',
          }[gameState]
        }
      </LoadingButton>
      {gameState === 'Runned' ? (
        <Button
          color="success"
          sx={{
            position: 'absolute',
            bottom: '75px',
            pointerEvents: 'painted',
          }}
          variant="outlined"
          size="large"
          startIcon={<RestartAltIcon />}
          onClick={() => {
            levelToolkit.commandSender?.('ReloadGameState', {});
            dispatch(GameLevelSliceActions.setGameState('Start'));
          }}
        >
          复位
        </Button>
      ) : (
        <></>
      )}
    </>
  );
});

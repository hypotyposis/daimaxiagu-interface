import React, { ReactNode } from 'react';
import Alert, { AlertColor } from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import AlertTitle from '@mui/material/AlertTitle';

import { ILevelToolKit } from '.';

import { useSelector } from '@/utils/redux/hooks';

export type PushSnackBarFunction = (
  content: ReactNode,
  options?: {
    severity?: AlertColor;
    duration?: number;
    variant?: 'standard' | 'filled' | 'outlined';
    onClose?: (id: string) => unknown;
  },
) => string;
export type PopSnackBarFunction = (snackBarId: string) => void;

export interface SnackBarHandler {
  push: PushSnackBarFunction;
  pop: PopSnackBarFunction;
  clear: (severity?: AlertColor) => void;
}

interface SnackBarInfo {
  content: ReactNode;
  severity?: AlertColor;
  variant?: 'standard' | 'filled' | 'outlined';
  timerId?: NodeJS.Timeout;
  onClose?: (id: string) => unknown;
}

type SnackBarMap = Record<string, SnackBarInfo>;

export interface ISnackBarProviderProps {
  levelToolkit: ILevelToolKit;
  canClose?: boolean;
}

const SnackBarProvider: React.NamedExoticComponent<ISnackBarProviderProps> =
  React.memo<ISnackBarProviderProps>(({ levelToolkit, canClose = true }) => {
    const levelId = useSelector(state => state.gameLevel.levelId);
    const snackBarMap = React.useRef<SnackBarMap>({});
    const setTmp = React.useState('')[1];
    const idCounter = React.useRef({ count: 0 }).current;
    const pushSnackbar = React.useCallback<PushSnackBarFunction>(
      (content, options) => {
        const id = (idCounter.count++).toString();
        const snackBarInfo: SnackBarInfo = {
          content,
          severity: options?.severity ?? 'info',
          variant: options?.variant ?? 'filled',
        };
        if (options?.onClose) {
          snackBarInfo.onClose = options?.onClose;
        }
        const duration = options?.duration ?? 3000;
        if (duration > 0) {
          snackBarInfo.timerId = setTimeout(() => {
            snackBarMap.current[id].onClose?.(id);
            if (id in snackBarMap.current) {
              delete snackBarMap.current[id];
              setTmp(`-${id}`);
            }
          }, duration);
        }
        snackBarMap.current[id] = snackBarInfo;
        setTmp(`+${id}`);
        return id;
      },
      [],
    );
    const popSnackbar = React.useCallback<PopSnackBarFunction>(
      (snackBarId: string) => {
        if (snackBarId in snackBarMap.current) {
          if (snackBarMap.current[snackBarId].timerId) {
            clearTimeout(snackBarMap.current[snackBarId].timerId as any);
          }
          snackBarMap.current[snackBarId].onClose?.(snackBarId);
          delete snackBarMap.current[snackBarId];
          setTmp(`-${snackBarId}`);
        }
      },
      [],
    );
    const clearSnackBar = React.useCallback<(severity?: AlertColor) => void>(
      severity => {
        const key = Object.keys(snackBarMap.current);
        const len = key.length;
        for (let i = 0; i < len; i++) {
          const snackBarInfo = snackBarMap.current[key[i]];
          if (severity && severity !== snackBarInfo.severity) {
            continue;
          }
          if (snackBarInfo.timerId) {
            clearTimeout(snackBarInfo.timerId);
          }
          snackBarInfo.onClose?.(key[i]);
          if (severity) {
            delete snackBarMap.current[key[i]];
          }
        }
        if (!severity) {
          snackBarMap.current = {};
        }
        setTmp(`clear`);
      },
      [],
    );
    React.useEffect(() => {
      clearSnackBar();
    }, [levelId]);
    React.useEffect(() => {
      levelToolkit.snackBarHandler = {
        push: pushSnackbar,
        pop: popSnackbar,
        clear: clearSnackBar,
      };
      const token = levelToolkit.subscribe(
        'PopupMessage',
        (_event, data: any) => {
          pushSnackbar(
            <>
              <AlertTitle>{(data?.title as string) ?? '游戏消息'}</AlertTitle>
              {(data?.text as string) ?? ''}
            </>,
            {
              duration: (data?.duration as number) ?? -1,
              severity: ({
                success: 'success',
                info: 'info',
                warning: 'warning',
                error: 'error',
              }[data?.severity as string] ?? 'info') as AlertColor,
            },
          );
        },
      );
      return () => {
        levelToolkit.unsubscribe(token);
        const keys = Object.keys(snackBarMap.current) as unknown as number[];
        for (let i = 0, len = keys.length; i < len; i++) {
          const snackBarInfo = snackBarMap.current[keys[i]];
          if (snackBarInfo.timerId !== undefined) {
            clearTimeout(snackBarInfo.timerId);
          }
        }
      };
    }, [levelToolkit]);
    return (
      <Stack
        sx={{
          position: 'absolute',
          width: '100%',
          top: '0',
          left: '0',
          right: '0',
          padding: '10px',
        }}
        spacing={2}
      >
        {Object.keys(snackBarMap.current).map((id: string) => {
          const snackBarInfo = snackBarMap.current[id];
          return (
            <Alert
              sx={{
                pointerEvents: 'painted',
              }}
              key={id}
              variant={snackBarInfo.variant}
              severity={snackBarInfo.severity}
              onClose={
                canClose
                  ? () => {
                      if (id in snackBarMap.current) {
                        delete snackBarMap.current[id];
                        setTmp(`-${id}`);
                      }
                      if (snackBarInfo.timerId !== undefined) {
                        clearTimeout(snackBarInfo.timerId);
                      }
                      snackBarInfo.onClose?.(id);
                    }
                  : undefined
              }
            >
              {snackBarInfo.content}
            </Alert>
          );
        })}
      </Stack>
    );
  });

export default SnackBarProvider;

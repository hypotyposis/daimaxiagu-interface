import React from 'react';

export type CocosCommandSender<
  T extends Record<string, unknown> = Record<string, unknown>,
  R = unknown,
> = (
  command: string,
  args: T,
  callback?: (error: Error, result?: R) => void,
) => void;

export type CocosEventSender = (
  event: string,
  data?: Record<string, unknown>,
) => void;

interface IEmbeddedCocosArguments {
  uri: string;
  debugMode?: boolean;
  sleep?: boolean;
  style?: React.CSSProperties;
  onEvent?: (event: string, data: Record<string, unknown>) => unknown;
  onMount?: (
    commandSender: CocosCommandSender,
    eventSender: CocosEventSender,
    cocosIframe: HTMLIFrameElement,
  ) => unknown;
}

interface ICocosIncomeMessage {
  namespace: 'cocos';
  id: string;
  type: string;
  token?: string;
  command?: string;
  error?: string;
  result?: unknown;
  event?: string;
  data?: unknown;
}

export interface ICocosMessage {
  data?: unknown;
  id?: string;
  message: string;
}

let nextCocosFrameId = 0;
const EmbeddedCocos: React.NamedExoticComponent<IEmbeddedCocosArguments> =
  React.memo<IEmbeddedCocosArguments>(
    ({ uri, debugMode, style = {}, onEvent, onMount, sleep = false }) => {
      const id = React.useState(() => {
        // 不能直接写成 nextCocosFrameId++，不然每次渲染都会让其增加
        return nextCocosFrameId++;
      })[0];
      const iframeRef = React.useRef<HTMLIFrameElement>(null);
      const onEventFunctionRef = React.useRef(() => onEvent);
      React.useEffect(() => {
        onEventFunctionRef.current = () => onEvent;
      }, [onEvent]);

      const sendMessage = React.useCallback(
        (message: Record<string, unknown>) => {
          (
            document.querySelector(
              `iframe#embedded-cocos-container-${id}`,
            ) as HTMLIFrameElement
          )?.contentWindow?.postMessage?.(
            {
              namespace: 'cocos',
              ...message,
            },
            '*',
          );
        },
        [id],
      );

      React.useEffect(() => {
        let cocosToken: string;
        let pingToken: string;
        const callbackResolveMap: Record<
          string,
          Record<string, (value: [any, any] | PromiseLike<[any, any]>) => void>
        > = {};
        const messageListener = (event: MessageEvent) => {
          if (
            typeof event.data !== 'object' ||
            event.data.namespace !== 'cocos'
          ) {
            return;
          }
          const cocosMessage = event.data as ICocosIncomeMessage;
          if (cocosToken === cocosMessage.id) {
            switch (cocosMessage.type) {
              case 'event': {
                onEventFunctionRef.current()?.(
                  cocosMessage.event!,
                  cocosMessage.data as Record<string, unknown>,
                );
                break;
              }
              case 'callback': {
                callbackResolveMap[cocosMessage.command!]?.[
                  cocosMessage.token!
                ]?.([cocosMessage.error, cocosMessage.result]);
                if (
                  callbackResolveMap[cocosMessage.command!]?.[
                    cocosMessage.token!
                  ] !== undefined
                ) {
                  if (
                    callbackResolveMap[cocosMessage.command!][
                      cocosMessage.token!
                    ].length === 1
                  ) {
                    delete callbackResolveMap[cocosMessage.command!];
                  } else {
                    delete callbackResolveMap[cocosMessage.command!][
                      cocosMessage.token!
                    ];
                  }
                }
                break;
              }
              default:
                break;
            }
          } else if (cocosMessage.type === 'hook') {
            pingToken = new Date().getTime().toString();
            sendMessage({ type: 'ping', pingToken, debug: debugMode });
          } else if (
            cocosMessage.type === 'pong' &&
            cocosMessage.token === pingToken
          ) {
            cocosToken = cocosMessage.id;
            sendMessage({ type: sleep ? 'sleep' : 'wake' });
            onMount?.(
              async (command, args, callback) => {
                const [error, result]: [Error, unknown] = await new Promise(
                  resolve => {
                    if (callbackResolveMap[command] === undefined) {
                      callbackResolveMap[command] = {};
                    }
                    const commandToken = new Date().getTime().toString();
                    callbackResolveMap[command][commandToken] = resolve;
                    sendMessage({
                      type: 'command',
                      commandName: command,
                      commandArgs: args,
                      commandToken,
                    });
                  },
                );
                callback?.(error, result);
              },
              async (event, data) => {
                sendMessage({
                  type: 'event',
                  eventMessage: event,
                  eventData: data,
                });
              },
              iframeRef.current as HTMLIFrameElement,
            );
          }
        };
        window?.addEventListener?.('message', messageListener);
        return () => {
          window?.removeEventListener?.('message', messageListener);
        };
      }, [uri]);

      React.useEffect(() => {
        sendMessage({ type: sleep ? 'sleep' : 'wake' });
      }, [sleep]);

      return (
        <iframe
          style={{ width: '100%', height: '100%', borderWidth: '0', ...style }}
          id={`embedded-cocos-container-${id}`}
          ref={iframeRef}
          src={uri}
        />
      );
    },
  );

export default EmbeddedCocos;

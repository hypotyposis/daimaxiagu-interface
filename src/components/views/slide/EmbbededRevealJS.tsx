import React from 'react';

export type RevealJSEvent = any;

export type SendRevealJSMessageFunction = (
  method: string,
  callback?: (result: any) => undefined,
  ...args: any[]
) => void;

interface IEmbbedRevealJSArguments {
  uri: string;
  onMessage?: (eventName: string, event: RevealJSEvent) => unknown;
  getSendMessage?: (sendMessage: SendRevealJSMessageFunction) => unknown;
}

let nextRevealJSFrameId = 0;
const EmbbedRevealJS: React.NamedExoticComponent<IEmbbedRevealJSArguments> =
  React.memo<IEmbbedRevealJSArguments>(({ uri, onMessage, getSendMessage }) => {
    const id = React.useState(() => {
      // 不能直接写成 nextRevealJSFrameId++，不然每次渲染都会让其增加
      return nextRevealJSFrameId++;
    })[0];

    React.useEffect(() => {
      getSendMessage?.((method, callback, args) => {
        const callbackListener = (event: MessageEvent) => {
          if (typeof event.data !== 'string') {
            return;
          }
          try {
            const data = JSON.parse(event.data);
            if (
              data.namespace === 'reveal' &&
              data.eventName === 'callback' &&
              data.method === method
            ) {
              callback?.(data.result);
              window?.removeEventListener?.('message', callbackListener);
            }
          } catch (e) {}
        };
        window?.addEventListener?.('message', callbackListener);
        (
          document.querySelector(
            `iframe#embedded-revealjs-container-${id}`,
          ) as HTMLIFrameElement
        )?.contentWindow?.postMessage?.(
          JSON.stringify({ method, args: [...(args ?? [])] }),
          '*',
        );
      });
    }, [id]);

    React.useEffect(() => {
      const messageListener = (event: MessageEvent) => {
        if (typeof event.data !== 'string') {
          return;
        }
        try {
          const data = JSON.parse(event.data);
          if (data.namespace === 'reveal') {
            onMessage?.(data.eventName, data);
          }
        } catch (e) {}
      };
      window?.addEventListener?.('message', messageListener);
      return () => {
        window?.removeEventListener?.('message', messageListener);
      };
    }, [onMessage, id]);

    return (
      <iframe
        style={{ width: '100%', height: '100%', borderWidth: '0' }}
        id={`embedded-revealjs-container-${id}`}
        src={uri}
      />
    );
  });

export default EmbbedRevealJS;

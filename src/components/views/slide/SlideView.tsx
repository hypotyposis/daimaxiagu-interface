import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { SxProps } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

import { MEDIA_RESOURCE_BASE } from '@/utils/config';
import { play } from '@/utils/audioplay';
import { getSlideData, getJsonPathFromId } from '@/utils/api/getData';
import LoadingMask from '@/components/LoadingMask';
import EmbbedRevealJS, {
  SendRevealJSMessageFunction,
  RevealJSEvent,
} from '@/components/views/slide/EmbbededRevealJS';

export interface ISlideViewProps {
  slideId: string;
  setTitle?: (title: string) => unknown;
  style?: SxProps;
  onMessage?: (eventName: string, event: RevealJSEvent) => unknown;
  getSendMessage?: (sendMessage: SendRevealJSMessageFunction) => unknown;
  onLastView?: () => unknown;
  onNextView?: () => unknown;
}

const SlideView = React.memo<ISlideViewProps>(
  ({
    slideId,
    setTitle,
    style,
    onMessage,
    getSendMessage,
    onLastView,
    onNextView,
  }) => {
    const [slideInfo, setSlideInfo] = React.useState<string | undefined>();
    const [errorStr, setErrorStr] = React.useState<string | undefined>('');
    const sendMessageRef = React.useRef<SendRevealJSMessageFunction>();

    const handleMessage = React.useCallback(
      (eventName: string, event: RevealJSEvent) => {
        switch (eventName) {
          case 'slideHeadOverflow': {
            onLastView?.();
            break;
          }
          case 'slideTailOverflow': {
            onNextView?.();
            break;
          }
          case 'ready':
          case 'slidechanged': {
            play(
              `${MEDIA_RESOURCE_BASE}/slides-audio/${getJsonPathFromId(
                slideId,
              )}/${(event.state.indexh as number) + 1}.mp3`,
            );
            break;
          }
          default: {
            break;
          }
        }
        onMessage?.(eventName, event);
      },
      [slideId, onMessage],
    );

    const getSlide = React.useCallback(() => {
      setErrorStr('');
      getSlideData(
        slideId,
        (slideUri: string) => {
          setSlideInfo(slideUri);
          setTitle?.(`${slideId} - 代码峡谷编程`);
          setErrorStr(undefined);
        },
        (error: string) => {
          setSlideInfo(undefined);
          setTitle?.('出错啦');
          setErrorStr(error);
        },
      );
    }, [slideId]);

    React.useEffect(() => {
      getSlide();
    }, [slideId]);

    const maskContent = React.useMemo(() => {
      if (errorStr === undefined) {
        return <></>;
      } else if (errorStr === '') {
        return <h1>加载中...</h1>;
      } else {
        return (
          <>
            <h1>出错啦</h1>
            <p style={{ color: '#f44336' }}>{`Message: ${errorStr}`}</p>
            <br />
            <Button
              startIcon={<RefreshIcon />}
              onClick={() => getSlide()}
              size="large"
            >
              点击刷新
            </Button>
          </>
        );
      }
    }, [errorStr]);

    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          ...(style ?? {}),
        }}
      >
        <LoadingMask
          show={errorStr !== undefined}
          loadingIcon={errorStr === ''}
          content={maskContent}
        >
          {slideInfo ? (
            <EmbbedRevealJS
              uri={slideInfo}
              onMessage={handleMessage}
              getSendMessage={(sendMessage: SendRevealJSMessageFunction) => {
                sendMessageRef.current = sendMessage;
                getSendMessage?.(sendMessage);
              }}
            />
          ) : (
            <></>
          )}
        </LoadingMask>
      </Box>
    );
  },
);

export default SlideView;

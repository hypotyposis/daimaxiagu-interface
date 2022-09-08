import React from 'react';
import canvasRecord from 'canvas-record';

import { ILevelToolKit } from '..';
import DIYModel from './DIYModel';
import { GameLevelSliceActions } from '@/utils/redux/gameLevel/slice';
import { useSelector, useAppDispatch } from '@/utils/redux/hooks';
import { uploadHighlight } from '@/utils/api/game-highlight';
import LoadingMask from '@/components/LoadingMask';

export interface IGameRecordButtonProprs {
  levelToolkit: ILevelToolKit;
}

export default React.memo<IGameRecordButtonProprs>(({ levelToolkit }) => {
  const dispatch = useAppDispatch();
  const userId = useSelector(state => state.user.userId);
  const [maskText, setMaskText] = React.useState<string | undefined>();
  const [videoId, setVideoId] = React.useState<string | undefined>();
  const [posterUrl, setPosterUrl] = React.useState<string | undefined>();
  const supportedMIMEType = React.useMemo<string | undefined>(() => {
    const backdropList = ['video/mp4', 'video/webm;codecs=vp8', 'video/webm'];
    const len = backdropList.length;
    for (let i = 0; i < len; i++) {
      const type = backdropList[i];
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return undefined;
  }, []);
  React.useEffect(() => {
    const id = levelToolkit.subscribe('ShareGame', () => {
      const canvasDom =
        levelToolkit.cocosIframe?.contentDocument?.querySelector?.(
          'canvas#GameCanvas',
        );
      if (
        canvasDom === undefined ||
        canvasDom === null ||
        supportedMIMEType === undefined
      ) {
        return;
      }
      levelToolkit.cocosIframe!.style.height = `${
        844 / window.devicePixelRatio
      }px`;
      levelToolkit.cocosIframe!.style.width = `${
        390 / window.devicePixelRatio
      }px`;
      const filename = `${userId}-${new Date().getTime()}.${
        supportedMIMEType === 'video/mp4' ? 'mp4' : 'webm'
      }`;
      setMaskText('正在重新加载地图');
      dispatch(GameLevelSliceActions.setGameState('Compiling'));
      const canvasRecorder = canvasRecord(canvasDom as HTMLCanvasElement, {
        filename,
        frameRate: 30,
        download: false,
        recorderOptions: {
          mimeType: supportedMIMEType,
        },
      });
      levelToolkit.subscribeOnce('LoadMapComplete', () => {
        canvasRecorder.start();
      });
      setMaskText('正在回放关卡并录制视频');
      levelToolkit.commandSender?.('Replay', {}, async () => {
        levelToolkit.cocosIframe!.style.height = '100%';
        levelToolkit.cocosIframe!.style.width = '100%';
        setMaskText('视频上传中 0%');
        await uploadHighlight(
          canvasRecorder.stop(),
          userId as number,
          filename,
          /* eslint-disable max-nested-callbacks */
          (percent: number) => {
            setMaskText(`视频上传中 ${percent}%`);
            if (percent >= 100) {
              setMaskText('视频转码中');
            }
          },
          (videoId: string, posterUri: string) => {
            setVideoId(videoId);
            setPosterUrl(posterUri);
            canvasRecorder.dispose();
            dispatch(GameLevelSliceActions.setGameState('Runned'));
            setMaskText('等待您完成编辑');
          },
          () => {
            canvasRecorder.dispose();
            dispatch(GameLevelSliceActions.setGameState('Runned'));
            setMaskText(undefined);
            // eslint-disable-next-line no-alert
            alert('上传出错!');
          },
          /* eslint-enable max-nested-callbacks */
        );
      });
    });
    return () => {
      levelToolkit.unsubscribe(id);
    };
  }, [levelToolkit]);

  return (
    <>
      <LoadingMask
        show={maskText !== undefined}
        content={
          <>
            <h2>{maskText}</h2>
            <p>生成短视频后可扫码分享至朋友圈哦</p>
          </>
        }
      />
      <DIYModel
        show={videoId !== undefined}
        onClose={() => {
          setVideoId(undefined);
          setPosterUrl(undefined);
          setMaskText(undefined);
        }}
        videoId={videoId!}
        posterUrl={posterUrl ?? ''}
      />
    </>
  );
});

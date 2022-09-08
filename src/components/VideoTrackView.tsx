import React from 'react';
import Box from '@mui/material/Box';
import { SxProps } from '@mui/material';
import { IRemoteVideoTrack, VideoPlayerConfig } from 'agora-rtc-sdk-ng';

export interface IVideoTrackViewProps {
  track: IRemoteVideoTrack;
  style?: SxProps;
  videoConfig?: VideoPlayerConfig;
  hwRatio?: number | 'auto';
}

export default React.memo<IVideoTrackViewProps>(
  ({ track, style = {}, hwRatio = 'auto', videoConfig }) => {
    const trackPlayerContainerRef = React.useRef<HTMLDivElement>(null);
    const [_hwRatio, setHWRation] = React.useState('0');
    React.useMemo(() => {
      if (hwRatio === 'auto') {
        setHWRation(
          `${
            ((track?.getStats?.()?.receiveResolutionHeight ?? 0) /
              Math.max(1, track?.getStats?.()?.receiveResolutionWidth ?? 1)) *
            100
          }%`,
        );
      } else {
        setHWRation(`${hwRatio * 100}%`);
      }
    }, [hwRatio, track]);

    React.useEffect(() => {
      if (trackPlayerContainerRef.current) {
        track.play(trackPlayerContainerRef.current, videoConfig);
        track.once('first-frame-decoded', () => {
          if (hwRatio !== 'auto') {
            return;
          }
          const timerId = setInterval(() => {
            if (!track?.getStats?.()?.receiveResolutionWidth) {
              return;
            }
            clearInterval(timerId);
            setHWRation(
              `${
                ((track?.getStats?.()?.receiveResolutionHeight ?? 0) /
                  Math.max(
                    1,
                    track?.getStats?.()?.receiveResolutionWidth ?? 1,
                  )) *
                100
              }%`,
            );
          }, 100);
        });
      }
    }, [trackPlayerContainerRef.current, track]);

    return (
      <Box
        ref={trackPlayerContainerRef}
        sx={{
          paddingTop: _hwRatio,
          '& > div': {
            position: 'absolute !important',
            top: '0px',
          },
          ...style,
        }}
      />
    );
  },
);

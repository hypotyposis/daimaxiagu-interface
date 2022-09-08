import React from 'react';
import { SxProps } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';

export interface IVideoViewProps {
  src: string;
  style?: SxProps;
  hasLastView?: boolean;
  hasNextView?: boolean;
  onLastView?: () => unknown;
  onNextView?: () => unknown;
}

export default React.memo<IVideoViewProps>(
  ({
    src,
    style = {},
    hasLastView = false,
    hasNextView = false,
    onLastView,
    onNextView,
  }) => {
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const [pauseMask, setPauseMask] = React.useState<boolean>(true);
    React.useEffect(() => {
      if (videoRef.current) {
        (globalThis as any).$video = videoRef.current;
        const video = videoRef.current;
        (async () => {
          try {
            await video.play();
            setPauseMask(false);
          } catch (e) {
            setPauseMask(true);
          }
          video.onended = () => setPauseMask(true);
          video.onpause = () => setPauseMask(true);
          video.onplay = () => setPauseMask(false);
        })();
      }
    }, [videoRef.current]);

    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexWrap: 'nowrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          ...style,
        }}
      >
        <video
          ref={videoRef}
          width="100%"
          height="100%"
          controls
          playsInline
          src={src}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />
        {pauseMask ? (
          <>
            <Button
              sx={{
                padding: '20px',
                fontSize: '30px',
                marginLeft: '10px',
                background: '#000A',
                backdropFilter: 'blur(5px)',
              }}
              size="large"
              variant="outlined"
              disabled={!hasLastView}
              onClick={onLastView}
              startIcon={
                <SkipPreviousIcon
                  sx={{
                    fontSize: '40px !important',
                  }}
                />
              }
            >
              上一关
            </Button>
            <Button
              sx={{
                padding: '20px',
                fontSize: '30px',
                marginRight: '10px',
                background: '#000A',
                backdropFilter: 'blur(5px)',
              }}
              size="large"
              variant="outlined"
              disabled={!hasNextView}
              onClick={onNextView}
              endIcon={
                <SkipNextIcon
                  sx={{
                    fontSize: '40px !important',
                  }}
                />
              }
            >
              下一关
            </Button>
          </>
        ) : (
          <></>
        )}
      </Box>
    );
  },
);

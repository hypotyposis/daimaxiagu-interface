import React from 'react';
import Player from 'xgplayer';
import Service from 'xgplayer-service';
import Box from '@mui/material/Box';
import { SxProps } from '@mui/material';
import { getPlayAuth } from '@/utils/api/xigua-vod';

export interface IVODPlayerProps {
  vid: string;
  options?: any;
  style?: SxProps;
  onMount?: (player: Player, dom: HTMLVideoElement) => void;
}

export default React.memo<IVODPlayerProps>(
  ({ vid, options = {}, style = {}, onMount }) => {
    const vodPlayerRef = React.useRef<Player>();
    const playerDomRef = React.useRef<HTMLDivElement>(null);
    React.useEffect(() => {
      (async () => {
        const playAuthToken = await getPlayAuth(vid);
        const { PlayInfoList } = await Service.url(
          playAuthToken,
          '//vod.volcengineapi.com',
        );
        vodPlayerRef.current = new Player({
          el: playerDomRef.current!,
          url: PlayInfoList[0].MainPlayUrl,
          height: '100%',
          width: '100%',
          ...options,
        });
        const videoDom = playerDomRef.current!.querySelector('video');
        onMount?.(vodPlayerRef.current, videoDom as HTMLVideoElement);
      })();
      return () => {
        vodPlayerRef.current?.destroy?.();
      };
    }, [vid]);

    return (
      <Box
        sx={{ width: '100%', height: '100%', ...style }}
        ref={playerDomRef}
      />
    );
  },
);

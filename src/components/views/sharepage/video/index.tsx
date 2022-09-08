import React from 'react';
import Player from 'xgplayer';
import Box from '@mui/material/Box';
import { SxProps } from '@mui/material';
import SwipeUpIcon from '@mui/icons-material/SwipeUp';
import KeyboardDoubleArrowUpOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowUpOutlined';

import Buttons from './Buttons';
import VideoText from './VideoText';
import AboutUsPart from './AboutUsPart';
import StudentCodePart from './StudentCodePart';
import Logo from '@/pages/dashboard/Logo';
import VODPlayer from '@/components/VODPlayer';

import './style.css';

export interface IShareVideoPageProps {
  style?: SxProps;
  title: string;
  name: string;
  code: string;
  language: string;
  description?: string;
  tags?: string[];
  badge?: string;
  levelId?: string;
  collectionId?: string;
  levelName?: string;
  collectionName?: string;
  date: Date;
  popup?: boolean;
  videoId?: string;
  posterUrl?: string;
  editorMode?: boolean;
}

export default React.memo<IShareVideoPageProps>(
  ({
    style = {},
    title,
    name,
    code,
    language,
    description,
    tags,
    badge,
    levelId,
    levelName,
    collectionId,
    collectionName,
    date,
    popup = true,
    videoId,
    posterUrl,
    editorMode = false,
  }) => {
    const domRef = React.useRef<HTMLDListElement>(null);
    const playerRef = React.useRef<Player>();
    const [showMask, setShowMask] = React.useState<boolean>(!editorMode);
    const [showShareMask, setShowShareMask] = React.useState<boolean>(false);

    React.useEffect(() => {
      domRef.current?.scrollTo(0, 100);
    }, [domRef.current]);

    React.useEffect(() => {
      if (!editorMode) {
        setTimeout(() => {
          setShowShareMask(true);
        }, 1000);
        setTimeout(() => {
          setShowShareMask(false);
        }, 10000);
      }
    }, []);

    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          position: 'relative',
          ...style,
        }}
      >
        <Box
          sx={{
            zIndex: 10,
            position: 'absolute',
            top: '30px',
            opacity: 0.75,
          }}
        >
          <Logo />
        </Box>
        {showMask ? (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 10000,
              backdropFilter: 'blur(3px)',
              background: '#0005',
              flexDirection: 'column',
            }}
            onClick={() => {
              playerRef.current?.play?.();
              setShowMask(false);
            }}
            onTouchStart={() => {
              playerRef.current?.play?.();
              setShowMask(false);
            }}
          >
            <SwipeUpIcon
              sx={{
                fontSize: '60px',
                animation: 'slideUpDown 2s ease-in-out infinite',
              }}
            />
            <Box sx={{ fontSize: '20px', fontWeight: 750, margin: '10px 0' }}>
              向上滑动查看作品详情
            </Box>
          </Box>
        ) : (
          <></>
        )}
        {showShareMask ? (
          <Box
            sx={{
              background: '#f23b08',
              borderRadius: '5px',
              padding: '5px',
              position: 'absolute',
              top: '24px',
              right: '10px',
              zIndex: 10,
              fontSize: '20px',
              boxShadow: '#000 0 0 5px',
            }}
            onClick={() => {
              setShowShareMask(false);
            }}
          >
            点击 ··· 分享页面
            <Box
              sx={{
                width: 0,
                height: 0,
                borderLeft: '14px solid transparent',
                borderRight: '14px solid transparent',
                borderBottom: '18px solid #f23b08',
                position: 'absolute',
                top: '-18px',
                right: '5px',
              }}
            />
          </Box>
        ) : (
          <></>
        )}
        {videoId !== undefined && !editorMode ? (
          <VODPlayer
            vid={videoId}
            options={{
              fitVideoSize: 'fixHeight',
              playsinline: true,
              autoplayMuted: true,
              autoplay: true,
              videoInit: true,
              loop: true,
              pip: false,
              miniplayer: false,
              cssFullscreen: false,
              closeVideoDblclick: false,
              enableContextmenu: false,
              controls: false,
              enableStallCheck: true,
              poster: posterUrl,
            }}
            style={{
              '& > video': {
                objectFit: 'cover',
              },
              width: '100% !important',
              height: '100% !important',
            }}
            onMount={player => {
              playerRef.current = player;
              setShowMask(!player.hasStart);
            }}
          />
        ) : (
          <Box
            sx={{
              height: '100%',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#FFF8',
              background: '#000A',
              fontSize: '30px',
              fontWeight: 800,
            }}
          >
            过关视频预留位置
          </Box>
        )}
        <Box
          ref={domRef}
          sx={{
            height: '100%',
            width: '100%',
            position: 'absolute',
            overflowY: 'auto',
            top: '60px',
            zIndex: 10,
            borderRadius: '7px 7px 0 0',
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: 'calc(100% - 100px)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
            }}
          >
            <VideoText
              style={{
                flexGrow: 1,
                padding: '0 0 8px 12px',
              }}
              title={title}
              name={name}
              description={description}
              tags={tags}
              badge={badge}
            />
            <Buttons popup={popup} />
          </Box>
          <Box
            sx={{
              height: '40px',
              position: 'sticky',
              top: 0,
              borderRadius: '7px 7px 0 0',
              background: '#202020BB',
              backdropFilter: 'blur(5px)',
              border: '1px solid #333',
              borderBottom: '1px solid #0004',
              boxShadow: '#0008 0 -5px 6px',
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              userSelect: 'none',
            }}
          >
            <KeyboardDoubleArrowUpOutlinedIcon />
            上划查看更多
            <KeyboardDoubleArrowUpOutlinedIcon />
          </Box>
          <Box
            sx={{
              background: '#202020BB',
              backdropFilter: 'blur(5px)',
              borderLeft: '1px solid #333',
              borderRight: '1px solid #333',
              paddingBottom: '60px',
              position: 'relative',
            }}
          >
            <StudentCodePart
              name={name}
              code={code}
              language={language}
              levelId={levelId}
              levelName={levelName}
              collectionId={collectionId}
              collectionName={collectionName}
              date={date}
            />
            <hr style={{ opacity: 0.3 }} />
            <Box
              sx={{
                width: '100%',
                opacity: 0.45,
              }}
            >
              <Logo />
            </Box>
            <AboutUsPart />
          </Box>
        </Box>
      </Box>
    );
  },
);

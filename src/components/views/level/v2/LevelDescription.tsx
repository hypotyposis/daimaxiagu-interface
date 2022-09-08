import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import MarkdownBlock from '@/components/views/markdown/MarkdownBlock';
import { useSelector } from '@/utils/redux/hooks';

export default React.memo(() => {
  const descriptionText = useSelector(
    state =>
      state.gameLevel.levelData!.description[state.gameLevel.currentLanguage],
  );
  const [hide, setHide] = React.useState(false);
  React.useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, [hide, descriptionText]);

  if (hide) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '0',
          position: 'relative',
          overflowY: 'visible',
          zIndex: 25,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          className="button-transition"
          sx={{
            zIndex: 1,
            position: 'absolute',
            top: '0',
            padding: '0 !important',
            width: '44px',
            minWidth: '0px !important',
            left: '0',
            right: '0',
            margin: 'auto !important',
            borderRadius: '0 0 4px 4px',
            opacity: '0.25',
            boxShadow: 'black 0 3px 2px',
            '&:hover': { opacity: '0.75' },
          }}
          onClick={() => {
            setHide(false);
          }}
        >
          <KeyboardArrowDownIcon />
        </Button>
      </Box>
    );
  } else {
    return (
      <Box
        sx={{
          flexShrink: 0,
          maxHeight: '38.2%',
          position: 'relative',
          paddingTop: '20px',
          paddingBottom: '20px',
        }}
      >
        <MarkdownBlock
          style={{
            padding: '0 20px',
            overflowX: 'scroll',
            height: '100%',
          }}
          text={descriptionText}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '0px',
            borderBottom: '1px solid #fff7',
            width: 'calc(100% - 40px)',
            margin: '0 20px',
          }}
        />
        <Button
          variant="contained"
          color="primary"
          className="button-transition"
          sx={{
            zIndex: 1,
            position: 'absolute',
            bottom: '0',
            padding: '0 !important',
            width: '44px',
            minWidth: '0px !important',
            left: '0',
            right: '0',
            margin: 'auto !important',
            borderRadius: '4px 4px 0 0',
            opacity: '0.25',
            '&:hover': { opacity: '0.75' },
          }}
          onClick={() => {
            setHide(true);
          }}
        >
          <KeyboardArrowUpIcon />
        </Button>
      </Box>
    );
  }
});

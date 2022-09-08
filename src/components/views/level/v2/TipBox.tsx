import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import MobileStepper from '@mui/material/MobileStepper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import MarkdownBlock from '@/components/views/markdown/MarkdownBlock';

import { GameLevelSliceActions } from '@/utils/redux/gameLevel/slice';
import { useSelector, useAppDispatch } from '@/utils/redux/hooks';

const TipBox = React.memo(() => {
  const show = useSelector(state => state.gameLevel.showTip);
  const currentLanguage = useSelector(state => state.gameLevel.currentLanguage);
  const tipList = useSelector(
    state => state.gameLevel.levelData!.tips[currentLanguage] ?? [],
  );
  const dispatch = useAppDispatch();
  const [tipIndex, setTipIndex] = React.useState(0);
  React.useEffect(() => {
    setTipIndex(0);
    dispatch(GameLevelSliceActions.hideTip(undefined));
  }, [currentLanguage, tipList]);
  if (show && tipList.length > 0) {
    return (
      <ClickAwayListener
        onClickAway={() => {
          dispatch(GameLevelSliceActions.hideTip(undefined));
        }}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            bottom: '20px',
            left: '10px',
            right: '10px',
            backgroundColor: '#111a',
            borderRadius: '5px',
            minHeight: '120px',
            backdropFilter: 'blur(15px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <MarkdownBlock
            style={{
              padding: '20px',
              width: '100%',
            }}
            text={tipList[tipIndex]}
          />
          {tipList.length < 2 ? undefined : (
            <MobileStepper
              variant="dots"
              steps={tipList.length}
              position="static"
              activeStep={tipIndex}
              sx={{ backgroundColor: 'transparent' }}
              nextButton={
                <Button
                  size="small"
                  onClick={() => {
                    setTipIndex(tipIndex + 1);
                  }}
                  disabled={tipIndex >= tipList.length - 1}
                >
                  Next <KeyboardArrowRight />
                </Button>
              }
              backButton={
                <Button
                  size="small"
                  onClick={() => {
                    setTipIndex(tipIndex - 1);
                  }}
                  disabled={tipIndex <= 0}
                >
                  <KeyboardArrowLeft /> Back
                </Button>
              }
            />
          )}
          <Button
            sx={{
              position: 'absolute',
              bottom: '0',
              right: '0',
            }}
            startIcon={<CloseIcon />}
            size="large"
            onClick={() => {
              dispatch(GameLevelSliceActions.hideTip(undefined));
            }}
          >
            关闭
          </Button>
        </Box>
      </ClickAwayListener>
    );
  } else {
    return <></>;
  }
});

export default TipBox;

import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SpeedIcon from '@mui/icons-material/Speed';

import { ILevelToolKit } from '..';
import GameGoButton from './GameGoButton';

import { GameLevelSliceActions } from '@/utils/redux/gameLevel/slice';
import { useSelector, useAppDispatch } from '@/utils/redux/hooks';

export interface IControlButtonsProps {
  levelToolkit: ILevelToolKit;
}

export default React.memo<IControlButtonsProps>(({ levelToolkit }) => {
  const dispatch = useAppDispatch();
  const gameState = useSelector(state => state.gameLevel.gameState);
  const tipList = useSelector(
    state =>
      state.gameLevel.levelData!.tips[state.gameLevel.currentLanguage] ?? [],
  );
  const showTip = useSelector(state => state.gameLevel.showTip);
  if (showTip) {
    return <></>;
  } else {
    return (
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          left: '0',
          right: '0',
          bottom: '0',
          pointerEvents: 'none',
        }}
      >
        <GameGoButton levelToolkit={levelToolkit} />
        <Button
          disabled={gameState === 'Loading' || tipList.length === 0}
          sx={{
            position: 'absolute',
            bottom: '20px',
            right: '10px',
            pointerEvents: 'painted',
          }}
          variant="outlined"
          size="large"
          onClick={() => {
            dispatch(GameLevelSliceActions.showTip(undefined));
          }}
        >
          提示
        </Button>
        <Button
          disabled
          sx={{
            position: 'absolute',
            bottom: '20px',
            left: '10px',
            pointerEvents: 'painted',
          }}
          variant="outlined"
          size="large"
        >
          <SpeedIcon />
        </Button>
      </Box>
    );
  }
});

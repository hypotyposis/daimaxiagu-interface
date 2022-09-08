import React, { CSSProperties } from 'react';
import Button from '@mui/material/Button';
import RefreshIcon from '@mui/icons-material/Refresh';

import { GameLevelSliceActions } from '@/utils/redux/gameLevel/slice';
import { useAppDispatch, useSelector } from '@/utils/redux/hooks';
import { getLevelData, mergeLevelData } from '@/utils/api/getData';
import LoadingMask from '@/components/LoadingMask';
import LevelV2 from '@/components/views/level/v2';
import { ILevelInfo, ICollectionItemLevel } from '@/types/data.d';

export interface ILevelViewArgumant {
  levelId: string;
  setTitle?: (title: string) => unknown;
  collectionItem?: ICollectionItemLevel;
  hideCocos?: boolean;
  debugCocosUri?: string;
  style?: CSSProperties;
  hasNextLevel?: boolean;
  hasLastLevel?: boolean;
  onNextLevel?: () => void;
  onLastLevel?: () => void;
  onLevelPass?: () => void;
}

const LevelView = React.memo<ILevelViewArgumant>(
  ({
    levelId,
    setTitle,
    collectionItem,
    hideCocos,
    debugCocosUri,
    hasNextLevel,
    hasLastLevel,
    onNextLevel,
    onLastLevel,
    onLevelPass,
  }) => {
    const dispatch = useAppDispatch();
    const levelData = useSelector(state => state.gameLevel.levelData);
    const [errorStr, setErrorStr] = React.useState<string | undefined>('');
    const getLevel = React.useCallback(() => {
      setErrorStr('');
      getLevelData(
        levelId,
        (level: ILevelInfo) => {
          const levelData = collectionItem
            ? mergeLevelData(level, collectionItem)
            : level;
          dispatch(GameLevelSliceActions.setLevel({ levelId, levelData }));
          setTitle?.(`${level.title} - 代码峡谷编程`);
          setErrorStr(undefined);
        },
        (error: string) => {
          setTitle?.('出错啦');
          setErrorStr(error);
        },
      );
    }, [levelId]);

    React.useEffect(() => {
      getLevel();
    }, [levelId]);

    React.useEffect(() => {
      return () => {
        dispatch(
          GameLevelSliceActions.setLevel({
            levelId: undefined,
            levelData: undefined,
          }),
        );
      };
    }, []);

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
              onClick={() => getLevel()}
              size="large"
            >
              点击刷新
            </Button>
          </>
        );
      }
    }, [errorStr]);

    return (
      <LoadingMask
        show={errorStr !== undefined}
        loadingIcon={errorStr === ''}
        content={maskContent}
      >
        {levelData ? (
          <LevelV2
            hideCocos={hideCocos}
            debugCocosUri={debugCocosUri}
            hasNextLevel={hasNextLevel}
            hasLastLevel={hasLastLevel}
            onLevelPass={onLevelPass}
            onNextLevel={onNextLevel}
            onLastLevel={onLastLevel}
          />
        ) : undefined}
      </LoadingMask>
    );
  },
);

export default LevelView;

import React from 'react';
import Box from '@mui/material/Box';

import { GameLevelSliceActions } from '@/utils/redux/gameLevel/slice';
import { useSelector, useAppDispatch } from '@/utils/redux/hooks';
import {
  CollectionItemType,
  ICollectionItemLevel,
  ICollectionItemVideo,
  ICollectionItemQuestions,
} from '@/types/data.d';
import LevelView from '@/components/views/level/LevelView';
import MarkdownView from '@/components/views/markdown/MarkdownView';
import SlideView from '@/components/views/slide/SlideView';
import VideoView from '@/components/views/video';
import ProblemView from '@/components/views/onlinejudge/ProblemView';
import QuestionView from '@/components/views/questions/QuestionView';

export default React.memo<{ debugCocosUri?: string }>(({ debugCocosUri }) => {
  const dispatch = useAppDispatch();
  const collectionTocNextId = useSelector(
    state => state.gameLevel.collectionTocNextId,
  );
  const collectionTocLastId = useSelector(
    state => state.gameLevel.collectionTocLastId,
  );
  const collectionItem = useSelector(state => state.gameLevel.collectionItem);
  switch (collectionItem?.type) {
    case CollectionItemType.Level: {
      return (
        <LevelView
          levelId={collectionItem.id!}
          collectionItem={collectionItem as ICollectionItemLevel}
          hideCocos={false}
          debugCocosUri={debugCocosUri}
          hasNextLevel={collectionTocNextId !== undefined}
          hasLastLevel={collectionTocLastId !== undefined}
          onNextLevel={() => {
            dispatch(
              GameLevelSliceActions.setCollectionTocId(collectionTocNextId),
            );
          }}
          onLastLevel={() => {
            dispatch(
              GameLevelSliceActions.setCollectionTocId(collectionTocLastId),
            );
          }}
          onLevelPass={() => {
            dispatch(GameLevelSliceActions.passLevel(collectionItem.rawId));
          }}
        />
      );
    }
    case CollectionItemType.Paper: {
      return (
        <MarkdownView
          paperId={collectionItem.id!}
          style={{
            padding: '20px 30px 40px 30px',
            overflowY: 'scroll',
          }}
        />
      );
    }
    case CollectionItemType.Video: {
      return (
        <VideoView
          src={(collectionItem as ICollectionItemVideo).url}
          hasNextView={collectionTocNextId !== undefined}
          hasLastView={collectionTocLastId !== undefined}
          onNextView={() => {
            dispatch(
              GameLevelSliceActions.setCollectionTocId(collectionTocNextId),
            );
          }}
          onLastView={() => {
            dispatch(
              GameLevelSliceActions.setCollectionTocId(collectionTocLastId),
            );
          }}
        />
      );
    }
    case CollectionItemType.Slide: {
      return (
        <SlideView
          slideId={collectionItem.id!}
          style={{ overflow: 'hidden' }}
          onNextView={() => {
            dispatch(
              GameLevelSliceActions.setCollectionTocId(collectionTocNextId),
            );
          }}
          onLastView={() => {
            dispatch(
              GameLevelSliceActions.setCollectionTocId(collectionTocLastId),
            );
          }}
        />
      );
    }
    case CollectionItemType.OJ: {
      return (
        <ProblemView
          problemId={collectionItem.id!}
          hasNextLevel={collectionTocNextId !== undefined}
          hasLastLevel={collectionTocLastId !== undefined}
          onNextLevel={() => {
            dispatch(
              GameLevelSliceActions.setCollectionTocId(collectionTocNextId),
            );
          }}
          onLastLevel={() => {
            dispatch(
              GameLevelSliceActions.setCollectionTocId(collectionTocLastId),
            );
          }}
          onPassItem={rawId => {
            dispatch(GameLevelSliceActions.passLevel(rawId));
          }}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      );
    }
    case CollectionItemType.Questions: {
      return (
        <QuestionView
          title={collectionItem.title}
          questionScores={(collectionItem as ICollectionItemQuestions).scores}
          questionId={(collectionItem as ICollectionItemQuestions).questions}
          onNextItem={() => {
            dispatch(
              GameLevelSliceActions.setCollectionTocId(collectionTocNextId),
            );
          }}
          onPassItem={() => {
            dispatch(GameLevelSliceActions.passLevel(collectionItem.rawId));
          }}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      );
    }
    case undefined: {
      return <></>;
    }
    default: {
      return (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexWrap: 'nowrap',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <h1>未知格式</h1>
        </Box>
      );
    }
  }
});

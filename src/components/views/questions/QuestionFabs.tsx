import React from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Grid from '@mui/material/Grid';
import { intersection } from 'lodash';

import { useSelector } from '@/utils/redux/hooks';

export interface IQuestionFabs {
  onClick?: (index: [number, number]) => void;
  onStatistics?: (
    success: number,
    total: number,
    score: number,
    totalScore: number,
  ) => void;
  innerMode?: boolean;
}

export default React.memo<IQuestionFabs>(
  ({ onClick, onStatistics, innerMode = false }) => {
    const questionResultMode = useSelector(
      state => state.gameLevel.questionResultMode,
    );
    const questionIds = useSelector(state => state.gameLevel.questionIds);
    const questionDatas = useSelector(state => state.gameLevel.questionDatas);
    const questionAnswers = useSelector(
      state => state.gameLevel.questionAnswers,
    );
    const questionScores = useSelector(
      state => state.gameLevel.questionScores ?? {},
    );

    const questionIndexes = React.useMemo(() => {
      if (questionIds === undefined || questionDatas === undefined) {
        return [];
      }
      const indexes: [number, number][] = [];
      const len = questionIds.length;
      for (let i = 0; i < len; i++) {
        const questionId = questionIds[i];
        const questionData = questionDatas[questionId];
        for (let j = 0; j < questionData.subProblems.length; j++) {
          indexes.push([i, j]);
        }
      }
      return indexes;
    }, [questionIds, questionDatas]);

    const questionColors = React.useMemo<
      ('error' | 'success' | 'info' | undefined)[]
    >(() => {
      if (questionIds === undefined || questionDatas === undefined) {
        return [];
      }
      const colors: ('error' | 'success' | 'info' | undefined)[] = [];
      const len = questionIds.length;
      let total = 0;
      let success = 0;
      let totalScore = 0;
      let score = 0;
      for (let i = 0; i < len; i++) {
        const questionId = questionIds[i];
        const questionData = questionDatas[questionId];
        const answers = questionAnswers[questionId] ?? [];
        const scores = questionScores[questionId] ?? [];
        for (let j = 0; j < questionData.subProblems.length; j++) {
          const answer = answers[j] ?? [];
          const _score = scores[j] ?? 0;
          if (questionResultMode) {
            const trueAnswer =
              questionData.subProblems[j]?.options
                ?.map((option, index) => [index, option[1]])
                ?.filter(option => Boolean(option[1]))
                ?.map(option => option[0]) ?? [];
            const result = intersection(answer, trueAnswer);
            total++;
            totalScore += _score;
            if (
              result.length === trueAnswer.length &&
              result.length === answer.length
            ) {
              colors.push('success');
              success++;
              score += _score;
            } else if (answer.length === 0) {
              colors.push(undefined);
            } else {
              colors.push('error');
            }
          } else if (answer.length > 0) {
            colors.push('info');
          } else {
            colors.push(undefined);
          }
        }
      }
      if (questionResultMode) {
        onStatistics?.(success, total, score, totalScore);
      }
      return colors;
    }, [questionIds, questionDatas, questionAnswers, questionResultMode]);

    return (
      <Grid
        container
        spacing={innerMode ? 1 : 2}
        rowSpacing={4}
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        sx={{
          padding: '30px 10px',
          flexGrow: 1,
          overflow: 'auto',
        }}
        columns={innerMode ? { sx: 4, sm: 6 } : { xs: 4, sm: 8, md: 12 }}
      >
        {questionIndexes.map((questionIndex, index) => (
          <Grid
            item
            xs={1}
            sm={1}
            md={1}
            key={`${questionIndex[0]}/${questionIndex[1]}`}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            <Fab
              size={innerMode ? 'small' : 'medium'}
              color={questionColors[index]}
              sx={{
                background:
                  questionColors[index] === undefined ? '#555c6533' : undefined,
                border:
                  questionColors[index] === undefined
                    ? '1px solid #88adcb88'
                    : undefined,
                color: questionColors[index] === undefined ? '#FFF' : undefined,
              }}
              onClick={() => {
                onClick?.(questionIndex);
              }}
            >
              {index + 1}
            </Fab>
            {questionColors[index] === undefined && questionResultMode ? (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: '-6px',
                  bgcolor: 'error.dark',
                  zIndex: 1050,
                  fontSize: '6px',
                  borderRadius: '12px',
                  padding: innerMode ? '1px 6px' : '2px 8px',
                }}
              >
                未答
              </Box>
            ) : (
              <></>
            )}
          </Grid>
        ))}
      </Grid>
    );
  },
);

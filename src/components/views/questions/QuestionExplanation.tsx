import React from 'react';
import Box from '@mui/material/Box';
import { sortedUniq } from 'lodash';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import { useSelector, useAppDispatch } from '@/utils/redux/hooks';
import MarkdownBlock from '@/components/views/markdown/MarkdownBlock';
import { GameLevelSliceActions } from '@/utils/redux/gameLevel/slice';

export default React.memo(() => {
  const dispatch = useAppDispatch();
  const question = useSelector(state =>
    state.gameLevel.currentQuestionExplanation && state.gameLevel.questionIds
      ? state.gameLevel.questionDatas?.[
          state.gameLevel.questionIds[
            state.gameLevel.currentQuestionExplanation[0]
          ]
        ]?.subProblems?.[state.gameLevel.currentQuestionExplanation[1]]
      : undefined,
  );

  return (
    <Drawer
      anchor="bottom"
      open={question !== undefined}
      onClose={() =>
        dispatch(GameLevelSliceActions.setCurrentQuestionExplanation(undefined))
      }
      sx={{
        '& > .MuiPaper-root': {
          borderRadius: '5px 5px 0 0',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '80%',
          bgcolor: '#000',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          padding: '10px',
        }}
      >
        <Box
          sx={{
            fontSize: '16px',
            fontWeight: 800,
            userSelect: 'none',
          }}
        >
          解析
        </Box>
        <IconButton
          onClick={() =>
            dispatch(
              GameLevelSliceActions.setCurrentQuestionExplanation(undefined),
            )
          }
          sx={{
            position: 'absolute',
            right: '10px',
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          padding: '20px',
          width: '100%',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        {question?.explanationVideo ? (
          <>
            <Box
              sx={{
                fontSize: '20px',
                fontWeight: 800,
                lineHeight: 2.5,
              }}
            >
              视频讲解
            </Box>
            <Box
              sx={{
                opacity: 0.5,
              }}
            >
              专业解析，一看就会
            </Box>
            <video
              width="100%"
              height="100%"
              autoPlay
              controls
              playsInline
              src={question.explanationVideo}
              style={{
                marginTop: '10px',
              }}
            />
          </>
        ) : (
          <></>
        )}

        {question?.explanationVideo && question?.options ? (
          <Divider
            sx={{
              margin: '10px 0',
            }}
          />
        ) : (
          <></>
        )}

        {question?.options ? (
          <>
            <Box
              sx={{
                fontSize: '20px',
                fontWeight: 800,
                lineHeight: 2.5,
              }}
            >
              正确答案
            </Box>
            <Box>
              {sortedUniq(
                question.options
                  .map((option, index) => [index, option[1]])
                  .filter(option => Boolean(option[1]))
                  .map(option => question.optionMap[option[0] as number]),
              )
                .map(option => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[option])
                .join('')}
            </Box>
          </>
        ) : (
          <></>
        )}

        {question?.explanation && question?.options ? (
          <Divider
            sx={{
              margin: '10px 0',
            }}
          />
        ) : (
          <></>
        )}

        {question?.explanation ? (
          <>
            <Box
              sx={{
                fontSize: '20px',
                fontWeight: 800,
                lineHeight: 2.5,
              }}
            >
              答案解析
            </Box>
            <MarkdownBlock text={question.explanation} />
          </>
        ) : (
          <></>
        )}
      </Box>
    </Drawer>
  );
});

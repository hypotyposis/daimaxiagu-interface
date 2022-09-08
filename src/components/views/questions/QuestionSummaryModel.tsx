import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Rating from '@mui/material/Rating';
import Divider from '@mui/material/Divider';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';

import QuestionFabs from './QuestionFabs';

import { useSelector, useAppDispatch } from '@/utils/redux/hooks';
import { GameLevelSliceActions } from '@/utils/redux/gameLevel/slice';

export interface IQuestionSummaryModel {
  onNextItem?: () => void;
  onPassItem?: () => void;
  title?: string;
}

export default React.memo<IQuestionSummaryModel>(
  ({ onNextItem, onPassItem, title }) => {
    const theme = useTheme();
    const dispatch = useAppDispatch();
    const questionSummaryVisible = useSelector(
      state => state.gameLevel.questionSummaryVisible,
    );
    const questionStartTimestamp = useSelector(
      state => state.gameLevel.questionStartTimestamp,
    );
    const questionEndTimestamp = useSelector(
      state => state.gameLevel.questionEndTimestamp,
    );
    const [statisticsData, setStatisticsData] = React.useState<
      [number, number, number, number]
    >([0, 0, 0, 0]);
    const dialogContentDomRef = React.useRef<HTMLDivElement | null>(null);
    const time = React.useMemo<[string, number]>(() => {
      const seconds =
        ((questionEndTimestamp ?? new Date().getTime()) -
          questionStartTimestamp) /
        1000;
      let fmtString = `${Math.floor(seconds % 60)}秒`;
      if (seconds >= 60) {
        fmtString = `${Math.floor((seconds / 60) % 60)}分${fmtString}`;
        if (seconds >= 3600) {
          fmtString = `${Math.floor((seconds / 3600) % 60)}小时${fmtString}`;
        }
      }
      return [fmtString, seconds];
    }, [questionEndTimestamp, questionStartTimestamp]);

    const score = React.useMemo(
      () =>
        (10 *
          (statisticsData[0] / (statisticsData[1] ? statisticsData[1] : 1)) -
          Math.log(Math.max(60, time[1]) - 59) / Math.log(3000)) /
        2,
      [statisticsData, time],
    );

    React.useEffect(() => {
      if (dialogContentDomRef.current) {
        dialogContentDomRef.current.scrollTo(0, 0);
      }
    }, [dialogContentDomRef.current]);

    return (
      <Dialog
        fullScreen={useMediaQuery(theme.breakpoints.down('md'))}
        open={questionSummaryVisible}
        sx={{
          '& > .MuiDialog-container > .MuiPaper-root': useMediaQuery(
            theme.breakpoints.down('md'),
          )
            ? {
                borderRadius: '4px',
                bgcolor: '#000',
              }
            : {
                maxHeight: '60%',
                width: '100%',
                maxWidth: '600px',
                bgcolor: '#000',
              },
          paddingTop: useMediaQuery(theme.breakpoints.down('md'))
            ? '100px'
            : undefined,
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            userSelect: 'none',
            alignItems: 'center',
            borderBottom: '0.5px solid #fff2',
          }}
        >
          成绩单
          <IconButton
            onClick={() =>
              dispatch(GameLevelSliceActions.setQuestionSummaryVisible(false))
            }
            sx={{
              position: 'absolute',
              right: '10px',
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          className="questions-result"
          ref={dialogContentDomRef}
          sx={{
            bgcolor: '#0006',
            paddingTop: '20px !important',
          }}
        >
          <Box>
            <Box
              sx={{
                width: '100%',
                height: '100px',
                display: 'flex',
              }}
            >
              <Box
                sx={{
                  flexGrow: 1,
                  userSelect: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-around',
                }}
              >
                <Box
                  sx={{
                    fontSize: '18px',
                    fontWeight: 800,
                  }}
                >
                  {title}
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  用时：
                  <Box
                    component="span"
                    sx={{
                      color:
                        // eslint-disable-next-line no-nested-ternary
                        time[1] < 600
                          ? 'success.light'
                          : time[1] < 1800
                          ? 'warning.light'
                          : 'error.light',
                      fontSize: '18px',
                      fontWeight: 800,
                    }}
                  >
                    {time[0]}
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  分数：
                  <Box
                    sx={{
                      fontSize: '26px',
                      fontWeight: 800,
                      marginRight: '6px',
                      color: '#ee3811',
                    }}
                  >
                    {statisticsData[2]}
                  </Box>
                  {`(总分${statisticsData[3]})`}
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  评分：
                  <Rating value={score} precision={0.5} readOnly />
                </Box>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                  userSelect: 'none',
                }}
              >
                <CircularProgress
                  variant="determinate"
                  color="success"
                  value={
                    statisticsData[1]
                      ? (statisticsData[0] /
                          (statisticsData[1] ? statisticsData[1] : 1)) *
                        100
                      : 0
                  }
                  sx={{
                    height: '100px !important',
                    width: '100px !important',
                    zIndex: 1,
                  }}
                />
                <CircularProgress
                  variant="determinate"
                  sx={{
                    height: '100px !important',
                    width: '100px !important',
                    position: 'absolute',
                    opacity: 0.25,
                  }}
                  value={100}
                  color="inherit"
                />
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
                    flexDirection: 'column',
                  }}
                >
                  <Box
                    sx={{
                      fontSize: '8px',
                    }}
                  >
                    <Box
                      component="span"
                      sx={{
                        fontSize: '24px',
                        color: 'success.light',
                        fontWeight: 700,
                      }}
                    >
                      {statisticsData[0]}
                    </Box>
                    {' / '}
                    {statisticsData[1]}
                  </Box>
                  <Box
                    sx={{
                      fontSize: '6px',
                      opacity: 0.75,
                      transform: 'scale(0.7)',
                    }}
                  >
                    答题数/总题数
                  </Box>
                </Box>
              </Box>
            </Box>
            <Divider sx={{ marginTop: '20px' }} />
          </Box>
          <Box>
            <QuestionFabs
              innerMode
              onStatistics={(success, total, score, totalScore) => {
                setStatisticsData([success, total, score, totalScore]);
                if (success === total && total > 0) {
                  onPassItem?.();
                }
              }}
              onClick={index => {
                dispatch(GameLevelSliceActions.setCurrentQuestionIndex(index));
                dispatch(
                  GameLevelSliceActions.setQuestionSummaryVisible(false),
                );
                dispatch(
                  GameLevelSliceActions.setCurrentQuestionExplanation(index),
                );
              }}
            />
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              paddingTop: '20px',
              paddingBottom: '10px',
            }}
          >
            <Button
              size="large"
              color="info"
              variant="outlined"
              onClick={() => {
                dispatch(GameLevelSliceActions.setCurrentQuestionIndex([0, 0]));
                dispatch(
                  GameLevelSliceActions.setQuestionSummaryVisible(false),
                );
                dispatch(
                  GameLevelSliceActions.setCurrentQuestionExplanation([0, 0]),
                );
              }}
            >
              查看错题解析
            </Button>
            <Button
              size="large"
              color="info"
              variant="contained"
              autoFocus
              onClick={onNextItem}
            >
              继续练习
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    );
  },
);

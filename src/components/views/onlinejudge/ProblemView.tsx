import React from 'react';
import { SxProps } from '@mui/material';
import { Resizable } from 're-resizable';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Button from '@mui/material/Button';
import ArticleIcon from '@mui/icons-material/Article';
import HistoryIcon from '@mui/icons-material/History';
import RefreshIcon from '@mui/icons-material/Refresh';

import { init } from './middleware';
import CodeEditorSide from './CodeEditorSide';
import SubmissionHistory from './SubmissionHistory';
import ProblemDiscription from './ProblemDiscription';
import DescriptionSideHeader from './DescriptionSideHeader';

import { getProblem } from '@/utils/api/oj';
import LoadingMask from '@/components/LoadingMask';
import { useSelector, useAppDispatch } from '@/utils/redux/hooks';
import { GameLevelSliceActions } from '@/utils/redux/gameLevel/slice';

export interface IProblemViewProps {
  problemId: string;
  setTitle?: (title: string) => unknown;
  style?: SxProps;
  hasNextLevel?: boolean;
  hasLastLevel?: boolean;
  onNextLevel?: () => void;
  onLastLevel?: () => void;
  onPassItem?: (rawId: string) => void;
}

export default React.memo<IProblemViewProps>(
  ({
    problemId,
    setTitle,
    style = {},
    hasLastLevel = false,
    hasNextLevel = false,
    onNextLevel,
    onLastLevel,
    onPassItem,
  }) => {
    const dispatch = useAppDispatch();
    const [tabIndex, setTabIndex] = React.useState(0);
    const problem = useSelector(state => state.gameLevel.ojProblem);
    const submissionId = useSelector(
      state => state.gameLevel.ojCurrentSubmissionId,
    );
    const [errorStr, setErrorStr] = React.useState<string | undefined>('');

    React.useEffect(() => {
      init();
      return () => {
        dispatch(GameLevelSliceActions.setOJProblem(undefined));
      };
    }, []);

    React.useEffect(() => {
      if (submissionId) {
        setTabIndex(1);
      }
    }, [submissionId]);

    const getPaper = React.useCallback(() => {
      setErrorStr('');
      getProblem(
        problemId,
        problem => {
          dispatch(GameLevelSliceActions.setOJProblem(problem));
          setTitle?.(`${problem.title} - 代码峡谷编程`);
          setErrorStr(undefined);
          setTabIndex(0);
        },
        (_code, result) => {
          dispatch(GameLevelSliceActions.setOJProblem(undefined));
          setTitle?.('出错啦');
          setErrorStr(result);
        },
      );
    }, [problemId]);

    React.useEffect(() => {
      getPaper();
    }, [problemId]);

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
              onClick={() => getPaper()}
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
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        {problem ? (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              backgroundColor: '#282c34',
              ...style,
            }}
          >
            <Resizable
              defaultSize={{ width: '50%', height: '100%' }}
              enable={{ right: true }}
              minWidth="200px"
              maxWidth="80%"
              style={{
                display: 'flex',
                flexDirection: 'column',
                flexWrap: 'nowrap',
                position: 'relative',
              }}
              handleClasses={{
                right: 'editor-side-resize-bar',
              }}
              onResize={() => {
                window.dispatchEvent(new Event('resize'));
              }}
            >
              <DescriptionSideHeader
                hasNextLevel={hasNextLevel}
                hasLastLevel={hasLastLevel}
                onNextLevel={onNextLevel}
                onLastLevel={onLastLevel}
              />
              <Box
                sx={{
                  borderBottom: 1,
                  borderColor: 'divider',
                  background: '#0005',
                }}
              >
                <Tabs
                  value={tabIndex}
                  onChange={(_event, value) => {
                    setTabIndex(value);
                  }}
                  scrollButtons="auto"
                  aria-label="basic tabs example"
                  sx={{
                    minHeight: 0,
                  }}
                >
                  <Tab
                    icon={
                      <ArticleIcon
                        sx={{
                          fontSize: '16px',
                          marginRight: '4px !important',
                        }}
                      />
                    }
                    iconPosition="start"
                    label="题目描述"
                    sx={{
                      minHeight: '40px',
                      fontSize: '12px',
                    }}
                  />
                  <Tab
                    icon={
                      <HistoryIcon
                        sx={{
                          fontSize: '16px',
                          marginRight: '4px !important',
                        }}
                      />
                    }
                    iconPosition="start"
                    label="提交记录"
                    sx={{
                      minHeight: '40px',
                      fontSize: '12px',
                    }}
                  />
                </Tabs>
              </Box>
              {{
                0: <ProblemDiscription />,
                1: <SubmissionHistory onPassItem={onPassItem} />,
              }[tabIndex] ?? <></>}
            </Resizable>
            <CodeEditorSide />
          </Box>
        ) : undefined}
      </LoadingMask>
    );
  },
);

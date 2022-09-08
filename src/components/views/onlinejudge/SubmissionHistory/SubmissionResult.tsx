import React from 'react';
import { SxProps } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import Skeleton from '@mui/material/Skeleton';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { getSubmissionStatusChip, formatMemory } from './colDef';

import OJ from '@/types/oj.d';
import { getSubmission } from '@/utils/api/oj';
import MarkdownBlock from '@/components/views/markdown/MarkdownBlock';
import { useSelector } from '@/utils/redux/hooks';

export interface ISubmissionResultProps {
  submissionId: string;
  onSubmissionJudged?: () => void;
  style?: SxProps;
  onPassItem?: (rawId: string) => void;
}

export default React.memo<ISubmissionResultProps>(
  ({ submissionId, onSubmissionJudged, style = {}, onPassItem }) => {
    const problem = useSelector(state => state.gameLevel.ojProblem!);
    const [submission, setSubmission] = React.useState<
      OJ.ISubmission | undefined
    >();
    React.useEffect(() => {
      const f = () => {
        getSubmission(
          submissionId,
          submission => {
            setSubmission(submission);
            if (
              submission.result === OJ.SubmissionStatus.JUDGING1 ||
              submission.result === OJ.SubmissionStatus.JUDGING2
            ) {
              setTimeout(f, 1000);
            } else {
              onSubmissionJudged?.();
            }
            if (submission.result === OJ.SubmissionStatus.AC) {
              onPassItem?.(`oj:${problem._id}`);
            }
          },
          () => setSubmission(undefined),
        );
      };
      f();
    }, [submissionId]);

    const items = React.useMemo(() => {
      const data = submission?.info?.data ?? [];
      return data.map((_case, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <TableRow key={index.toString()}>
          <TableCell align="center">{index}</TableCell>
          <TableCell align="center">
            {getSubmissionStatusChip(_case.result)}
          </TableCell>
          <TableCell align="center">{_case.cpu_time}ms</TableCell>
          <TableCell align="center">{formatMemory(_case.memory)}</TableCell>
          <TableCell align="center">{_case.score}</TableCell>
          <TableCell align="center">{_case.real_time}ms</TableCell>
          <TableCell align="center">{_case.signal}</TableCell>
          <TableCell align="center">{_case.exit_code}</TableCell>
        </TableRow>
      ));
    }, [submission]);

    const language = React.useMemo(() => {
      const _l = submission?.language?.toLowerCase?.() ?? '';
      return (
        {
          'c++': 'cpp',
          golang: 'go',
          python3: 'python',
        }[_l] ?? _l
      );
    }, [submission]);

    if (submission === undefined) {
      return <></>;
    }

    return (
      <Paper elevation={2} sx={{ padding: '10px', ...style }}>
        <Box
          sx={{
            fontSize: '20px',
            fontWeight: 800,
            lineHeight: 2.5,
            display: 'flex',
            alignItems: 'center',
            userSelect: 'none',
          }}
        >
          {submission.result === OJ.SubmissionStatus.JUDGING1 ||
          submission.result === OJ.SubmissionStatus.JUDGING2 ? (
            <>
              <CircularProgress
                sx={{
                  height: '20px !important',
                  width: '20px !important',
                  marginRight: '6px',
                }}
              />
              评分中...
            </>
          ) : (
            '提交记录'
          )}
        </Box>
        {submission.result === OJ.SubmissionStatus.JUDGING1 ||
        submission.result === OJ.SubmissionStatus.JUDGING2 ? (
          <Skeleton
            variant="rectangular"
            width="100%"
            height={60}
            sx={{ marginBottom: '10px' }}
          />
        ) : (
          <></>
        )}
        {submission.statistic_info.err_info ? (
          <MarkdownBlock
            text={`\`\`\`\n${submission.statistic_info.err_info}\n\`\`\``}
            style={{
              marginBottom: '10px',
              '& pre': {
                background:
                  submission.result === OJ.SubmissionStatus.CE
                    ? '#ffa51944'
                    : '#ff000059',
                border:
                  submission.result === OJ.SubmissionStatus.CE
                    ? '1px solid #ff7b1988'
                    : '1px solid #ff0000d6',
              },
            }}
          />
        ) : (
          <></>
        )}
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          sx={{
            fontSize: '14px',
            userSelect: 'none',
            marginBottom: '10px',
          }}
          rowSpacing={0.5}
          columnSpacing={3}
        >
          <Grid item>{getSubmissionStatusChip(submission.result)}</Grid>
          <Grid item>使用语言: {submission.language}</Grid>
          <Grid item>耗时: {submission.statistic_info.time_cost}ms</Grid>
          <Grid item>
            内存: {formatMemory(submission.statistic_info.memory_cost)}
          </Grid>
          <Grid item>总分: {submission.statistic_info.score}</Grid>
        </Grid>
        {items.length > 0 ? (
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 650 }}
              size="small"
              aria-label="a dense table"
            >
              <TableHead>
                <TableRow>
                  <TableCell align="center">ID</TableCell>
                  <TableCell align="center">提交状态</TableCell>
                  <TableCell align="center">执行用时</TableCell>
                  <TableCell align="center">内存消耗</TableCell>
                  <TableCell align="center">分数</TableCell>
                  <TableCell align="center">真实用时</TableCell>
                  <TableCell align="center">信号</TableCell>
                  <TableCell align="center">退出码</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{items}</TableBody>
            </Table>
          </TableContainer>
        ) : (
          <></>
        )}
        {submission.result === OJ.SubmissionStatus.JUDGING1 ||
        submission.result === OJ.SubmissionStatus.JUDGING2 ? (
          <>
            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
            <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
          </>
        ) : (
          <></>
        )}
        <MarkdownBlock
          text={`\`\`\`${language} showLineNumbers\n${submission.code}\n\`\`\``}
          style={{ marginTop: '10px' }}
          usePrism
        />
      </Paper>
    );
  },
);

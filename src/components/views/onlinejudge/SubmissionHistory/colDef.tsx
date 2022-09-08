import Chip from '@mui/material/Chip';
import { GridColDef } from '@mui/x-data-grid';

import OJ from '@/types/oj.d';

export const formatDate = (date: string) => new Date(date).toLocaleString();

export const formatMemory = (value: string | number) => {
  if (value === undefined || value === null || value === '') {
    return '无';
  }
  const _value = typeof value === 'number' ? value : parseInt(value, 10) ?? 0;
  if (_value > 1000000000) {
    // WTF
    return `${(_value / 1000000000).toFixed(2)}GB`;
  } else if (_value > 1000000) {
    return `${(_value / 1000000).toFixed(2)}MB`;
  } else if (_value > 1000) {
    return `${(_value / 1000).toFixed(2)}KB`;
  } else {
    return `${_value ?? 0}B`;
  }
};

export const getSubmissionStatusChip = (status: OJ.SubmissionStatus) => {
  return {
    [OJ.SubmissionStatus.AC]: (
      <Chip label="答案正确" variant="outlined" color="success" />
    ),
    [OJ.SubmissionStatus.TLE1]: (
      <Chip label="运行超时" variant="outlined" color="error" />
    ),
    [OJ.SubmissionStatus.TLE2]: (
      <Chip label="运行超时" variant="outlined" color="error" />
    ),
    [OJ.SubmissionStatus.MLE]: (
      <Chip label="内存超限" variant="outlined" color="error" />
    ),
    [OJ.SubmissionStatus.RE]: (
      <Chip label="运行时错误" variant="outlined" color="error" />
    ),
    [OJ.SubmissionStatus.SE]: (
      <Chip label="系统错误" variant="outlined" color="secondary" />
    ),
    [OJ.SubmissionStatus.JUDGING1]: (
      <Chip label="正在判题" variant="outlined" color="primary" />
    ),
    [OJ.SubmissionStatus.JUDGING2]: (
      <Chip label="正在判题" variant="outlined" color="primary" />
    ),
    [OJ.SubmissionStatus.PAC]: (
      <Chip label="部分正确" variant="outlined" color="info" />
    ),
    [OJ.SubmissionStatus.CE]: (
      <Chip label="编译失败" variant="outlined" color="warning" />
    ),
    [OJ.SubmissionStatus.WA]: (
      <Chip label="答案错误" variant="outlined" color="error" />
    ),
  }[status];
};

export default () => {
  const def: GridColDef<OJ.ISubmissionsItem, string>[] = [
    {
      field: 'result',
      headerName: '提交状态',
      type: 'singleSelect',
      valueOptions: [0, 1, 2, 4, 8, -1, -2],
      renderCell: ({ value }) => getSubmissionStatusChip((value ?? '') as any),
      align: 'center',
      headerAlign: 'center',
      description: '代码的提交状态',
    },
    {
      field: 'score',
      headerName: '得分',
      align: 'center',
      headerAlign: 'center',
      description: '代码提交得分',
      flex: 1,
      minWidth: 50,
      valueGetter: params =>
        params.row.statistic_info?.score?.toString?.() ?? '0',
    },
    {
      field: 'time_cost',
      headerName: '执行用时',
      align: 'center',
      headerAlign: 'center',
      description: '代码执行耗时',
      flex: 1,
      minWidth: 80,
      valueGetter: params =>
        params.row.statistic_info.time_cost?.toString?.() ?? '0',
      valueFormatter: ({ value }) => `${value ?? 0}ms`,
    },
    {
      field: 'memory_cost',
      headerName: '内存消耗',
      align: 'center',
      headerAlign: 'center',
      description: '代码运行占用内存',
      flex: 1,
      minWidth: 80,
      valueGetter: params =>
        params.row.statistic_info.memory_cost?.toString?.() ?? '',
      valueFormatter: ({ value }) => formatMemory(value),
    },
    {
      field: 'language',
      headerName: '语言',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      minWidth: 60,
      description: '提交时使用的语言',
    },
    {
      field: 'create_time',
      headerName: '提交时间',
      valueFormatter: ({ value }) => formatDate(value),
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      minWidth: 150,
      description: '提交时间',
    },
  ];
  return def;
};

import Link from '@mui/material/Link';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import { GridColDef } from '@mui/x-data-grid';
import { Link as RouterLink } from '@modern-js/runtime/router';
import { CodeSubmission } from '@/utils/redux/codeSubmission/slice';

export default (
  showCode: (data?: { code: string; lang: string }) => void,
  showUserName = false,
) => {
  const def: GridColDef<CodeSubmission, string>[] = [
    {
      field: 'authorName',
      headerName: '用户名',
      renderCell: ({ value }: any) => (
        <Link to={`/user/${value}`} underline="hover" component={RouterLink}>
          {value}
        </Link>
      ),
      hide: !showUserName,
      flex: 1,
      description: '提交代码的用户名',
    },
    {
      field: 'status',
      headerName: '提交状态',
      type: 'singleSelect',
      valueOptions: [
        'COMPILE FAILURE',
        'RUNTIME ERROR',
        'GAME PASS',
        'GAME NOT PASS',
        'RUNTIME TERMINATED',
      ],
      renderCell: ({ value }) => {
        return {
          'COMPILE FAILURE': (
            <Chip label="编译时错误" variant="outlined" color="warning" />
          ),
          'RUNTIME ERROR': (
            <Chip label="运行时错误" variant="outlined" color="error" />
          ),
          'GAME PASS': <Chip label="通关" variant="outlined" color="success" />,
          'GAME NOT PASS': (
            <Chip label="未通关" variant="outlined" color="primary" />
          ),
          'RUNTIME TERMINATED': (
            <Chip label="运行被终止" variant="outlined" color="secondary" />
          ),
        }[value ?? ''];
      },
      flex: 1,
      description: '代码的提交状态',
    },
    {
      field: 'collectionId',
      headerName: '课堂名称',
      renderCell: ({ value, row }) => {
        return (
          <Link
            to={`/collection/${value!}`}
            underline="hover"
            component={RouterLink}
          >
            {row.collectionName}
          </Link>
        );
      },
      flex: 1,
      description: '课堂的名字, 常驻或者普通课堂, 点击回到课堂',
    },
    {
      field: 'levelId',
      headerName: '关卡名称',
      renderCell: ({ value, row }) => (
        <Link
          to={`/collection/${row.collectionId}/level:${value}`}
          underline="hover"
          component={RouterLink}
        >
          {row.levelName}
        </Link>
      ),
      flex: 1,

      description: '点击回到指定的关卡',
    },
    {
      field: 'language',
      headerName: '语言',
      flex: 1,
      description: '提交时使用的语言',
    },
    {
      field: 'submitDate',
      headerName: '提交时间',
      valueFormatter: ({ value }) => new Date(value).toLocaleString(),
      flex: 2,
      description: '提交时间',
    },
    {
      field: 'sourceCode',
      headerName: '',
      renderCell: ({ value, row }) => (
        <Button
          variant="contained"
          onClick={() => {
            showCode({ code: value ?? '', lang: row.language });
          }}
        >
          查看代码
        </Button>
      ),
      filterable: false,
      sortable: false,
      flex: 1,
      disableColumnMenu: true,
      align: 'center',
      description: '查看提交的代码',
    },
  ];
  return def;
};

import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { DataGrid, GridColDef, zhCN } from '@mui/x-data-grid';

import getColDef from './colDef';
import SubmissionResult from './SubmissionResult';

import OJ from '@/types/oj.d';
import { getSubmissions } from '@/utils/api/oj';
import { useSelector } from '@/utils/redux/hooks';
import NoRowsOverlay from '@/components/views/submithistory/NoRowsOverlay';

export default React.memo<{ onPassItem?: (rawId: string) => void }>(
  ({ onPassItem }) => {
    const theme = useTheme();
    const submissionId = useSelector(
      state => state.gameLevel.ojCurrentSubmissionId,
    );
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const problem = useSelector(state => state.gameLevel.ojProblem!);
    const [dialogSubmissionId, setDialogSubmissionId] = React.useState<
      string | undefined
    >();
    const [page, setPage] = React.useState<number>(0);
    const [rowCount, setRowCount] = React.useState<number>(0);
    const [submissionList, setSubmisstionList] = React.useState<
      OJ.ISubmissionsItem[]
    >([]);
    const columns = React.useMemo<GridColDef[]>(() => {
      return getColDef();
    }, []);
    React.useEffect(() => {
      setPage(0);
    }, [problem]);
    const updateSubmissions = React.useCallback(() => {
      getSubmissions(
        { problem_id: problem._id, offset: page },
        ({ results, total }) => {
          setSubmisstionList(results);
          setRowCount(total);
        },
      );
    }, [problem, page]);
    React.useEffect(() => {
      updateSubmissions();
    }, [problem, page, submissionId]);

    return (
      <Box
        sx={{
          padding: '20px',
          backgroundColor: '#0004',
          flexGrow: 1,
          width: '100%',
          overflowY: 'auto',
        }}
      >
        <Dialog
          fullScreen={fullScreen}
          open={dialogSubmissionId !== undefined}
          onClose={() => {
            setDialogSubmissionId(undefined);
          }}
          scroll="paper"
          aria-labelledby="responsive-dialog-title"
          sx={{
            '& > .MuiDialog-container > .MuiPaper-root': {
              maxWidth: '85vw',
            },
          }}
        >
          {dialogSubmissionId ? (
            <SubmissionResult
              submissionId={dialogSubmissionId}
              style={{
                borderRadius: 0,
                padding: '10px 20px',
                boxShadow: 'none',
              }}
            />
          ) : (
            <></>
          )}
          <DialogActions sx={{ background: '#0006' }}>
            <Button
              onClick={() => {
                setDialogSubmissionId(undefined);
              }}
              autoFocus
            >
              关闭
            </Button>
          </DialogActions>
        </Dialog>
        {submissionId ? (
          <SubmissionResult
            submissionId={submissionId}
            onSubmissionJudged={updateSubmissions}
            style={{
              marginBottom: '15px',
            }}
            onPassItem={onPassItem}
          />
        ) : (
          <></>
        )}
        <DataGrid
          pageSize={12}
          rowsPerPageOptions={[12]}
          disableSelectionOnClick
          paginationMode="server"
          rowCount={rowCount}
          columns={columns}
          rows={submissionList}
          components={{ NoRowsOverlay }}
          onPageChange={newPage => setPage(newPage)}
          localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
          onRowClick={e => setDialogSubmissionId(e.id as any)}
        />
      </Box>
    );
  },
);

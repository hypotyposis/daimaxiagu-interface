import React from 'react';
import { DataGrid, GridColDef, zhCN } from '@mui/x-data-grid';

import NoRowsOverlay from './NoRowsOverlay';
import CodeDialog from './CodeDialog';
import getColDef from './colDef';

import {
  fetchCodeSubmissions,
  fetchCodeSubmissionsByUsername,
} from '@/utils/redux/codeSubmission/slice';
import { useAppDispatch, useSelector } from '@/utils/redux/hooks';

export interface ISubmitHistoryProps {
  username?: string;
  onRefreshCountDown?: (secondRemain: number) => void;
}

export default React.memo<ISubmitHistoryProps>(
  ({ username, onRefreshCountDown }) => {
    const [code, setCode] = React.useState<
      { code: string; lang: string } | undefined
    >();
    const dispatch = useAppDispatch();
    const submissionList = useSelector(
      state => state.codeSubmission.codeSubmissionList,
    );
    const intervalRef = React.useRef<any>();

    const columns = React.useMemo<GridColDef[]>(() => {
      return getColDef(setCode, username === undefined);
    }, [username]);

    React.useEffect(() => {
      const refresh = async () => {
        if (username) {
          dispatch(fetchCodeSubmissionsByUsername(username));
        } else {
          dispatch(fetchCodeSubmissions());
        }
      };
      clearInterval(intervalRef.current);
      refresh();
      let counter = 10;
      intervalRef.current = setInterval(() => {
        --counter;
        onRefreshCountDown?.(counter);
        if (counter <= 0) {
          counter = 10;
          refresh();
        }
      }, 1000);
    }, [username]);
    React.useEffect(() => {
      return () => {
        clearInterval(intervalRef.current);
      };
    }, []);

    return (
      <>
        <CodeDialog data={code} />
        <DataGrid
          autoPageSize
          components={{ NoRowsOverlay }}
          disableSelectionOnClick
          columns={columns}
          rows={submissionList}
          localeText={zhCN.components.MuiDataGrid.defaultProps.localeText}
        />
      </>
    );
  },
);

import React from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import { runConsole } from '@/utils/api/ideJudger';
import { useSelector, useAppDispatch } from '@/utils/redux/hooks';
import { GameLevelSliceActions } from '@/utils/redux/gameLevel/slice';

export default React.memo(() => {
  const dispatch = useAppDispatch();
  const language = useSelector(state => state.gameLevel.ojCurrentLanguage);
  const code = useSelector(state => state.gameLevel.ojExportedCode ?? '');
  const cin = useSelector(state => state.gameLevel.ojConsoleInput ?? '');
  const [loading, setLoading] = React.useState<boolean>(false);
  return (
    <LoadingButton
      loading={loading}
      color="success"
      variant="outlined"
      startIcon={<PlayArrowIcon />}
      onClick={async () => {
        setLoading(true);
        dispatch(
          GameLevelSliceActions.setOJConsoleResult({
            code: '',
            cin: '',
            language: '',
            message: '',
            status: 'Pending',
          }),
        );
        const lan = {
          'C++': 'cpp',
          Python2: 'python',
          Python3: 'python',
          Golang: 'go',
          Java: 'java',
        }[language];
        await runConsole(
          code,
          lan,
          cin,
          result => dispatch(GameLevelSliceActions.setOJConsoleResult(result)),
          error => {
            dispatch(GameLevelSliceActions.toggleOJConsoleVisible(true));
            dispatch(
              GameLevelSliceActions.setOJConsoleResult({
                code,
                cin,
                language: lan,
                message: error,
                status: 'Network Error',
              }),
            );
          },
        );
        setLoading(false);
      }}
    >
      执行代码
    </LoadingButton>
  );
});

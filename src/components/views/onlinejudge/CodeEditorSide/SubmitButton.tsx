import React from 'react';
import LoadingButton from '@mui/lab/LoadingButton';

import { submitProblem } from '@/utils/api/oj';
import { useSelector, useAppDispatch } from '@/utils/redux/hooks';
import { GameLevelSliceActions } from '@/utils/redux/gameLevel/slice';

export default React.memo(() => {
  const dispatch = useAppDispatch();
  const problem = useSelector(state => state.gameLevel.ojProblem!);
  const currentLanguage = useSelector(
    state => state.gameLevel.ojCurrentLanguage,
  );
  const code = useSelector(state => state.gameLevel.ojExportedCode);
  const [submitting, setSubmitting] = React.useState<boolean>(false);
  return (
    <LoadingButton
      variant="contained"
      color="success"
      sx={{
        marginLeft: '10px',
      }}
      loading={submitting}
      onClick={async () => {
        if (code !== undefined) {
          setSubmitting(true);
          await submitProblem(
            problem.id,
            currentLanguage,
            code,
            submissionId => {
              dispatch(
                GameLevelSliceActions.setOJCurrentSubmissionId(submissionId),
              );
            },
          );
          setSubmitting(false);
        }
      }}
    >
      提交
    </LoadingButton>
  );
});

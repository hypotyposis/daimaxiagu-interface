import React from 'react';
import Box from '@mui/material/Box';
import { getStudentShareScreenTrack } from '../middleware';
import VideoTrackView from '@/components/VideoTrackView';
import { useSelector } from '@/utils/redux/hooks';

export default React.memo(({ studentId }: { studentId: number }) => {
  const onStudentScreenChannel = useSelector(
    state => state.classroom.studentShareScreenMap[studentId] === true,
  );
  const studentScreenChannelId = useSelector(
    state => state.agora.studentScreenChannelId,
  );
  const videoTrackReady = useSelector(
    state => Object.keys(state.agora.studentScreenMap).length > 0,
  );
  const track = React.useMemo(
    () => (videoTrackReady ? getStudentShareScreenTrack(studentId) : undefined),
    [videoTrackReady],
  );
  if (onStudentScreenChannel && studentScreenChannelId !== '') {
    if (track) {
      return (
        <VideoTrackView
          track={track}
          style={{
            width: '100%',
            position: 'relative',
            background: 'black',
            borderTop: '1px #CCC5 solid',
          }}
        />
      );
    } else {
      return (
        <Box
          sx={{
            width: '100%',
            height: '200px',
            background: 'black',
            borderTop: '1px #CCC5 solid',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '20px',
          }}
        >
          等待学生端允许共享...
        </Box>
      );
    }
  } else {
    return <></>;
  }
});

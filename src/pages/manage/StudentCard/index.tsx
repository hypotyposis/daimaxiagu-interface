import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';

import JoinChannelButton from './JoinChannelButton';
import StudentScreenButton from './StudentScreenButton';
import StudentMuteButton from './StudentMuteButton';
import StudentVideoWindow from './StudentVideoWindow';
import SubmitHistoryButton from './SubmitHistoryButton';

import { colyseusClientSlice } from '@/utils/redux/colyseusClient/slice';
import { useAppDispatch, useSelector } from '@/utils/redux/hooks';

export interface IStudentCardProps {
  info: {
    id: number;
    name: string;
  };
}

export default React.memo<IStudentCardProps>(({ info }) => {
  const dispatch = useAppDispatch();
  const focused = useSelector(
    state => state.classroom.studentSourceCodeMap[info.id] !== undefined,
  );

  return (
    <Paper
      elevation={2}
      sx={{
        background: focused ? '#8885' : '#8881',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '35px',
        }}
      >
        <Avatar
          sx={{ height: '35px', width: '35px', marginRight: '6px' }}
          variant="square"
        >
          {info.name[0]}
        </Avatar>
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '2px 0',
            height: '100%',
            overflow: 'hidden',
            cursor: 'pointer',
          }}
          onClick={() => {
            dispatch(
              colyseusClientSlice.actions.activateStudent({
                uid: info.id,
              }),
            );
          }}
        >
          <Box
            sx={{
              fontSize: '12px',
              fontWeight: '800',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              width: '100%',
            }}
          >
            {info.name}
          </Box>
          <Box
            sx={{
              fontSize: '6px',
              opacity: 0.3,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              width: '100%',
            }}
          >{`UID: ${info.id}`}</Box>
        </Box>
        <SubmitHistoryButton studentName={info.name} />
        <StudentMuteButton studentId={info.id} />
        <StudentScreenButton studentId={info.id} />
        <JoinChannelButton studentId={info.id} />
      </Box>
      <StudentVideoWindow studentId={info.id} />
    </Paper>
  );
});

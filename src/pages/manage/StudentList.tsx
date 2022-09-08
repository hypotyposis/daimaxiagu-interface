import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import StudentCard from './StudentCard';
import { useSelector } from '@/utils/redux/hooks';

export default React.memo(() => {
  const studentList = useSelector(state => state.classroom.studentList);
  const userIdUsernameMap = useSelector(
    state => state.classroom.userIdUsernameMap,
  );
  return (
    <Box
      sx={{
        flexGrow: 1,
        padding: '5px',
        overflowY: 'auto',
      }}
    >
      <Stack spacing={1}>
        {studentList
          .filter(student => userIdUsernameMap[student] !== undefined)
          .map(student => (
            <StudentCard
              key={student.toString()}
              info={{ name: userIdUsernameMap[student], id: student }}
            />
          ))}
      </Stack>
    </Box>
  );
});

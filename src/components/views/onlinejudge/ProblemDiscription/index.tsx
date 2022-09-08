import React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ProblemHeader from './ProblemHeader';
import ProblemContent from './ProblemContent';

export default React.memo(() => {
  return (
    <Box
      sx={{
        width: '100%',
        overflowY: 'auto',
        flexGrow: 1,
        backgroundColor: '#0004',
      }}
    >
      <ProblemHeader
        style={{
          padding: '20px',
        }}
      />
      <Divider />
      <ProblemContent
        style={{
          padding: '20px',
          flexGrow: 1,
        }}
      />
    </Box>
  );
});

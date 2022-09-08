import React from 'react';
import IconButton from '@mui/material/IconButton';
import HistoryIcon from '@mui/icons-material/History';

export default React.memo(({ studentName }: { studentName: string }) => (
  <IconButton
    onClick={() => {
      window.open(`submit-history/${studentName}`, '_blank');
    }}
  >
    <HistoryIcon sx={{ fontSize: '16px' }} />
  </IconButton>
));

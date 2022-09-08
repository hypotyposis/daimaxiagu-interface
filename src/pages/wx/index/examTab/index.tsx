import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import StorageIcon from '@mui/icons-material/Storage';
import { useHistory } from '@modern-js/runtime/router';

import Logo from '@/pages/dashboard/Logo';

export default React.memo(() => {
  const history = useHistory();
  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '20px',
        position: 'relative',
        '& > button': {
          fontSize: '20px',
          margin: '16px 0',
          padding: '30px 10px',
          fontWeight: 800,
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '40px',
          left: 0,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          opacity: 0.4,
        }}
      >
        <Logo />
      </Box>
      <Button
        size="large"
        disabled
        variant="contained"
        color="success"
        onClick={() => {
          history.push('/wx/predict/csp2020');
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          2022 CSP J/S 估分
          <Box sx={{ fontSize: '16px', fontWeight: 500 }}>(考完立即开放)</Box>
        </Box>
      </Button>
      <Button
        size="large"
        variant="contained"
        color="info"
        startIcon={<StorageIcon />}
        onClick={() => {
          history.push('/wx/exams/csp-j');
        }}
      >
        CSP - J初赛练习
      </Button>
      <Button
        size="large"
        variant="contained"
        color="info"
        startIcon={<StorageIcon />}
        onClick={() => {
          history.push('/wx/exams/csp-s');
        }}
      >
        CSP - S初赛练习
      </Button>
    </Box>
  );
});

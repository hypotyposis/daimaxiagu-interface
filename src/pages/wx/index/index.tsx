import React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Badge from '@mui/material/Badge';
import ArticleIcon from '@mui/icons-material/Article';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import './style.css';
import ExamTab from './examTab';

export default React.memo(() => {
  const [pageIndex, setPageIndex] = React.useState<number>(0);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
      }}
    >
      <Box sx={{ flexGrow: 1, height: 0, width: '100%' }}>
        {{
          0: <ExamTab />,
        }[pageIndex] ?? (
          <Box
            sx={{
              fontSize: '30px',
              fontweight: 900,
              opacity: 0.5,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            Comming soon...
          </Box>
        )}
      </Box>
      <Tabs
        value={pageIndex}
        onChange={(_event, value) => setPageIndex(value)}
        variant="fullWidth"
        className="safe-bottom"
        sx={{
          background: '#FFF1',
          borderTop: '1px solid #FFF2',
        }}
      >
        <Tab
          icon={
            <Badge variant="dot" color="error">
              <ArticleIcon />
            </Badge>
          }
          label="CSP 测试"
        />
        <Tab icon={<AccountCircleIcon />} label="账户信息" />
      </Tabs>
    </Box>
  );
});

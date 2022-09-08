import React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

import { UserRole } from '@/types/auth.d';
import { useSelector } from '@/utils/redux/hooks';

export default React.memo(() => {
  const userId = useSelector(state => state.user.userId);
  const username = useSelector(state => state.user.username);
  const userRole = useSelector(state => state.user.userRole);
  if (!userId) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '175px',
          padding: '10px 16px 6px 16px',
          background: '#0005',
          marginTop: '-8px',
          borderBottom: '#FFF4 0.5px solid',
          fontSize: '14px',
          userSelect: 'none',
        }}
      >
        匿名(未登录)
        <Chip label="路人" size="small" variant="outlined" />
      </Box>
    );
  }
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '175px',
        padding: '10px 16px 6px 16px',
        background: '#0005',
        marginTop: '-8px',
        borderBottom: '#FFF4 0.5px solid',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontSize: '15px',
            userSelect: 'none',
          }}
        >
          {username}
        </Box>
        {{
          [UserRole.ADMIN]: (
            <Chip
              label="管理员"
              color="error"
              size="small"
              variant="outlined"
            />
          ),
          [UserRole.ANONYMOUS]: (
            <Chip label="路人" size="small" variant="outlined" />
          ),
          [UserRole.STUDENT]: (
            <Chip
              label="旅者"
              color="primary"
              size="small"
              variant="outlined"
            />
          ),
          [UserRole.BOT]: (
            <Chip
              label="BOT"
              color="secondary"
              size="small"
              variant="outlined"
            />
          ),
        }[userRole] ?? (
          <Chip label={userRole} size="small" variant="outlined" />
        )}
      </Box>
      <Box
        sx={{
          color: '#FFF7',
          fontSize: '12px',
        }}
      >
        UID: {userId}
      </Box>
    </Box>
  );
});

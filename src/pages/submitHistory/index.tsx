import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import { Helmet } from '@modern-js/runtime/head';
import { useParams, useHistory } from '@modern-js/runtime/router';
import UserGateKeeper from '@/components/auth/UserGateKeeper';
import SubmitHistory from '@/components/views/submithistory';
import { useSelector } from '@/utils/redux/hooks';

const LevelIndex = React.memo(() => {
  const history = useHistory();
  const { username } = useParams<{ username?: string }>();
  const myUsername = useSelector(state => state.user.username);
  const userRole = useSelector(state => state.user.userRole);
  const [countDown, setCountDown] = React.useState<number>();

  React.useEffect(() => {
    if (userRole === 'student' && username !== myUsername) {
      history.replace(`/submit-history/${myUsername}`);
    }
  }, [userRole, myUsername, username]);

  return (
    <>
      <Helmet>
        <title>
          {username === undefined
            ? '所有人的提交历史'
            : `${username} 的提交历史`}
        </title>
      </Helmet>
      <UserGateKeeper admin student goBack>
        <Box
          sx={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: '40px',
          }}
        >
          <Box sx={{ display: 'flex', paddingBottom: '10px' }}>
            <Box sx={{ flexGrow: 1, fontSize: 26, fontWeight: 800 }}>
              {username === undefined
                ? '所有人的提交历史'
                : `${username} 的提交历史`}
            </Box>
            {countDown !== undefined ? (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                自动刷新已启动
                <Box
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    marginLeft: '10px',
                  }}
                >
                  <CircularProgress
                    variant="determinate"
                    value={(10 - countDown) * 10}
                  />
                  <Box
                    sx={{
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      position: 'absolute',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography
                      variant="caption"
                      component="div"
                      color="text.secondary"
                    >{`${countDown}s`}</Typography>
                  </Box>
                </Box>
              </Box>
            ) : (
              <></>
            )}
          </Box>
          <SubmitHistory
            username={username}
            onRefreshCountDown={setCountDown}
          />
        </Box>
      </UserGateKeeper>
    </>
  );
});

export default LevelIndex;

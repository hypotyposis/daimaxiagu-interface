import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import ApiIcon from '@mui/icons-material/Api';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import { useHistory } from '@modern-js/runtime/router';
import OutlinedInput from '@mui/material/OutlinedInput';
import Visibility from '@mui/icons-material/Visibility';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { setJWT } from '@/utils/redux/user/slice';
import { loginWithPasswordV2 } from '@/utils/api/login';
import { useAppDispatch, useSelector } from '@/utils/redux/hooks';

export default React.memo(() => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const deviceUID = useSelector(state => state.user.deviceUID);
  const [username, setUsername] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [passwordVisible, setPasswordVisible] = React.useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState<
    { severity?: AlertColor; message: string } | undefined
  >(undefined);

  const login = React.useCallback(async (username, password) => {
    loginWithPasswordV2(
      username,
      password,
      deviceUID,
      jwt => {
        dispatch(setJWT(jwt));
        setSnackbarMessage({ message: '登录成功!', severity: 'success' });
        const back = parseInt(
          new URLSearchParams(location.search).get('back') ?? '0',
          10,
        );
        if (back > 0) {
          history.go(-back);
        } else {
          history.push('/');
        }
      },
      error =>
        setSnackbarMessage({
          message: error,
          severity: 'error',
        }),
    );
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        position: 'fixed',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '365px',
          width: '100%',
          padding: '0 15px',
        }}
      >
        <Snackbar
          open={snackbarMessage !== undefined}
          onClose={() => {
            setSnackbarMessage(undefined);
          }}
        >
          <MuiAlert
            variant="filled"
            severity={snackbarMessage?.severity ?? 'info'}
            sx={{ width: '100%' }}
            onClose={() => {
              setSnackbarMessage(undefined);
            }}
          >
            {snackbarMessage?.message}
          </MuiAlert>
        </Snackbar>
        <Box
          sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
        >
          <ApiIcon sx={{ mr: 1 }} />
          <Box component="h2" sx={{ userSelect: 'none' }}>
            欢迎回来 峡谷的探险者
          </Box>
        </Box>
        <Box
          sx={{
            fontStyle: 'italic',
            fontSize: '12px',
            opacity: 0.5,
            userSelect: 'none',
            marginBottom: '12px',
          }}
        >
          删档测试中...
        </Box>

        <FormControl
          fullWidth
          required
          error={username.length === 0 || username.length > 30}
          sx={{ margin: '10px 0' }}
        >
          <InputLabel htmlFor="outlined-adornment-username">用户名</InputLabel>
          <OutlinedInput
            type="text"
            value={username}
            onChange={event => setUsername(event.target.value)}
            endAdornment={
              <InputAdornment position="end" sx={{ marginLeft: '16px' }}>
                <AccountCircleIcon />
              </InputAdornment>
            }
            label="Username"
          />
          {
            // eslint-disable-next-line no-nested-ternary
            username.length === 0 ? (
              <FormHelperText>用户名不能为空</FormHelperText>
            ) : username.length > 30 ? (
              <FormHelperText>用户名不能超过 30 位</FormHelperText>
            ) : (
              <></>
            )
          }
        </FormControl>

        <FormControl
          fullWidth
          required
          error={password.length === 0}
          sx={{ margin: '10px 0' }}
        >
          <InputLabel htmlFor="outlined-adornment-password">密码</InputLabel>
          <OutlinedInput
            type={passwordVisible ? 'text' : 'password'}
            value={password}
            onChange={event => setPassword(event.target.value)}
            endAdornment={
              <InputAdornment position="end" sx={{ marginRight: '4px' }}>
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => {
                    setPasswordVisible(!passwordVisible);
                  }}
                  onMouseDown={event => event.preventDefault()}
                  edge="end"
                >
                  {passwordVisible ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
          {password.length === 0 ? (
            <FormHelperText>密码不能为空</FormHelperText>
          ) : undefined}
        </FormControl>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            marginBottom: '10px',
          }}
        >
          <Button>忘记密码?</Button>
        </Box>

        <Button
          color="info"
          variant="contained"
          size="large"
          onClick={() => login(username, password)}
          disabled={
            username.length === 0 ||
            password.length === 0 ||
            username.length > 30
          }
        >
          登录
        </Button>

        <Button
          size="large"
          onClick={() => {
            const back = parseInt(
              new URLSearchParams(location.search).get('back') ?? '0',
              10,
            );
            history.push(`/registry?back=${back + 1}`);
          }}
        >
          没有账号? 点我注册一个吧!
        </Button>
      </Box>
    </Box>
  );
});

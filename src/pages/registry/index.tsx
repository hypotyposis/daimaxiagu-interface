import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import ApiIcon from '@mui/icons-material/Api';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Visibility from '@mui/icons-material/Visibility';
import { useHistory } from '@modern-js/runtime/router';
import LinearProgress from '@mui/material/LinearProgress';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import MuiAlert, { AlertColor } from '@mui/material/Alert';
import { passwordStrength } from 'check-password-strength';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { touchOjAccount } from './api';
import { registerWithPasswordV2 } from '@/utils/api/login';
import { getCaptcha } from '@/utils/api/oj';

export default React.memo(() => {
  const history = useHistory();
  const [username, setUsername] = React.useState<string>('');
  const [password1, setPassword1] = React.useState<string>('');
  const [password2, setPassword2] = React.useState<string>('');
  const [password1Visible, setPassword1Visible] =
    React.useState<boolean>(false);
  const [password2Visible, setPassword2Visible] =
    React.useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState<
    { severity?: AlertColor; message: string } | undefined
  >(undefined);
  const [captcha, setCaptcha] = React.useState<string | undefined>();
  const [captchaText, setCaptchaText] = React.useState<string>('');

  const register = React.useCallback(
    async (username, password1, password2, captchaText) => {
      touchOjAccount(
        username,
        captchaText,
        () => {
          registerWithPasswordV2(
            username,
            password1,
            password2,
            () => {
              setSnackbarMessage({
                message: '🎉恭喜你, 注册成功!',
                severity: 'success',
              });
              setTimeout(() => {
                const back = parseInt(
                  new URLSearchParams(location.search).get('back') ?? '0',
                  10,
                );
                if (back > 0) {
                  history.go(-back);
                } else {
                  history.push('/login');
                }
              }, 500);
            },
            error => {
              setSnackbarMessage({
                message: error,
                severity: 'error',
              });
            },
          );
        },
        (_code, error) => {
          setSnackbarMessage({
            message: error,
            severity: 'error',
          });
        },
      );
    },
    [],
  );

  const refreshCaptcha = React.useCallback(async () => {
    await getCaptcha(setCaptcha, () => setCaptcha(undefined));
  }, []);

  React.useEffect(() => {
    refreshCaptcha();
  }, []);

  const password1HelpText: [JSX.Element, boolean] = React.useMemo(() => {
    const len = password1.length;
    if (len === 0) {
      return [<FormHelperText key="1">密码不能为空!</FormHelperText>, true];
    } else if (len < 8) {
      return [<FormHelperText key="1">密码不能短于8位!</FormHelperText>, true];
    } else if (len > 50) {
      return [<FormHelperText key="1">密码不能长于50位!</FormHelperText>, true];
    } else {
      const strength = passwordStrength(password1).id;
      if (strength === 0 && !/^[0-9a-zA-Z]+$/.test(password1)) {
        return [<FormHelperText key="1">密码不合法!</FormHelperText>, true];
      }
      return [
        <Box
          key="1"
          sx={{
            display: 'flex',
            alignItems: 'center',
            fontSize: '10px',
            color: '#FFFFFFB2',
            padding: '6px 4px 0 4px',
          }}
        >
          {
            {
              0: '密码强度: 很低',
              1: '密码强度: 低',
              2: '密码强度: 中',
              3: '密码强度: 高',
            }[strength]
          }
          <LinearProgress
            color={
              ({
                0: 'error',
                1: 'warning',
                2: 'success',
                3: 'info',
              }[strength] ?? 'secondary') as any
            }
            variant="determinate"
            value={25 * (strength + 1)}
            sx={{ flexGrow: 1, marginLeft: '6px' }}
          />
        </Box>,
        false,
      ];
    }
  }, [password1]);

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
          <Box component="h2" style={{ userSelect: 'none' }}>
            恭候多时 让我们开始吧
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
          error={password1HelpText[1]}
          sx={{ margin: '10px 0' }}
        >
          <InputLabel htmlFor="outlined-adornment-password">密码</InputLabel>
          <OutlinedInput
            type={password1Visible ? 'text' : 'password'}
            value={password1}
            onChange={event => setPassword1(event.target.value)}
            endAdornment={
              <InputAdornment position="end" sx={{ marginRight: '4px' }}>
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => {
                    setPassword1Visible(!password1Visible);
                  }}
                  onMouseDown={event => event.preventDefault()}
                  edge="end"
                >
                  {password1Visible ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
          {password1HelpText[0]}
        </FormControl>

        <FormControl
          fullWidth
          required
          error={password1 !== password2}
          sx={{ margin: '10px 0' }}
        >
          <InputLabel htmlFor="outlined-adornment-password">
            重复密码
          </InputLabel>
          <OutlinedInput
            type={password2Visible ? 'text' : 'password'}
            value={password2}
            onChange={event => setPassword2(event.target.value)}
            endAdornment={
              <InputAdornment position="end" sx={{ marginRight: '4px' }}>
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => {
                    setPassword2Visible(!password2Visible);
                  }}
                  onMouseDown={event => event.preventDefault()}
                  edge="end"
                >
                  {password2Visible ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
          {password1 !== password2 ? (
            <FormHelperText>两次密码不相同!</FormHelperText>
          ) : (
            <></>
          )}
        </FormControl>

        <FormControl
          fullWidth
          required
          error={captchaText.length === 0}
          sx={{ margin: '10px 0' }}
        >
          <InputLabel htmlFor="outlined-adornment-captcha">验证码</InputLabel>
          <OutlinedInput
            type="text"
            value={captchaText}
            onChange={event => setCaptchaText(event.target.value)}
            endAdornment={
              <InputAdornment
                position="end"
                sx={{
                  marginLeft: '16px',
                  pointerEvents: 'click',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  refreshCaptcha();
                }}
              >
                <img src={captcha} />
              </InputAdornment>
            }
            label="Captcha"
          />
          {captchaText.length === 0 ? (
            <FormHelperText>用户名不能为空</FormHelperText>
          ) : undefined}
        </FormControl>

        <Button
          color="info"
          variant="contained"
          size="large"
          onClick={() => register(username, password1, password2, captchaText)}
          disabled={
            username.length === 0 ||
            username.length > 30 ||
            password1 !== password2 ||
            password1HelpText[1]
          }
        >
          注册
        </Button>
        <Button
          size="large"
          onClick={() => {
            history.push('/login');
          }}
        >
          已经有账号了? 点我登录!
        </Button>
      </Box>
    </Box>
  );
});

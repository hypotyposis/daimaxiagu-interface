import React from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { useHistory } from '@modern-js/runtime/router';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import { loginAnonymousV2 } from '@/utils/api/login';
import { UserRole, IJWTPayload } from '@/types/auth.d';
import { useSelector, useAppDispatch } from '@/utils/redux/hooks';
import { setJWT, setUserInfo, touchDeviceUID } from '@/utils/redux/user/slice';

export default () => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const jwt = useSelector(state => state.user.jwt);
  const deviceUID = useSelector(state => state.user.deviceUID);
  const expireDate = React.useRef<Date | undefined>(undefined);
  const [showLoginDialog, setShowLoginDialog] = React.useState<boolean>(false);

  React.useEffect(() => {
    const timer = setInterval(() => {
      if (expireDate.current) {
        const delta = expireDate.current.getTime() - new Date().getTime();
        if (delta <= 0) {
          dispatch(setJWT(undefined));
          setShowLoginDialog(true);
        } else if (delta < 600000) {
          setTimeout(() => {
            dispatch(setJWT(undefined));
            setShowLoginDialog(true);
          }, delta);
        }
      }
    }, 600000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  React.useEffect(() => {
    if (deviceUID === undefined) {
      dispatch(touchDeviceUID());
      return;
    }
    if (jwt === undefined) {
      dispatch(
        setUserInfo({
          userRole: UserRole.ANONYMOUS,
          userId: 0,
          username: `匿名${deviceUID}`,
        }),
      );
      expireDate.current = undefined;
      loginAnonymousV2(`匿名${deviceUID}`, deviceUID, jwt =>
        dispatch(setJWT(jwt)),
      );
      delete axios.defaults.headers.common.Authorization;
    } else {
      const payload = jwtDecode<IJWTPayload>(jwt);
      const expire = new Date(payload.exp * 1000);
      const now = new Date();
      if (expire < now) {
        dispatch(setJWT(undefined));
        expireDate.current = undefined;
        setShowLoginDialog(true);
      } else {
        dispatch(
          setUserInfo({
            userRole: payload.rol,
            userId: Number(payload.sub),
            username: payload.usn,
          }),
        );
        axios.defaults.headers.common.Authorization = `Bearer ${jwt}`;
      }
    }
  }, [jwt, deviceUID]);

  return (
    <Dialog
      open={showLoginDialog}
      onClose={() => {
        setShowLoginDialog(false);
      }}
    >
      <DialogTitle>请重新登录</DialogTitle>
      <DialogContent>
        <DialogContentText>
          已经好久没有验证过你的密码啦，为安全起见，请重新登陆~
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setShowLoginDialog(false);
          }}
        >
          之后再说
        </Button>
        <Button
          color="warning"
          onClick={() => {
            history.push(`/login?back=1`);
          }}
          autoFocus
        >
          现在登陆
        </Button>
      </DialogActions>
    </Dialog>
  );
};

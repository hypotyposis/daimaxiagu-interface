import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { useTheme } from '@mui/material/styles';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import useMediaQuery from '@mui/material/useMediaQuery';
import DialogContentText from '@mui/material/DialogContentText';

interface IHelpDialogArguments {
  open: boolean;
  onClose: () => unknown;
}

const HelpDialog = React.memo<IHelpDialogArguments>(({ open, onClose }) => {
  const theme = useTheme();
  return (
    <Dialog
      fullScreen={useMediaQuery(theme.breakpoints.down('md'))}
      open={open}
      onClose={onClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">{'联系我们'}</DialogTitle>
      <DialogContent>
        <DialogContentText
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: '10px',
          }}
        >
          如果你对游戏感兴趣, 欢迎来加群玩哦~ 微信扫码：
          <img
            src="https://media.daimaxiagu.com/%E4%BB%A3%E7%A0%81%E5%B3%A1%E8%B0%B7%E7%8E%A9%E5%AE%B6%E7%BE%A4-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1.JPG"
            style={{
              width: '100%',
              height: '100%',
              padding: '20px',
            }}
          />
          或者加入 QQ 群：
          <img
            src="https://media.daimaxiagu.com/%E4%BB%A3%E7%A0%81%E5%B3%A1%E8%B0%B7%E7%8E%A9%E5%AE%B6%E7%BE%A4-QQ.JPG"
            style={{
              width: '100%',
              height: '100%',
              padding: '20px',
            }}
          />
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} autoFocus>
          知道了
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default HelpDialog;

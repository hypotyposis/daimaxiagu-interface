import React from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import ApiIcon from '@mui/icons-material/Api';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import ReplyIconRounded from '@mui/icons-material/ReplyRounded';
import FavoriteIconRounded from '@mui/icons-material/FavoriteRounded';

import QRCode from '@/components/QRCode';

export default React.memo<{ popup?: boolean }>(({ popup = true }) => {
  const [favorite, setFavorite] = React.useState<boolean>(false);
  const [likeModel, setLikeModel] = React.useState<boolean>(false);
  const [shareModel, setShareModel] = React.useState<boolean>(false);
  const [contactUsModel, setContactUsModel] = React.useState<boolean>(false);
  return (
    <Box
      sx={{
        paddingBottom: '10px',
        display: 'flex',
        flexDirection: 'column',
        userSelect: 'none',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '12px 12px 26px 12px',
        }}
        onClick={() => {
          setContactUsModel(true);
        }}
      >
        <Box
          sx={{
            background: '#f44336',
            borderRadius: '50%',
            position: 'absolute',
            bottom: '16px',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          +
        </Box>
        <Box
          sx={{
            bgcolor: 'black',
            height: '45px',
            width: '45px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '50%',
            border: '1px solid #f44336',
          }}
        >
          <ApiIcon sx={{ color: 'white' }} />
        </Box>
      </Box>
      <Dialog
        onClose={() => {
          setContactUsModel(false);
        }}
        open={popup && contactUsModel}
      >
        <DialogTitle>联系我们</DialogTitle>
        <DialogContent dividers>
          您可以通过如下方式联系到我们：
          <br />
          谷老师:{' '}
          <Box
            sx={{
              fontSize: '40px',
              userSelect: 'all',
              color: 'primary.dark',
              fontWeight: 900,
              textAlign: 'center',
            }}
          >
            18069786596
          </Box>{' '}
          （微信同号，欢迎咨询）
          <br />
          <img
            width="100%"
            src="https://media.daimaxiagu.com/%E8%B0%B7%E8%80%81%E5%B8%88%E5%BE%AE%E4%BF%A1%E4%BA%8C%E7%BB%B4%E7%A0%81.JPG"
          />
          <br />
          微信长按扫码联系我们：
          <img
            width="100%"
            src="https://media.daimaxiagu.com/%E4%BB%A3%E7%A0%81%E5%B3%A1%E8%B0%B7%E9%AB%98%E5%85%89%E6%97%B6%E5%88%BB-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1.JPG"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setContactUsModel(false);
            }}
          >
            好的
          </Button>
        </DialogActions>
      </Dialog>
      <IconButton
        size="large"
        color={favorite ? 'error' : undefined}
        onClick={() => {
          setLikeModel(true);
          setFavorite(true);
        }}
      >
        <FavoriteIconRounded
          sx={{
            fontSize: '45px',
          }}
        />
      </IconButton>
      <Dialog
        onClose={() => {
          setLikeModel(false);
        }}
        open={popup && likeModel}
        sx={{
          userSelect: 'none',
        }}
      >
        <DialogTitle>点赞成功!</DialogTitle>
        <DialogContent dividers>
          喜欢这种教学形式吗？
          <br />
          想让孩子用闯关的方式学习编程吗？
          <br />
          谷老师:{' '}
          <Box
            sx={{
              fontSize: '40px',
              userSelect: 'all',
              color: 'primary.dark',
              fontWeight: 900,
              textAlign: 'center',
            }}
          >
            18069786596
          </Box>{' '}
          （微信同号，欢迎咨询）
          <br />
          <img
            width="100%"
            src="https://media.daimaxiagu.com/%E8%B0%B7%E8%80%81%E5%B8%88%E5%BE%AE%E4%BF%A1%E4%BA%8C%E7%BB%B4%E7%A0%81.JPG"
          />
          <br />
          微信长按扫码联系我们：
          <img
            width="100%"
            src="https://media.daimaxiagu.com/%E4%BB%A3%E7%A0%81%E5%B3%A1%E8%B0%B7%E9%AB%98%E5%85%89%E6%97%B6%E5%88%BB-%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1.JPG"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setLikeModel(false);
            }}
          >
            好的
          </Button>
        </DialogActions>
      </Dialog>
      <IconButton
        size="large"
        onClick={() => {
          setShareModel(true);
        }}
      >
        <ReplyIconRounded
          sx={{
            transform: 'rotateY(180deg)',
            fontSize: '45px',
          }}
        />
      </IconButton>
      <Dialog
        onClose={() => {
          setShareModel(false);
        }}
        open={popup && shareModel}
      >
        <DialogContent dividers>
          保存下方的二维码即可分享该页面哦：
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              marginTop: '15px',
            }}
          >
            <QRCode text={window.location.href} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShareModel(false);
            }}
          >
            好的
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
});

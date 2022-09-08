import React from 'react';
import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import FormLabel from '@mui/material/FormLabel';
import CloseIcon from '@mui/icons-material/Close';
import RadioGroup from '@mui/material/RadioGroup';
import IconButton from '@mui/material/IconButton';
import QrCodeIcon from '@mui/icons-material/QrCode';
import FormControl from '@mui/material/FormControl';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';

import { UserRole } from '@/types/auth.d';
import { useSelector } from '@/utils/redux/hooks';
import { createHighlightPage } from '@/utils/api/game-highlight';
import ShareVideoPage from '@/components/views/sharepage/video';
import Badge, {
  SupportedBadgeType,
} from '@/components/views/sharepage/video/Badge';
import QRCode from '@/components/QRCode';

export interface IDIYModelProps {
  onClose: () => void;
  show: boolean;
  videoId: string;
  posterUrl: string;
}

export default React.memo<IDIYModelProps>(
  ({ onClose, show, videoId, posterUrl }) => {
    const code = useSelector(state => state.gameLevel.exportedCode!);
    const levelId = useSelector(state => state.gameLevel.levelId!);
    const levelName = useSelector(state => state.gameLevel.levelData!.title);
    const collectionId = useSelector(state => state.gameLevel.collectionId!);
    const collectionName = useSelector(
      state => state.gameLevel.collectionData!.title,
    );
    const language = useSelector(state => state.gameLevel.currentLanguage);
    const date = React.useMemo(() => new Date(), []);
    const tags = React.useMemo(
      () => ['代码峡谷', collectionName, levelName, '信奥编程'],
      [levelName, collectionName],
    );
    const userId = useSelector(state => state.user.userId);
    const username = useSelector(state => state.user.username);
    const userRole = useSelector(state => state.user.userRole);
    const [title, setTitle] = React.useState<string>('我的AI创作');
    const [name, setName] = React.useState<string>(() =>
      userRole === UserRole.ANONYMOUS ? '匿名用户' : username?.trim?.() ?? '',
    );
    const [description, setDiscription] = React.useState<string>(
      `这是我在「代码峡谷」的第一个作品。这节课我在「${collectionName}」中通过了『${levelName}』, 快来看看吧!`,
    );
    const [badge, setBadge] = React.useState<string>(SupportedBadgeType[0]);
    const [loadingModel, setLoadingModel] = React.useState<boolean>(false);
    const [resultUrl, setResultUrl] = React.useState<string>('');

    return (
      <>
        <Dialog
          open={show}
          maxWidth={false}
          sx={{ maxHeight: 'calc(100% - 50px)' }}
        >
          <DialogTitle>
            作品编辑
            <IconButton
              aria-label="close"
              onClick={() => {
                onClose?.();
                setResultUrl('');
                setLoadingModel(false);
              }}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: theme => theme.palette.grey[500],
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <Box
            sx={{
              display: 'flex',
              overflow: 'hidden',
              height: '75vh',
            }}
          >
            <ShareVideoPage
              style={{
                height: '100%',
                width: '42.1875vh',
                flexShrink: 0,
              }}
              title={title}
              name={name}
              description={description}
              tags={tags}
              badge={badge}
              code={code}
              language={language}
              levelId={levelId}
              collectionId={collectionId}
              levelName={levelName}
              collectionName={collectionName}
              date={date}
              popup={false}
              videoId={videoId}
              posterUrl={posterUrl}
            />
            <Box
              sx={{
                flexGrow: 1,
                width: '600px',
                height: '100%',
                background: '#0005',
                padding: '10px 10px',
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'auto',
              }}
            >
              <TextField
                label="作品名"
                error={title.length > 15}
                helperText={
                  title.length > 15
                    ? '超过字数限制'
                    : `还可以输入${15 - title.length} 个字`
                }
                defaultValue={title}
                onChange={event => {
                  setTitle(event.target.value.trim());
                }}
                sx={{
                  marginTop: '20px',
                }}
              />
              <TextField
                required
                label="作者"
                error={name.length === 0 || name.length > 15}
                helperText={
                  // eslint-disable-next-line no-nested-ternary
                  name.length === 0
                    ? '作者名不能为空'
                    : name.length > 15
                    ? '超过字数限制'
                    : `还可以输入${15 - name.length} 个字`
                }
                defaultValue={userRole === UserRole.ANONYMOUS ? '' : username}
                onChange={event => {
                  setName(event.target.value.trim());
                }}
                sx={{
                  marginTop: '20px',
                }}
              />
              <TextField
                multiline
                label="作品介绍"
                error={description.length > 140}
                helperText={
                  description.length > 140
                    ? '超过字数限制'
                    : `还可以输入${140 - description.length} 个字`
                }
                defaultValue={description}
                onChange={event => {
                  setDiscription(event.target.value.trim());
                }}
                sx={{
                  marginTop: '20px',
                }}
              />
              <FormControl
                sx={{
                  padding: '20px 10px',
                }}
                onChange={event => {
                  setBadge((event.target as any).value);
                }}
              >
                <FormLabel id="badge-ratio-group">徽章</FormLabel>
                <RadioGroup
                  aria-labelledby="badge-ratio-group"
                  defaultValue={SupportedBadgeType[0]}
                >
                  <FormControlLabel value="" control={<Radio />} label="不选" />
                  {SupportedBadgeType.map(type => (
                    <FormControlLabel
                      key={type}
                      value={type}
                      control={<Radio />}
                      label={<Badge type={type} />}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
              <Box
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    fontSize: '20px',
                    padding: '12px 30px',
                    marginBottom: '50px',
                  }}
                  startIcon={<QrCodeIcon />}
                  disabled={
                    name.length === 0 ||
                    name.length > 15 ||
                    title.length > 15 ||
                    description.length > 140
                  }
                  onClick={async () => {
                    setLoadingModel(true);
                    try {
                      const id = await createHighlightPage({
                        author_name: name,
                        badge,
                        collection_id: collectionId,
                        collection_name: collectionName,
                        level_id: levelId,
                        level_name: levelName,
                        description,
                        language,
                        poster_uri: posterUrl,
                        source_code: code,
                        tags: tags.join('#'),
                        title,
                        user_id: userId,
                        video_id: videoId,
                      });
                      const wxTitle = encodeURIComponent(
                        `「${name}」的作品: 《${title ?? '无题'}》`,
                      );
                      setResultUrl(
                        `${window.location.origin}/share/levelvideo/${id}?title=${wxTitle}`,
                      );
                    } catch (e) {
                      onClose?.();
                      setResultUrl('');
                      setLoadingModel(false);
                    }
                  }}
                >
                  生成作品二维码
                </Button>
              </Box>
            </Box>
          </Box>
        </Dialog>
        <Dialog open={show && loadingModel}>
          <Box sx={{ padding: '30px', display: 'flex', alignItems: 'center' }}>
            <CircularProgress
              color="inherit"
              sx={{
                width: '26px !important',
                height: '26px !important',
                marginRight: '10px',
              }}
            />
            作品页面生成中
          </Box>
        </Dialog>
        <Dialog open={show && resultUrl !== ''}>
          <DialogTitle>二维码生成完毕</DialogTitle>
          <Box
            sx={{
              padding: '30px',
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            手机/平板上长按保存到相册,
            电脑上右键保存或者直接将图片拖拽到桌面上/QQ微信中
            <br />
            或者微信扫码打开页面
            <br />
            <br />
            <QRCode text={resultUrl} />
            二维码只出现一次, 退出后就无法重新生成哦,{' '}
            请妥善保管二维码或者扫码分享朋友圈
          </Box>
          <DialogActions>
            <Button
              onClick={() => {
                onClose?.();
                setResultUrl('');
                setLoadingModel(false);
              }}
            >
              我已知晓, 关闭页面
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  },
);

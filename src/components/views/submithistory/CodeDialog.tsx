import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MarkdownBlock from '@/components/views/markdown/MarkdownBlock';

export interface ICodeDialogProps {
  data?: { code: string; lang: string; detail?: string };
  selectable?: boolean;
}

export default React.memo<ICodeDialogProps>(({ data, selectable = false }) => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const handleClose = React.useCallback(() => {
    setOpen(false);
  }, []);
  React.useEffect(() => {
    setOpen(data !== undefined);
  }, [data]);
  const language = React.useMemo(() => {
    return (
      {
        'c++': 'cpp',
        golang: 'go',
        python3: 'python',
      }[data?.lang?.toLowerCase?.() ?? ''] ?? data?.lang
    );
  }, [data]);

  if (data === undefined) {
    return <></>;
  }

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      scroll="paper"
      aria-labelledby="responsive-dialog-title"
      sx={{
        userSelect: selectable ? 'inherit' : 'none',
      }}
    >
      <DialogTitle id="responsive-dialog-title">代码详情</DialogTitle>
      <DialogContent>
        <MarkdownBlock
          style={{ minWidth: '400px' }}
          text={`\`\`\`${language} showLineNumbers\n${data.code}\n\`\`\``}
          usePrism
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>
          关闭
        </Button>
      </DialogActions>
    </Dialog>
  );
});

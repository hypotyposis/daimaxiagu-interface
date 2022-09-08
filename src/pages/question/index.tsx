import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { Helmet } from '@modern-js/runtime/head';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { IQuestionInfoJson } from '@/types/json';
import UserGateKeeper from '@/components/auth/UserGateKeeper';
import QuestionView from '@/components/views/questions/QuestionView';
import QuestionEditor from '@/components/views/questions/QuestionEditor';
import { SidebarTopPad } from '@/components/views/collection/Sidebar/SidebarContainer';
import MixCodeEditor from '@/components/views/codeeditor/MixCodeEditor';

export default ({ match: { params } }: any) => {
  const [title, setTitle] = React.useState<string>('加载中...');
  const [debugQuestion, setDebugQuestion] = React.useState<
    IQuestionInfoJson | undefined
  >();
  const [importDebugQuestion, setImportDebugQuestion] = React.useState<
    IQuestionInfoJson | undefined
  >();
  const [dialog, setDialog] = React.useState<'import' | 'export' | undefined>();
  const genJsonRef = React.useRef<() => IQuestionInfoJson>();
  const [tmpText, setTmpText] = React.useState<string>('{}');
  return (
    <UserGateKeeper admin goBack>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <QuestionView
          questionId={params?.questionId?.trim?.() ?? ''}
          title="测试"
          setTitle={setTitle}
          style={{
            width: 'min(1000px, 100%)',
          }}
          debugQuestion={debugQuestion}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
          }}
        >
          <QuestionEditor
            json={importDebugQuestion}
            genJsonRef={genJsonRef}
            style={{
              flexGrow: 1,
              height: 0,
              padding: '20px',
              overflow: 'auto',
            }}
          />
          <SidebarTopPad
            sx={{
              borderTop: '1px solid #fff2',
              height: '60px !important',
              background: 'rgb(40, 44, 52)',
            }}
          >
            <Button
              variant="contained"
              onClick={() => {
                setDialog('import');
              }}
            >
              导入
            </Button>
            <Button
              variant="contained"
              sx={{ flexGrow: 1, margin: '0 10px', background: '#0190ec' }}
              color="info"
              onClick={() => {
                if (genJsonRef.current) {
                  setDebugQuestion(genJsonRef.current());
                }
              }}
            >
              预览
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setDialog('export');
                setTmpText(
                  JSON.stringify(genJsonRef.current?.() ?? {}, undefined, 2),
                );
              }}
            >
              导出
            </Button>
          </SidebarTopPad>
        </Box>
      </Box>
      <Dialog
        open={dialog !== undefined}
        sx={{
          '& > .MuiDialog-container > .MuiPaper-root': {
            background: '#282c34',
            width: '90%',
            maxWidth: '1000px !important',
          },
        }}
      >
        <DialogTitle>
          {dialog === 'import' ? '导入题目' : '导出题目'}
        </DialogTitle>
        <DialogContent>
          <MixCodeEditor
            language="json"
            code={tmpText}
            readOnly={dialog !== 'import'}
            onChange={(value: string) => setTmpText(value)}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDialog(undefined);
              setTmpText('{}');
            }}
          >
            取消
          </Button>
          <Button
            onClick={() => {
              if (dialog === 'import') {
                try {
                  setImportDebugQuestion(JSON.parse(tmpText));
                } catch {}
              }
              setDialog(undefined);
              setTmpText('{}');
            }}
          >
            完成
          </Button>
        </DialogActions>
      </Dialog>
    </UserGateKeeper>
  );
};

import React from 'react';
import { SxProps } from '@mui/material';
import Button from '@mui/material/Button';
import RefreshIcon from '@mui/icons-material/Refresh';

import { getPaperData } from '@/utils/api/getData';
import LoadingMask from '@/components/LoadingMask';
import { IPaperInfo } from '@/types/data.d';
import MarkdownBlock from '@/components/views/markdown/MarkdownBlock';

export interface IMarkdownViewArgumant {
  paperId: string;
  setTitle?: (title: string) => unknown;
  style?: SxProps;
}

const MarkdownView = React.memo<IMarkdownViewArgumant>(
  ({ paperId, setTitle, style }) => {
    const [paperInfo, setPaperInfo] = React.useState<IPaperInfo | undefined>();
    const [errorStr, setErrorStr] = React.useState<string | undefined>('');
    const getPaper = React.useCallback(() => {
      setErrorStr('');
      getPaperData(
        paperId,
        (paper: IPaperInfo) => {
          setPaperInfo(paper);
          setTitle?.(`${paper.title} - 代码峡谷编程`);
          setErrorStr(undefined);
        },
        (error: string) => {
          setPaperInfo(undefined);
          setTitle?.('出错啦');
          setErrorStr(error);
        },
      );
    }, [paperId]);
    React.useEffect(() => {
      getPaper();
    }, [paperId]);
    const maskContent = React.useMemo(() => {
      if (errorStr === undefined) {
        return <></>;
      } else if (errorStr === '') {
        return <h1>加载中...</h1>;
      } else {
        return (
          <>
            <h1>出错啦</h1>
            <p style={{ color: '#f44336' }}>{`Message: ${errorStr}`}</p>
            <br />
            <Button
              startIcon={<RefreshIcon />}
              onClick={() => getPaper()}
              size="large"
            >
              点击刷新
            </Button>
          </>
        );
      }
    }, [errorStr]);

    return (
      <>
        <LoadingMask
          show={errorStr !== undefined}
          loadingIcon={errorStr === ''}
          content={maskContent}
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          {paperInfo ? (
            <MarkdownBlock style={{ ...(style ?? {}) }} text={paperInfo.text} />
          ) : undefined}
        </LoadingMask>
      </>
    );
  },
);

export default MarkdownView;

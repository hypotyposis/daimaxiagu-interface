import React from 'react';
import { Helmet } from '@modern-js/runtime/head';
import Box from '@mui/material/Box';
import UserGateKeeper from '@/components/auth/UserGateKeeper';
import MarkdownView from '@/components/views/markdown/MarkdownView';

const PaperIndex = ({ match: { params } }: any) => {
  const [title, setTitle] = React.useState<string>('加载中...');
  return (
    <UserGateKeeper admin goBack>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MarkdownView
          paperId={params?.paperId.trim() ?? ''}
          setTitle={setTitle}
          style={{
            padding: '20px 30px 40px 30px',
            width: 'min(1000px, 100%)',
          }}
        />
      </Box>
    </UserGateKeeper>
  );
};

export default PaperIndex;

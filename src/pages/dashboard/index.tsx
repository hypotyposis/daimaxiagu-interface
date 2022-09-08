import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import { Helmet } from '@modern-js/runtime/head';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useHistory } from '@modern-js/runtime/router';

import Footer from './Footer';
import DashboardAppBar from './DashboardAppBar';
import HelpDialog from '@/components/views/collection/HelpDialog';
import { getCollectionSummary, CollectionSummary } from '@/utils/api/getData';

const ComingSoon = () => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff2',
        fontSize: '30px',
        fontWeight: '700',
        userSelect: 'none',
      }}
    >
      Coming soon...
    </Box>
  );
};

export default () => {
  const [openContactUs, setOpenContactUs] = React.useState(false);
  const [collectionsInfo, setCollectionsInfo] =
    React.useState<CollectionSummary>([]);
  const [errorStr, setErrorStr] = React.useState<string | undefined>('');
  const history = useHistory();

  const _getCollectionSummary = React.useCallback(() => {
    setErrorStr('');
    getCollectionSummary(
      (summary: CollectionSummary) => {
        setCollectionsInfo(summary);
        setErrorStr(undefined);
      },
      (error: string) => {
        setCollectionsInfo([]);
        setErrorStr(error);
      },
    );
  }, []);
  React.useEffect(() => {
    _getCollectionSummary();
  }, []);
  const singleModeGallery = React.useMemo(() => {
    if (errorStr === '') {
      return [1].map(item => (
        <Grid item xs={2} sm={2} md={2} lg={2} xl={2} key={item}>
          <Skeleton
            variant="rectangular"
            sx={{
              backgroundColor: '#777',
              borderRadius: '10px',
              height: '150px',
            }}
          />
          <Skeleton
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: '10px',
            }}
          />
        </Grid>
      ));
    } else if (errorStr === undefined) {
      return collectionsInfo.map(item => (
        <Grid item xs={2} sm={2} md={2} lg={2} xl={2} key={item.id}>
          <Button
            variant="text"
            onClick={() => {
              history.push(`/collection/${item.id}`);
            }}
            sx={{
              flexDirection: 'column',
              padding: '0',
              width: '100%',
              height: '100%',
              borderRadius: '10px',
            }}
          >
            <Box
              sx={{
                backgroundColor: '#777',
                borderRadius: '10px',
                height: '150px',
                width: '100%',
                overflow: 'hidden',
              }}
            >
              <img
                alt={item.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                loading="lazy"
                src={
                  item.preface ??
                  'https://media.daimaxiagu.com/collections/%E9%BB%98%E8%AE%A4%E5%B0%81%E9%9D%A2.jpg'
                }
              ></img>
            </Box>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: '10px',
                color: '#aaa',
                fontSize: '16px',
                fontWeight: '600',
              }}
            >
              <Box>{item.title}</Box>
            </Box>
          </Button>
        </Grid>
      ));
    } else {
      return (
        <Box
          sx={{
            height: '300px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <h1>出错啦</h1>
          <p style={{ color: '#f44336' }}>{`Message: ${errorStr}`}</p>
          <br />
          <Button
            startIcon={<RefreshIcon />}
            onClick={() => {
              _getCollectionSummary();
            }}
            size="large"
          >
            点击刷新
          </Button>
        </Box>
      );
    }
  }, [collectionsInfo, errorStr]);

  return (
    <>
      <Helmet>
        <title>关卡中心 - 代码峡谷编程</title>
      </Helmet>
      <HelpDialog
        open={openContactUs}
        onClose={() => {
          setOpenContactUs(false);
        }}
      />
      <Box
        sx={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <DashboardAppBar />
        <Box
          sx={{
            height: '100%',
            width: '100%',
            overflowY: 'scroll',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Box
            sx={{
              padding: '0 24px',
              maxWidth: '1530px',
              width: '100%',
              margin: '0 auto',
              marginBottom: '20px',
              flexGrow: 1,
            }}
          >
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                marginTop: '20px',
              }}
            >
              <Button
                variant="text"
                sx={{
                  padding: 0,
                  overflow: 'hidden',
                  borderRadius: '10px',
                  width: '100%',
                  maxWidth: '700px',
                }}
                onClick={() => {
                  setOpenContactUs(true);
                }}
              >
                <img
                  width="100%"
                  src="https://media.daimaxiagu.com/%E5%8A%A0%E5%85%A5%E7%8E%A9%E5%AE%B6%E7%BE%A4%E6%A8%AA%E5%B9%85.jpg"
                />
              </Button>
            </Box>
            <h2 style={{ userSelect: 'none' }}>单人模式</h2>
            <Box
              sx={{ flexGrow: 1, paddingBottom: '20px', position: 'relative' }}
            >
              <Grid
                container
                spacing={{ xs: 2, md: 3 }}
                columns={{ xs: 4, sm: 6, md: 8, lg: 10, xl: 12 }}
              >
                {singleModeGallery}
              </Grid>
            </Box>
            <Divider />
            <h2 style={{ userSelect: 'none' }}>联机模式</h2>
            <Box sx={{ flexGrow: 1, paddingBottom: '20px' }}>
              <ComingSoon />
            </Box>
            <Divider />
            <h2 style={{ userSelect: 'none' }}>峡谷元宇宙</h2>
            <Box sx={{ flexGrow: 1, paddingBottom: '20px' }}>
              <ComingSoon />
            </Box>
          </Box>
          <Footer />
        </Box>
      </Box>
    </>
  );
};

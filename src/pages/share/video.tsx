import React from 'react';
import Box from '@mui/material/Box';
import { Helmet } from '@modern-js/runtime/head';
import { useParams, useLocation } from '@modern-js/runtime/router';
import Logo from '@/pages/dashboard/Logo';
import { getWeixinJsApiSignature } from '@/utils/WeixinShare';
import ShareVideoPage from '@/components/views/sharepage/video';
import AboutUsPart from '@/components/views/sharepage/video/AboutUsPart';
import { getHighlightPage, IHighlightPage } from '@/utils/api/game-highlight';

export default React.memo(() => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const title = React.useMemo(() => {
    const title = new URLSearchParams(location.search).get('title');
    return title
      ? decodeURIComponent(title)
      : '我的高光时刻 - 代码峡谷 AI 创作';
  }, [location]);
  const [page, setPage] = React.useState<IHighlightPage | undefined | null>();

  React.useEffect(() => {
    (async () => {
      try {
        setPage(await getHighlightPage(parseInt(id, 10)));
      } catch (e) {
        setPage(null);
      }
    })();
  }, [id]);

  React.useEffect(() => {
    getWeixinJsApiSignature(
      title,
      '来看看我在代码峡谷的冒险旅程!',
      'https://yuandanapp.oss-cn-hangzhou.aliyuncs.com/cover.png',
      window.location.href,
    );
  }, []);

  if (page === undefined) {
    return <></>;
  }

  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      {page === null ? (
        <Box
          sx={{
            overflow: 'auto',
            height: '100%',
            width: '100%',
            background: '#121212',
          }}
        >
          <Box
            sx={{
              height: '90%',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              padding: '50px',
              background: '#181818',
            }}
          >
            <Logo style={{ flexGrow: 1 }} />
            <h1>出错啦</h1>
            <p style={{ flexGrow: 1 }}>页面似乎不存在哦</p>
            <p>
              关注我们：<a href="https://daimaxiagu.com">daimaxiagu.com</a>
            </p>
            <p style={{ fontSize: '8px' }}>
              AI编程课, 让孩子快乐学编程, 轻松过信奥!
            </p>
          </Box>
          <AboutUsPart />
        </Box>
      ) : (
        <ShareVideoPage
          style={{
            height: '100%',
            width: '100%',
            maxWidth: '56.25vh',
            margin: '0 auto',
          }}
          videoId={page.video_id}
          description={page.description}
          title={page.title}
          name={page.author_name}
          tags={page.tags.split('#')}
          badge={page.badge ?? ''}
          code={page.source_code}
          language={page.language}
          levelId={page.level_id}
          collectionId={page.collection_id}
          levelName={page.level_name}
          collectionName={page.collection_name}
          date={page.date ? new Date(page.date) : new Date()}
        />
      )}
    </>
  );
});

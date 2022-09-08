import React from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useParams, Redirect, useHistory } from '@modern-js/runtime/router';

import { getCollectionData } from '@/utils/api/getData';
import LoadingMask from '@/components/LoadingMask';
import { ICollectionInfo } from '@/types/data.d';

const randomColors = [
  '#CC5637',
  '#BD75A9',
  '#D6A311',
  '#75A374',
  '#427D7E',
  '#6F7471',
  '#006293',
  '#6D527C',
  '#312D1E',
];

export default React.memo(() => {
  const history = useHistory();
  const { type } = useParams<{ type: string }>();
  const [errorStr, setErrorStr] = React.useState<string | undefined>('');
  const [collectionData, setCollectionData] = React.useState<
    ICollectionInfo | undefined
  >();

  const getCollection = React.useCallback(() => {
    if (!['csp-j', 'csp-s'].includes(type)) {
      return;
    }
    setErrorStr('');
    getCollectionData(
      'cpp-5_csp_j',
      async (collection: ICollectionInfo) => {
        setCollectionData(collection);
        setErrorStr(undefined);
      },
      (error: string) => {
        setCollectionData(undefined);
        setErrorStr(error);
      },
    );
  }, [type]);

  React.useEffect(() => {
    getCollection();
  }, [type]);

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
            onClick={() => getCollection()}
            size="large"
          >
            点击刷新
          </Button>
        </>
      );
    }
  }, [errorStr]);

  if (!['csp-j', 'csp-s'].includes(type)) {
    return <Redirect to="/wx/index" />;
  }

  return (
    <LoadingMask
      show={errorStr !== undefined}
      loadingIcon={errorStr === ''}
      content={maskContent}
    >
      <Fab
        size="small"
        sx={{ position: 'fixed', top: '5px', left: '5px', opacity: 0.5 }}
        onClick={() => history.goBack()}
      >
        <ArrowBackIosNewIcon />
      </Fab>
      {collectionData ? (
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
          columns={{ xs: 2, sm: 4, md: 6 }}
          p={2}
          sx={{ overflow: 'auto', height: '100%', userSelect: 'none' }}
        >
          {collectionData.toc
            .filter(item => item.id?.startsWith?.(type) === true)
            .map((item, _index) => (
              <Grid key={item.title} item xs={1}>
                <Paper
                  elevation={2}
                  sx={{
                    height: '140px',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                  }}
                  onClick={() => {
                    history.push(`/wx/exam-csp/${item.id!}`);
                  }}
                >
                  <Box
                    sx={{
                      flexGrow: 1,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontSize: '26px',
                      fontWeight: 200,
                      backgroundColor:
                        randomColors[_index % randomColors.length],
                    }}
                  >
                    {item.title.substring(0, 4)}
                  </Box>
                  <Box
                    sx={{
                      height: '50px',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 10px',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {item.title}
                  </Box>
                </Paper>
              </Grid>
            ))}
        </Grid>
      ) : (
        <></>
      )}
    </LoadingMask>
  );
});

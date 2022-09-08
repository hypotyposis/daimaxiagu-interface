import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Helmet } from '@modern-js/runtime/head';
import { useHistory } from '@modern-js/runtime/router';

import AgoraController from './AgoraController';
import CollectionContent from './CollectionContent';
import Sidebar from './Sidebar';
import { initGame } from './gameMiddleware';

import { GameLevelSliceActions } from '@/utils/redux/gameLevel/slice';
import { useSelector, useAppDispatch } from '@/utils/redux/hooks';
import { getCollectionData } from '@/utils/api/getData';
import LoadingMask from '@/components/LoadingMask';
import { ICollectionInfo } from '@/types/data.d';

interface ICollectionViewProps {
  collectionId: string;
  tocId?: string;
  debugCocosUri?: string;
}

const CollectionView = React.memo<ICollectionViewProps>(
  ({ collectionId, tocId, debugCocosUri }) => {
    const history = useHistory();
    const dispatch = useAppDispatch();
    const collectionData = useSelector(state => state.gameLevel.collectionData);
    const collectionTocId = useSelector(
      state => state.gameLevel.collectionTocId,
    );
    const [errorStr, setErrorStr] = React.useState<string | undefined>('');
    const [title, setTitle] = React.useState<string>('加载中...');

    const getCollection = React.useCallback(() => {
      setErrorStr('');
      getCollectionData(
        collectionId,
        async (collection: ICollectionInfo) => {
          dispatch(
            GameLevelSliceActions.changeCollection({
              collectionId,
              collectionData: collection,
            }),
          );
          setTitle(`${collection.title} - 代码峡谷编程`);
          setErrorStr(undefined);
        },
        (error: string) => {
          dispatch(
            GameLevelSliceActions.changeCollection({
              collectionId: undefined,
              collectionData: undefined,
            }),
          );
          dispatch(GameLevelSliceActions.setCollectionTocId(undefined));
          setTitle('出错啦');
          setErrorStr(error);
        },
      );
    }, [collectionId]);

    React.useEffect(() => {
      initGame();
    }, []);

    React.useEffect(() => {
      getCollection();
      return () => {
        dispatch(
          GameLevelSliceActions.changeCollection({
            collectionId: undefined,
            collectionData: undefined,
          }),
        );
      };
    }, [collectionId]);

    React.useEffect(() => {
      if (collectionData) {
        if (collectionTocId) {
          if (tocId !== collectionTocId) {
            history.replace(`/collection/${collectionId}/${collectionTocId}`);
          }
        } else {
          dispatch(GameLevelSliceActions.setCollectionTocId(tocId));
        }
      }
    }, [collectionData, tocId, collectionTocId]);

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

    return (
      <>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <LoadingMask
          show={errorStr !== undefined}
          loadingIcon={errorStr === ''}
          content={maskContent}
        >
          {collectionData && collectionTocId ? (
            <>
              <AgoraController />
              <Box
                sx={{
                  height: '100%',
                  width: '100%',
                  display: 'flex',
                  position: 'relative',
                }}
              >
                <Sidebar />
                <Box
                  sx={{
                    flexGrow: 1,
                    height: '100%',
                    width: '0',
                  }}
                >
                  <CollectionContent debugCocosUri={debugCocosUri} />
                </Box>
              </Box>
            </>
          ) : undefined}
        </LoadingMask>
      </>
    );
  },
);

export default CollectionView;

import React from 'react';
import { Helmet } from '@modern-js/runtime/head';
import { useParams } from '@modern-js/runtime/router';
import CollectionView from '@/components/views/collection/CollectionView';
import UserGateKeeper from '@/components/auth/UserGateKeeper';

const LevelIndex = React.memo(() => {
  const { cocosUri } = useParams<{ cocosUri?: string }>();
  return (
    <>
      <Helmet>
        <title>调试模式</title>
      </Helmet>
      <UserGateKeeper admin>
        <CollectionView
          collectionId={'test-basic'}
          debugCocosUri={decodeURIComponent(cocosUri?.trim() ?? '')}
        />
      </UserGateKeeper>
    </>
  );
});

export default LevelIndex;

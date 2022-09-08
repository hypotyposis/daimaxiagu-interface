import React from 'react';
import { Helmet } from '@modern-js/runtime/head';
import LevelView from '@/components/views/level/LevelView';
import UserGateKeeper from '@/components/auth/UserGateKeeper';

const LevelIndex = ({ match: { params } }: any) => {
  const [title, setTitle] = React.useState<string>('加载中...');
  return (
    <UserGateKeeper admin goBack>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <LevelView levelId={params?.levelId.trim() ?? ''} setTitle={setTitle} />
    </UserGateKeeper>
  );
};

export default LevelIndex;

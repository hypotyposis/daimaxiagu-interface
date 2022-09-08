import React from 'react';
import { Helmet } from '@modern-js/runtime/head';
import SlideView from '@/components/views/slide/SlideView';
import UserGateKeeper from '@/components/auth/UserGateKeeper';

const SlideIndex = ({ match: { params } }: any) => {
  const [title, setTitle] = React.useState<string>('加载中...');
  return (
    <UserGateKeeper admin goBack>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <SlideView
        slideId={params?.slideId.trim() ?? ''}
        setTitle={setTitle}
        style={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}
      />
    </UserGateKeeper>
  );
};

export default SlideIndex;

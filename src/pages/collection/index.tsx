import CollectionView from '@/components/views/collection/CollectionView';

const CollectionIndex = ({ match: { params } }: any) => {
  return (
    <CollectionView
      collectionId={params.collectionId.trim()}
      tocId={params.tocId?.trim?.()?.replace?.(/%2F/g, ':')}
    />
  );
};

export default CollectionIndex;

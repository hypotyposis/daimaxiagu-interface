import React from 'react';
import { uniq } from 'lodash';
import Box from '@mui/material/Box';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import CodeIcon from '@mui/icons-material/Code';
import FolderIcon from '@mui/icons-material/Folder';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';

import { GameLevelSliceActions } from '@/utils/redux/gameLevel/slice';
import { useSelector, useAppDispatch } from '@/utils/redux/hooks';
import { CollectionItemType } from '@/types/data.d';
import { play } from '@/utils/audioplay';

const typeIconMap: Record<CollectionItemType, React.ReactNode> = {
  [CollectionItemType.Empty]: (
    <FolderIcon color="disabled" sx={{ marginRight: '8px' }} />
  ),
  [CollectionItemType.Level]: (
    <SmartToyIcon color="primary" sx={{ marginRight: '8px' }} />
  ),
  [CollectionItemType.Paper]: (
    <MenuBookIcon color="secondary" sx={{ marginRight: '8px' }} />
  ),
  [CollectionItemType.Slide]: (
    <SlideshowIcon color="success" sx={{ marginRight: '8px' }} />
  ),
  [CollectionItemType.Video]: (
    <OndemandVideoIcon color="error" sx={{ marginRight: '8px' }} />
  ),
  [CollectionItemType.OJ]: (
    <CodeIcon color="warning" sx={{ marginRight: '8px' }} />
  ),
  [CollectionItemType.Questions]: (
    <AppRegistrationIcon color="action" sx={{ marginRight: '8px' }} />
  ),
};

const CollectionTOC = React.memo(() => {
  const dispatch = useAppDispatch();
  const collectionId = useSelector(state => state.gameLevel.collectionId);
  const toc = useSelector(state => state.gameLevel.collectionData?.toc ?? []);
  const passMap = useSelector(state => state.gameLevel.collectionPassMap);
  const tocId = useSelector(state => state.gameLevel.collectionTocId);
  const [expandedList, setExpandedList] = React.useState<string[]>([]);
  const previousCollectionIdRef = React.useRef(collectionId);
  const tocIdIndexMap = useSelector(
    state => state.gameLevel.collectionTocIdIndexMap,
  );

  const tocTree = React.useMemo(() => {
    let index = -1;
    const tree: React.ReactNode[] = [];
    const buildTree = (root: number): React.ReactNode => {
      if (toc.length <= root) {
        return undefined;
      }
      const siblings: React.ReactNode[] = [];
      while (toc.length > index + 1 && toc[index + 1].level > toc[root].level) {
        siblings.push(buildTree(++index));
      }
      const item = toc[root];
      return (
        <TreeItem
          key={item.rawId}
          nodeId={item.rawId}
          label={
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                height: '52px',
                color:
                  item.type !== CollectionItemType.Empty && passMap[item.rawId]
                    ? '#6eff82'
                    : 'inherit',
              }}
            >
              {typeIconMap[item.type]}
              {item.title}
            </Box>
          }
        >
          {siblings}
        </TreeItem>
      );
    };
    while (toc.length > index) {
      tree.push(buildTree(++index));
    }
    return tree;
  }, [toc, passMap]);

  React.useEffect(() => {
    let list: string[];
    if (collectionId !== previousCollectionIdRef.current) {
      list = [];
      previousCollectionIdRef.current = collectionId;
    } else {
      list = expandedList;
    }
    if (collectionId !== undefined) {
      const len = toc.length;
      const tocIndex = tocId ? tocIdIndexMap[tocId] : len;
      if (tocIndex < len) {
        let baseLevel = toc[tocIndex].level;
        for (let i = tocIndex; i >= 0; i--) {
          if (baseLevel === 0) {
            break;
          }
          if (baseLevel <= toc[i].level) {
            continue;
          }
          list.push(toc[i].rawId);
          baseLevel = toc[i].level;
        }
      }
    } else {
      list = [];
    }
    setExpandedList(uniq(list));
  }, [toc, tocId, collectionId]);

  return (
    <TreeView
      expanded={expandedList}
      selected={tocId}
      multiSelect={false}
      onNodeSelect={(_, nodeId) => {
        const index = tocIdIndexMap[nodeId];
        if (
          index !== undefined &&
          toc[index].type !== CollectionItemType.Empty
        ) {
          dispatch(GameLevelSliceActions.setCollectionTocId(nodeId));
          play('');
        }
      }}
      onNodeToggle={(_, nodeIds) => setExpandedList(nodeIds)}
      aria-label="章节目录"
      defaultCollapseIcon={<ArrowDropDownIcon />}
      defaultExpandIcon={<ArrowRightIcon />}
      sx={{ overflowY: 'auto' }}
    >
      {tocTree}
    </TreeView>
  );
});

export default CollectionTOC;

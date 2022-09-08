import { once } from 'lodash';
import { registerActionProxy } from '@/utils/redux/middlewares/proxyMiddleware';
import {
  gameLevelSlice,
  GameLevelSliceActions,
} from '@/utils/redux/gameLevel/slice';
import { colyseusClientSlice } from '@/utils/redux/colyseusClient/slice';
import { CODERUNNER_WS_BASE } from '@/utils/config';
import {
  ILevelInfo,
  CodeLanguageType,
  ICollectionInfo,
  CollectionItemType,
} from '@/types/data.d';
import { getOrSetDefault, set, batchFetch, get } from '@/utils/storage';

const gameWebSocketMap: Record<string, WebSocket> = {};
export const getGameWebSocket = (sessionId: string) =>
  gameWebSocketMap[sessionId];

export const initGame = once(() => {
  registerActionProxy(
    gameLevelSlice,
    'joinGameRoom',
    (action, api) =>
      new Promise(resolve => {
        const sessionId = action.payload.sessionId as string | undefined;
        if (
          sessionId !== api.getState().gameLevel.sessionId &&
          api.getState().gameLevel.sessionId
        ) {
          gameWebSocketMap[api.getState().gameLevel.sessionId]?.close();
          delete gameWebSocketMap[api.getState().gameLevel.sessionId];
        }
        if (sessionId) {
          // TODO: 写一下断线重连
          // https://blog.csdn.net/Beam007/article/details/108275655
          // https://blog.csdn.net/weixin_52103939/article/details/122009353
          const createWSConnection = () => {
            const gameWebSocket = new WebSocket(
              `${CODERUNNER_WS_BASE}/${sessionId}`,
            );
            gameWebSocket.onopen = _event => {
              resolve();
            };
            gameWebSocket.onerror = _event => {
              delete gameWebSocketMap[sessionId];
              resolve();
            };
            gameWebSocket.onclose = _event => {
              delete gameWebSocketMap[sessionId];
            };
            gameWebSocketMap[sessionId] = gameWebSocket;
          };
          createWSConnection();
        } else {
          resolve();
        }
      }),
  );

  registerActionProxy(gameLevelSlice, 'passLevel', async action => {
    const levelId: string | undefined = action.payload;
    if (levelId) {
      await set(`item.${levelId}.pass`, true);
    }
  });

  registerActionProxy(
    gameLevelSlice,
    'changeCollection',
    async (action, api) => {
      const { collectionId, collectionData } = action.payload as {
        collectionId: string | undefined;
        collectionData: ICollectionInfo | undefined;
      };
      if (!collectionId || !collectionData) {
        return;
      }
      const { toc } = collectionData;
      const len = toc.length;
      await batchFetch(() => {
        const list = [`collection.${collectionId}.current`];
        for (let i = 0; i < len; i++) {
          const item = toc[i];
          if (item.type === CollectionItemType.Level && item.id) {
            list.push(`item.${item.rawId}.pass`);
          }
        }
        return list;
      });
      const passLevelMap: Record<string, boolean> = {};
      for (let i = 0; i < len; i++) {
        const item = toc[i];
        if (
          item.type === CollectionItemType.Level ||
          item.type === CollectionItemType.OJ ||
          item.type === CollectionItemType.Questions
        ) {
          passLevelMap[item.rawId] = await getOrSetDefault<boolean>(
            `item.${item.rawId}.pass`,
            () => false,
          );
        }
      }
      api.dispatch(GameLevelSliceActions.setPassMap(passLevelMap));
    },
  );

  registerActionProxy(
    gameLevelSlice,
    'setCollectionTocId',
    async (action, api) => {
      const tocId: string | undefined = action.payload;
      const { collectionId, collectionData, collectionTocIdIndexMap } =
        api.getState().gameLevel;
      if (!collectionId || !collectionData) {
        return;
      }
      let _tocId = tocId;
      const { toc } = collectionData;
      const len = toc.length;
      // 取默认值
      if (!tocId) {
        _tocId = await get(`collection.${collectionId}.current`);
      }
      // 合法性检查
      if (_tocId) {
        const type = toc[collectionTocIdIndexMap[_tocId]]?.type;
        if (type === undefined || type === CollectionItemType.Empty) {
          _tocId = undefined;
        }
      }
      // 生成
      if (!_tocId) {
        for (let i = 0; i < len; i++) {
          const item = toc[i];
          if (item.type !== CollectionItemType.Empty) {
            _tocId = item.rawId;
            break;
          }
        }
      }
      if (_tocId) {
        await set(`collection.${collectionId}.current`, _tocId);
        action.payload = _tocId;
      }
    },
  );

  registerActionProxy(
    gameLevelSlice,
    'setCurrentLanguage',
    async (action, api) => {
      const { levelId, levelData } = api.getState().gameLevel;
      if (levelId) {
        const language: string = action.payload;
        await set(`level.${levelId}.language`, language);
        const code = await getOrSetDefault(
          `level.${levelId}.code.${language}`,
          () => levelData.defaultCode[language],
        );
        api.dispatch(gameLevelSlice.actions.setCode(code));
      }
    },
  );

  registerActionProxy(gameLevelSlice, 'updateCode', async (action, api) => {
    const { levelId } = api.getState().gameLevel;
    if (levelId) {
      const code: string = action.payload;
      await set(
        `level.${levelId}.code.${api.getState().gameLevel.currentLanguage}`,
        code,
      );
      api.dispatch(
        colyseusClientSlice.actions.sendMessage({ sourceCode: code }),
      );
    }
  });

  registerActionProxy(gameLevelSlice, 'setLevel', async (action, api) => {
    const { levelData, levelId } = action.payload as {
      levelData: ILevelInfo;
      levelId: string;
    };
    if (!levelId || !levelData) {
      return;
    }
    await batchFetch(() => {
      const batchFetchList = levelData.supportedLanguages.map(
        language => `level.${levelId}.code.${language}`,
      );
      batchFetchList.push(`level.${levelId}.language`);
      return batchFetchList;
    });
    const currentLanguage = await getOrSetDefault<CodeLanguageType>(
      `level.${levelId}.language`,
      () => levelData.defaultLanguage ?? levelData.supportedLanguages[0],
    );
    api.dispatch(gameLevelSlice.actions._setCurrentLanguage(currentLanguage));
    const code = await getOrSetDefault(
      `level.${levelId}.code.${currentLanguage}`,
      () => levelData.defaultCode[currentLanguage],
    );
    api.dispatch(gameLevelSlice.actions.setCode(code));
  });
});

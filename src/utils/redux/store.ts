import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { userSlice } from './user/slice';
import { commandListSlice } from './command/slice';
import { roomSlice } from './multiplayerRoom/slice';
import { changeListSlice } from './gameChange/slice';
import { colyseusClientSlice } from './colyseusClient/slice';
import { classroomSlice } from './classroom/slice';
import { codeSubmissionSlice } from './codeSubmission/slice';
import { agoraSlice } from './agora/slice';
import { gameLevelSlice } from './gameLevel/slice';
import { studentManageSlice } from './studentManage/slice';
import colyseusMiddleware from './middlewares/colyseusMiddleware';
import loggerMiddleware from './middlewares/loggerMiddleware';
import proxyMiddleware from './middlewares/proxyMiddleware';
import { devMode } from '@/utils/config';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'],
};

const rootReducer = combineReducers({
  user: userSlice.reducer,
  commandList: commandListSlice.reducer,
  room: roomSlice.reducer,
  changeList: changeListSlice.reducer,
  colyseusClient: colyseusClientSlice.reducer,
  classroom: classroomSlice.reducer,
  codeSubmission: codeSubmissionSlice.reducer,
  agora: agoraSlice.reducer,
  gameLevel: gameLevelSlice.reducer,
  studentManage: studentManageSlice.reducer,
});

// 使用persistReducer强化reducer,persistReducer(config, reducer)
const persistedReducer = persistReducer(persistConfig, rootReducer);

const customMiddlewares = [colyseusMiddleware, proxyMiddleware];
if (devMode) {
  customMiddlewares.push(loggerMiddleware);
}

const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      // serializableCheck: {
      //   // Ignore these action types
      //   ignoredActions: ['your/action/type'],
      //   // Ignore these field paths in all actions
      //   ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
      //   // Ignore these paths in the state
      //   ignoredPaths: ['items.dates'],
      // },
      serializableCheck: false,
    }).concat(customMiddlewares),
});

const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default { store, persistor };

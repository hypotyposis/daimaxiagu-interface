import { createSlice, SliceCaseReducers } from '@reduxjs/toolkit';
import { createProxyReducers } from '../middlewares/proxyMiddleware';
import {
  ILevelInfo,
  IQuestionInfo,
  CodeLanguageType,
  ICollectionInfo,
  ICollectionItemBase,
  CollectionItemType,
} from '@/types/data.d';
import OJ from '@/types/oj.d';
import { IJudgerResult } from '@/types/ideJudger.d';

type GameState =
  | 'Loading'
  | 'Start'
  | 'Compiling'
  | 'Running'
  | 'Error'
  | 'Runned';

export interface GameLevelSlice {
  collectionId: string | undefined;
  collectionData: ICollectionInfo | undefined;
  collectionTocId: string | undefined;
  collectionTocNextId: string | undefined;
  collectionTocLastId: string | undefined;
  collectionItem: ICollectionItemBase | undefined;
  collectionPassMap: Record<string, boolean>;
  collectionTocIdIndexMap: Record<string, number>;
  // Level
  levelId: string | undefined;
  levelData: ILevelInfo | undefined;
  importedCode: string | undefined;
  exportedCode: string | undefined;
  currentLanguage: CodeLanguageType;
  gameState: GameState;
  gameRoomId: string | undefined;
  gameSessionId: string | undefined;
  showTip: boolean;
  changeTimestamp: number;
  // OJ
  ojProblem: OJ.IProblem | undefined;
  ojCurrentLanguage: OJ.ProblemLanguage;
  ojImportedCode: string | undefined;
  ojExportedCode: string | undefined;
  ojChangeTimestamp: number;
  ojCurrentSubmissionId: string | undefined;
  ojShowConsole: boolean;
  ojConsoleInput: string | undefined;
  ojConsoleResult: IJudgerResult | undefined;
  // Questions
  questionIds: string[] | undefined;
  questionDatas: Record<string, IQuestionInfo> | undefined;
  questionScores: Record<string, number[]> | undefined;
  questionAnswers: Record<string, number[][]>;
  questionBoardVisible: boolean;
  questionResultMode: boolean;
  questionSummaryVisible: boolean;
  currentQuestionExplanation: [number, number] | undefined;
  currentQuestionIndex: [number, number];
  currentQuestionId: string | undefined;
  currentQuestionData: IQuestionInfo | undefined;
  questionStartTimestamp: number;
  questionEndTimestamp: number | undefined;
}

const initialState: GameLevelSlice = {
  collectionId: undefined,
  collectionData: undefined,
  collectionTocId: undefined,
  collectionTocNextId: undefined,
  collectionTocLastId: undefined,
  collectionItem: undefined,
  collectionPassMap: {},
  collectionTocIdIndexMap: {},
  // Level
  levelId: undefined,
  levelData: undefined,
  currentLanguage: 'cpp',
  importedCode: undefined,
  exportedCode: undefined,
  gameState: 'Loading',
  gameRoomId: undefined,
  gameSessionId: undefined,
  showTip: false,
  changeTimestamp: new Date().getTime(),
  // OJ
  ojProblem: undefined,
  ojCurrentLanguage: 'C++',
  ojImportedCode: undefined,
  ojExportedCode: undefined,
  ojChangeTimestamp: new Date().getTime(),
  ojCurrentSubmissionId: undefined,
  ojShowConsole: false,
  ojConsoleInput: undefined,
  ojConsoleResult: undefined,
  // Questions
  questionIds: undefined,
  questionDatas: undefined,
  questionScores: undefined,
  questionAnswers: {},
  questionBoardVisible: false,
  questionResultMode: false,
  questionSummaryVisible: false,
  currentQuestionExplanation: undefined,
  currentQuestionIndex: [0, 0],
  currentQuestionId: undefined,
  currentQuestionData: undefined,
  questionStartTimestamp: new Date().getTime(),
  questionEndTimestamp: undefined,
};

export const gameLevelSlice = createSlice<
  GameLevelSlice,
  SliceCaseReducers<GameLevelSlice>
>({
  name: 'gameLevelSlice',
  initialState,
  reducers: {
    setGameState: (state, action) => {
      state.gameState = action.payload;
    },
    setCode: (state, action) => {
      if (typeof action.payload === 'string') {
        state.importedCode = action.payload;
      } else {
        state.importedCode = action.payload.code;
        state.currentLanguage = action.payload.language;
      }
      state.changeTimestamp = new Date().getTime();
    },
    setOJCode: (state, action) => {
      state.ojImportedCode = action.payload;
      state.ojChangeTimestamp = new Date().getTime();
    },
    joinGameRoom: (state, action) => {
      state.gameRoomId = action.payload.roomId;
      state.gameSessionId = action.payload.sessionId;
    },
    showTip: state => {
      state.showTip = true;
    },
    hideTip: state => {
      state.showTip = false;
    },
    setPassMap: (state, action) => {
      state.collectionPassMap = action.payload;
    },
    setOJCurrentSubmissionId: (state, action) => {
      state.ojCurrentSubmissionId = action.payload;
    },
    setOJConsoleInput: (state, action) => {
      state.ojConsoleInput = action.payload;
    },
    toggleOJConsoleVisible: (state, action) => {
      state.ojShowConsole = action.payload === true;
    },
    setOJConsoleResult: (state, action) => {
      state.ojConsoleResult = action.payload;
      state.ojShowConsole = true;
    },
    setQuestionBoardVisible: (state, action) => {
      state.questionBoardVisible = action.payload === true;
      state.currentQuestionExplanation = undefined;
      state.questionSummaryVisible = false;
    },
    setCurrentQuestionExplanation: (state, action) => {
      state.questionBoardVisible = false;
      state.currentQuestionExplanation = action.payload;
      state.questionSummaryVisible = false;
    },
    setCurrentQuestionIndex: (state, action) => {
      state.currentQuestionIndex = action.payload;
      const currentId = state.questionIds?.[action.payload[0]];
      state.currentQuestionId = currentId;
      state.currentQuestionData = currentId
        ? state.questionDatas?.[currentId]
        : undefined;
      state.currentQuestionExplanation = undefined;
      state.questionBoardVisible = false;
      state.questionSummaryVisible = false;
    },
    setQuestionResultMode: (state, action) => {
      state.questionResultMode = action.payload === true;
      state.questionSummaryVisible = action.payload === true;
      state.currentQuestionExplanation = undefined;
      state.questionBoardVisible = false;
      state.questionEndTimestamp = new Date().getTime();
    },
    setQuestionSummaryVisible: (state, action) => {
      state.questionSummaryVisible = action.payload === true;
      state.currentQuestionExplanation = undefined;
      state.questionBoardVisible = false;
    },
    ...createProxyReducers({
      changeCollection: (state, action) => {
        const { collectionId, collectionData } = action.payload as {
          collectionId: string | undefined;
          collectionData: ICollectionInfo | undefined;
        };
        state.collectionId = collectionId;
        state.collectionData = collectionData;
        if (collectionData) {
          const map: Record<string, number> = {};
          collectionData.toc.forEach((item, index) => {
            map[item.rawId] = index;
          });
          state.collectionTocIdIndexMap = map;
        } else {
          state.collectionTocIdIndexMap = {};
          state.collectionItem = undefined;
          state.collectionPassMap = {};
          state.collectionTocId = undefined;
          state.collectionTocLastId = undefined;
          state.collectionTocNextId = undefined;
        }
      },
      setCollectionTocId: (state, action) => {
        const tocId: string | undefined = action.payload;
        const index = state.collectionTocIdIndexMap[tocId!] ?? -1;
        if (index === -1 || state.collectionData === undefined) {
          state.collectionTocId = undefined;
          state.collectionTocLastId = undefined;
          state.collectionTocNextId = undefined;
          state.collectionItem = undefined;
        } else {
          const { toc } = state.collectionData;
          const len = toc.length;
          state.collectionTocId = tocId;
          state.collectionItem = toc[index];
          /* eslint-disable curly */
          // Next TOC Index
          let i;
          for (
            i = index + 1;
            i < len && toc[i].type === CollectionItemType.Empty;
            i++
          );
          state.collectionTocNextId = i < len ? toc[i].rawId : undefined;
          for (
            i = index - 1;
            i >= 0 && toc[i].type === CollectionItemType.Empty;
            i--
          );
          state.collectionTocLastId = i >= 0 ? toc[i].rawId : undefined;
          /* eslint-enable curly */
        }
      },
      setQuestions: (state, action) => {
        const { questionDatas, questionIds, questionScores } = action.payload;
        state.questionIds = questionIds;
        state.questionDatas = questionDatas;
        state.questionScores = questionScores;
        state.questionAnswers = {};
        state.questionBoardVisible = false;
        state.questionResultMode = false;
        state.currentQuestionIndex = [0, 0];
        state.questionStartTimestamp = new Date().getTime();
        if (questionDatas === undefined || questionIds === undefined) {
          state.currentQuestionId = undefined;
          state.currentQuestionData = undefined;
        } else {
          state.currentQuestionId = questionIds[0];
          state.currentQuestionData = questionDatas[questionIds[0]];
        }
        state.currentQuestionExplanation = undefined;
        state.questionSummaryVisible = false;
        state.questionEndTimestamp = undefined;
      },
      setQuestionAnswers: (state, action) => {
        const ids = Object.keys(action.payload.answers);
        const len = ids.length;
        for (let i = 0; i < len; i++) {
          const id = ids[i];
          if (state.questionDatas?.[id] !== undefined) {
            state.questionAnswers[id] = action.payload.answers[id];
          }
        }
        state.currentQuestionExplanation = undefined;
        state.questionBoardVisible = false;
        state.questionSummaryVisible = false;
      },
      passLevel: (state, action) => {
        state.collectionPassMap[action.payload] = true;
      },
      setLevel: (state, action) => {
        state.levelId = action.payload.levelId;
        state.levelData = action.payload.levelData;
        if (action.payload.levelData === undefined) {
          state.showTip = false;
          state.gameState = 'Loading';
          state.exportedCode = undefined;
          state.importedCode = undefined;
        }
      },
      setCurrentLanguage: (state, action) => {
        state.currentLanguage = action.payload;
      },
      updateCode: (state, action) => {
        state.exportedCode = action.payload;
      },
      // OJ
      setOJProblem: (state, action) => {
        state.ojProblem = action.payload;
        if (action.payload === undefined) {
          state.ojShowConsole = false;
          state.ojExportedCode = undefined;
          state.ojImportedCode = undefined;
          state.ojConsoleInput = undefined;
          state.ojConsoleResult = undefined;
          state.ojCurrentSubmissionId = undefined;
        }
      },
      setOJCurrentLanguage: (state, action) => {
        state.ojCurrentLanguage = action.payload;
      },
      updateOJCode: (state, action) => {
        state.ojExportedCode = action.payload;
      },
    }),
  },
});

export const GameLevelSliceActions = {
  passLevel: gameLevelSlice.actions.passLevel,
  setPassMap: gameLevelSlice.actions.setPassMap,
  changeCollection: gameLevelSlice.actions.changeCollection,
  setCollectionTocId: gameLevelSlice.actions.setCollectionTocId,
  // Level
  showTip: gameLevelSlice.actions.showTip,
  hideTip: gameLevelSlice.actions.hideTip,
  setCode: gameLevelSlice.actions.setCode,
  setLevel: gameLevelSlice.actions.setLevel,
  updateCode: gameLevelSlice.actions.updateCode,
  joinGameRoom: gameLevelSlice.actions.joinGameRoom,
  setGameState: gameLevelSlice.actions.setGameState,
  setCurrentLanguage: gameLevelSlice.actions.setCurrentLanguage,
  // OJ
  setOJCode: gameLevelSlice.actions.setOJCode,
  setOJProblem: gameLevelSlice.actions.setOJProblem,
  updateOJCode: gameLevelSlice.actions.updateOJCode,
  setOJConsoleInput: gameLevelSlice.actions.setOJConsoleInput,
  setOJConsoleResult: gameLevelSlice.actions.setOJConsoleResult,
  setOJCurrentLanguage: gameLevelSlice.actions.setOJCurrentLanguage,
  toggleOJConsoleVisible: gameLevelSlice.actions.toggleOJConsoleVisible,
  setOJCurrentSubmissionId: gameLevelSlice.actions.setOJCurrentSubmissionId,
  // Questions
  setQuestions: gameLevelSlice.actions.setQuestions,
  setQuestionResultMode: gameLevelSlice.actions.setQuestionResultMode,
  setQuestionBoardVisible: gameLevelSlice.actions.setQuestionBoardVisible,
  setCurrentQuestionIndex: gameLevelSlice.actions.setCurrentQuestionIndex,
  setQuestionAnswers: gameLevelSlice.actions.setQuestionAnswers,
  setQuestionSummaryVisible: gameLevelSlice.actions.setQuestionSummaryVisible,
  setCurrentQuestionExplanation:
    gameLevelSlice.actions.setCurrentQuestionExplanation,
};

import { once } from 'lodash';
import { registerActionProxy } from '@/utils/redux/middlewares/proxyMiddleware';
import { gameLevelSlice } from '@/utils/redux/gameLevel/slice';

export const init = once(() => {
  registerActionProxy(gameLevelSlice, 'setQuestions', async (_action, _api) => {
    // TODO
  });

  registerActionProxy(
    gameLevelSlice,
    'setQuestionAnswers',
    async (_action, _api) => {
      // TODO
    },
  );
});

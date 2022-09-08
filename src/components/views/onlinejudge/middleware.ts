import { once } from 'lodash';
import { registerActionProxy } from '@/utils/redux/middlewares/proxyMiddleware';
import { gameLevelSlice } from '@/utils/redux/gameLevel/slice';
import { colyseusClientSlice } from '@/utils/redux/colyseusClient/slice';
import { DefaultCode } from '@/utils/config';
import { CodeLanguageType } from '@/types/data.d';
import OJ from '@/types/oj.d';
import { getOrSetDefault, set, batchFetch } from '@/utils/storage';

export const getOJDefaultCode = (language: string) =>
  DefaultCode[
    {
      'C++': 'cpp',
      Python: 'python',
      Java: 'java',
      Golang: 'go',
    }[language] as CodeLanguageType
  ] ?? '';

export const init = once(() => {
  registerActionProxy(
    gameLevelSlice,
    'setOJCurrentLanguage',
    async (action, api) => {
      const { ojProblem } = api.getState().gameLevel;
      if (ojProblem) {
        const language: string = action.payload;
        await set(`oj.${ojProblem._id}.language`, language);
        const code = await getOrSetDefault(
          `oj.${ojProblem._id}.code.${language}`,
          () => getOJDefaultCode(language),
        );
        api.dispatch(gameLevelSlice.actions.setOJCode(code));
      }
    },
  );

  registerActionProxy(gameLevelSlice, 'updateOJCode', async (action, api) => {
    const { ojProblem } = api.getState().gameLevel;
    if (ojProblem) {
      const code: string = action.payload;
      await set(
        `oj.${ojProblem._id}.code.${
          api.getState().gameLevel.ojCurrentLanguage
        }`,
        code,
      );
      api.dispatch(
        colyseusClientSlice.actions.sendMessage({ sourceCode: code }),
      );
    }
  });

  registerActionProxy(gameLevelSlice, 'setOJProblem', async (action, api) => {
    const problem = action.payload as OJ.IProblem | undefined;
    if (!problem) {
      return;
    }
    await batchFetch(() => {
      const batchFetchList = problem.languages.map(
        language => `oj.${problem._id}.code.${language}`,
      );
      batchFetchList.push(`oj.${problem._id}.language`);
      return batchFetchList;
    });
    const currentLanguage = await getOrSetDefault<OJ.ProblemLanguage>(
      `oj.${problem._id}.language`,
      () =>
        problem.languages.indexOf('C++') !== -1 ? 'C++' : problem.languages[0],
    );
    api.dispatch(gameLevelSlice.actions._setOJCurrentLanguage(currentLanguage));
    const code = await getOrSetDefault(
      `oj.${problem._id}.code.${currentLanguage}`,
      () => getOJDefaultCode(currentLanguage),
    );
    api.dispatch(gameLevelSlice.actions.setOJCode(code));
  });
});

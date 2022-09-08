import { cloneDeep } from 'lodash';
import { IQuestionInfoJson } from '@/types/json.d';
import { IQuestionInfo, SubProblemType } from '@/types/data.d';

export const parseQuestion = (
  questionJson: IQuestionInfoJson,
): IQuestionInfo | string => {
  if (questionJson.type !== '1') {
    return 'Invalid type';
  }
  try {
    return {
      title: questionJson.title ?? undefined,
      content: questionJson.content ?? undefined,
      explanation: questionJson.explanation ?? undefined,
      subProblems: questionJson.subproblems
        .filter(problem => ['single'].includes(problem.type))
        .map(problem => {
          const optionMap = problem.options.map((_option, index) => index);
          const optionMapRevert = cloneDeep(optionMap);
          if (problem.random !== false) {
            // Thanks to https://stackoverflow.com/a/2450976/9610231
            let currentIndex = optionMap.length;
            while (currentIndex !== 0) {
              const randomIndex = Math.floor(Math.random() * currentIndex--);
              [optionMap[currentIndex], optionMap[randomIndex]] = [
                optionMap[randomIndex],
                optionMap[currentIndex],
              ];
              optionMapRevert[optionMap[currentIndex]] = currentIndex;
            }
          }
          return {
            content: problem.content,
            options: problem.options,
            explanation: problem.explanation,
            explanationVideo: problem.explanationVideo ?? undefined,
            type: SubProblemType.Single,
            optionMap,
            optionMapRevert,
          };
        }),
    };
  } catch (error: any) {
    return String(error);
  }
};

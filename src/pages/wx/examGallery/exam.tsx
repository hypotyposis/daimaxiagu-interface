import React from 'react';
import { useParams } from '@modern-js/runtime/router';

import { ICollectionItemQuestions } from '@/types/data.d';
import { getCollectionData } from '@/utils/api/getData';
import QuestionView from '@/components/views/questions/QuestionView';

export default React.memo(() => {
  const { id } = useParams<{ id: string }>();
  const [errorStr, setErrorStr] = React.useState<string | undefined>('');
  const [questionData, setQuestionData] = React.useState<
    ICollectionItemQuestions | undefined
  >();

  const getQuestions = React.useCallback(() => {
    setErrorStr('');
    getCollectionData(
      'cpp-5_csp_j',
      async collection => {
        const len = collection.toc.length;
        let found = false;
        for (let i = 0; i < len; i++) {
          const item = collection.toc[i];
          if (item.id === id) {
            setQuestionData(item as ICollectionItemQuestions);
            found = true;
            break;
          }
        }
        if (!found) {
          setQuestionData(undefined);
        }
        setErrorStr(undefined);
      },
      (error: string) => {
        setQuestionData(undefined);
        setErrorStr(error);
      },
    );
  }, [id]);

  React.useEffect(() => {
    getQuestions();
  }, [id]);

  if (!questionData) {
    return <></>;
  }

  return (
    <QuestionView
      questionId={questionData.questions}
      questionScores={questionData.scores}
      title={questionData.title}
      style={{
        height: '100%',
        width: '100%',
      }}
      wxMode
    />
  );
});

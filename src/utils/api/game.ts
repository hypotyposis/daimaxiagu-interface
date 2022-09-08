import axios from 'axios';

import { CODERUNNER_API_BASE } from '../config';

export const postCode = async (
  code: string,
  template: string,
  language: string,
  uid: string,
  roomId: string,
  authorId?: number,
  collectionId?: string,
  collectionName?: string,
  levelId?: string,
  levelName?: string,
  callback?: (error: Error | null, statue?: string, data?: any) => unknown,
): Promise<void> => {
  try {
    const response = await axios({
      url: `${CODERUNNER_API_BASE}/code`,
      data: {
        code,
        template_name: template,
        language,
        uid,
        roomId,
        authorId,
        collectionId,
        collectionName,
        levelId,
        levelName,
      },
      method: 'post',
    });
    callback?.(null, response.data.status, response.data);
  } catch (error: any) {
    callback?.(error);
  }
};

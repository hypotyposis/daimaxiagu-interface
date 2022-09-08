import axios from 'axios';
import { IJudgerResult } from '@/types/ideJudger.d';
import { IDE_JUDGER_API_BASE } from '@/utils/config';

export const runConsole = async (
  code: string,
  language: string,
  cin: string,
  onSuccess?: (result: IJudgerResult) => void,
  onFail?: (error: string) => void,
) => {
  try {
    const { data } = await axios({
      url: `${IDE_JUDGER_API_BASE}/compile`,
      method: 'POST',
      data: { code, language, cin, timestamp: new Date().getTime() },
    });
    onSuccess?.({
      code,
      cin,
      ...data,
    });
  } catch (e: any) {
    onFail?.(e.toString());
  }
};

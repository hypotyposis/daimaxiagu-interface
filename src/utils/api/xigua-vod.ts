import axios from 'axios';
import { VOD_TOKEN_API_BASE } from '@/utils/config';

export const getPlayAuth = async (vid: string) => {
  return (
    await axios({
      url: `${VOD_TOKEN_API_BASE}/playAuth`,
      method: 'GET',
      params: { vid },
    })
  ).data.token;
};

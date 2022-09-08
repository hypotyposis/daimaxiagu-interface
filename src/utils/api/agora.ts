import axios from 'axios';
import { AGORA_TOKEN_API_BASE, AGORA_CONFIG } from '@/utils/config';

export const getAgoraTokenWithChannel = async (
  channel: string,
  uid: string,
): Promise<string> =>
  (
    await axios.get(`${AGORA_TOKEN_API_BASE}/agora/token/${channel}`, {
      params: { uid },
    })
  ).data.token;

export interface RTCOptions {
  appId: string;
  channel: string;
  uid: string;
  token: string;
}

export const getRTCOptions = async (
  channel: string,
  uid: number,
): Promise<RTCOptions> => {
  const token = await getAgoraTokenWithChannel(channel, `${uid}`);
  let _channel = '';
  switch (channel) {
    case 'student-host': {
      _channel = AGORA_CONFIG.CHANNEL_STUDENT_HOST;
      break;
    }
    case 'teacher-host': {
      _channel = AGORA_CONFIG.CHANNEL_TEACHER_HOST;
      break;
    }
    case 'audio': {
      _channel = AGORA_CONFIG.CHANNEL_AUDIO;
      break;
    }
    default: {
      console.error('channel is invalid');
    }
  }
  return {
    appId: AGORA_CONFIG.APP_ID,
    channel: _channel,
    uid: `${uid}`,
    token,
  };
};

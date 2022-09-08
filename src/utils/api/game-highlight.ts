import axios from 'axios';
import TTUploader from 'tt-uploader';
import { VOD_TOKEN_API_BASE, HIGHLIGHT_API_BASE } from '@/utils/config';

const VOD_SPACE_NAME = 'daimaxiagu';
const VOD_APP_ID = 333273;

interface STSToken {
  AccessKeyId: string;
  SecretAccessKey: string;
  SessionToken: string;
  ExpiredTime: string;
  CurrentTime: string;
}

const initialSTSToken: STSToken = {
  AccessKeyId: '',
  SecretAccessKey: '',
  SessionToken: '',
  ExpiredTime: '',
  CurrentTime: '',
};

export const uploadHighlight = async (
  video: Blob[],
  userId: number | undefined,
  filename: string,
  onProgress: (percent: number) => void,
  onSuccess: (videoId: string, posterUri: string) => void,
  onError: (error: unknown) => void,
) => {
  await vodUpload(video, userId, filename, onProgress, onSuccess, onError);
};

const vodUpload = async (
  video: Blob[],
  userId: number | undefined,
  filename: string,
  onProgress: (percent: number) => void,
  onSuccess: (videoId: string, posterUri: string) => void,
  onError: (error: unknown) => void,
) => {
  const uploader = new TTUploader({
    userId: userId ? userId.toString() : new Date().getTime().toString(), // 建议设置能识别用户的唯一标识id，用于上传出错时排查问题，不要传入非 ASCII编码
    appId: VOD_APP_ID, // 在视频点播-应用服务中创建的AppID，视频点播的质量监控等都是以这个参数来区分业务方的，务必正确填写
    // 仅视频/普通文件上传时需要配置
    videoConfig: {
      spaceName: VOD_SPACE_NAME, // 在视频点播中申请的点播空间名
    },
  });

  const sessionToken = await axios({
    url: `${VOD_TOKEN_API_BASE}/sts/vodupload`,
    method: 'GET',
  }).then(res => {
    const sts: STSToken = initialSTSToken;
    sts.AccessKeyId = res.data.access_key_id;
    sts.CurrentTime = res.data.current_time;
    sts.ExpiredTime = res.data.expired_time;
    sts.SecretAccessKey = res.data.secret_access_key;
    sts.SessionToken = res.data.session_token;
    return sts;
  });

  uploader.on('complete', (info: any) => {
    const vid = info.uploadResult.Vid;
    const posterUri = info.uploadResult.PosterUri;
    onSuccess?.(vid, posterUri);
  });

  uploader.on('error', (info: any) => {
    console.error(info);
    onError?.(info);
  });

  uploader.on('progress', (info: any) => {
    onProgress?.(info.percent);
  });

  const fileKey = uploader.addFile({
    file: video[0],
    stsToken: sessionToken || initialSTSToken, // 从服务端拿到的token，token为dict类型，非字符串类型，见下方说明
    type: 'video', // 上传文件类型，三个可选值：video(视频或者音频，默认值)，image(图片)，object（普通文件）
  });

  uploader.start(fileKey);
};

export interface IHighlightPage {
  author_name: string;
  badge?: string;
  collection_id: string;
  collection_name: string;
  description?: string;
  language: string;
  level_id: string;
  level_name: string;
  poster_uri: string;
  source_code: string;
  tags: string;
  title: string;
  user_id?: number;
  video_id: string;
  date?: string;
}

export const createHighlightPage = async (
  data: IHighlightPage,
): Promise<number | undefined> => {
  return (
    (await axios.post(`${HIGHLIGHT_API_BASE}/create`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })) as any
  ).data.id;
};

export const getHighlightPage = async (
  id: number,
): Promise<IHighlightPage | undefined> => {
  return (
    await axios({
      method: 'get',
      url: `${HIGHLIGHT_API_BASE}/${id}`,
    })
  ).data.message;
};

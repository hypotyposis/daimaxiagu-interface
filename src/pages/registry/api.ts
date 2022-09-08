import { devMode } from '@/utils/config';
import { register, checkUsernameOrEmail, getProfile } from '@/utils/api/oj';

export const touchOjAccount = async (
  username: string,
  captcha: string,
  onSuccess?: () => void,
  onFail?: (code: unknown, message: string) => void,
) => {
  if (captcha.trim().length === 0) {
    onFail?.(undefined, '验证码不能为空!');
  }
  const ojEmail = devMode
    ? `${encodeURIComponent(username)}@dev.daimaxiagu.com`
    : `${encodeURIComponent(username)}@daimaxiagu.com`;
  const ojUsername = devMode
    ? `daimaxiagu-dev:${username}`
    : `daimaxiagu:${username}`;
  await getProfile();
  await checkUsernameOrEmail(
    ojEmail,
    ojUsername,
    ({ email, username }) => {
      if (email || username) {
        onSuccess?.();
        return;
      }
      register(
        ojEmail,
        ojUsername,
        'daimaxiagu.com',
        captcha,
        onSuccess,
        onFail,
      );
    },
    onFail,
  );
};

import qs from 'qs';
import axios from 'axios';
import sha256 from 'sha256';
import { passwordStrength } from 'check-password-strength';
import { AUTH_API_BASE } from '@/utils/config';

export const loginWithPasswordV1 = async (
  username: string,
  password: string,
  onSuccess?: (userId: number) => void,
  onFail?: (error: string) => void,
) => {
  if (username.length === 0 || password.length === 0) {
    onFail?.('用户名或密码错误');
    return;
  }
  try {
    const { data } = await axios({
      url: `${AUTH_API_BASE}/login`,
      method: 'POST',
      data: { username, password: sha256(password) },
    });
    switch (data.code) {
      case 200: {
        onSuccess?.(data.userId);
        break;
      }
      // Code 402 403
      default: {
        onFail?.('用户名或密码错误');
        break;
      }
    }
  } catch (e: any) {
    onFail?.(`网络错误: ${e?.toString?.() ?? ''}`);
  }
};

export const registerWithPasswordV1 = async (
  username: string,
  password1: string,
  password2: string,
  onSuccess?: (userId: number) => void,
  onFail?: (error: string) => void,
) => {
  if (
    username.length === 0 ||
    password1.length === 0 ||
    password2.length === 0
  ) {
    onFail?.('请输入用户名和密码!');
    return;
  } else if (password1 !== password2) {
    onFail?.('两次输入的密码不一致!');
    return;
  } else if (password1.length < 8) {
    onFail?.('密码不能短于8位!');
    return;
  } else if (password1.length > 50) {
    onFail?.('密码不能长于50位!');
    return;
  }
  const strength = passwordStrength(password1).id;
  if (strength === 0 && !/^[0-9a-zA-Z]+$/.test(password1)) {
    onFail?.('密码不合法!');
    return;
  }
  try {
    const { data } = await axios({
      url: `${AUTH_API_BASE}/register`,
      method: 'POST',
      data: {
        username,
        password: sha256(password1),
      },
    });
    switch (data.code) {
      case 200: {
        onSuccess?.(data.userId);
        return;
      }
      case 401: {
        onFail?.('用户名已被占用!');
        return;
      }
      default: {
        onFail?.('未知错误!');
        return;
      }
    }
  } catch (e: any) {
    onFail?.(`网络错误: ${e?.toString?.() ?? ''}`);
  }
};

export const loginWithPasswordV2 = async (
  username: string,
  password: string,
  deviceUID: string,
  onSuccess?: (jwtToken: string) => void,
  onFail?: (error: string) => void,
) => {
  if (username.length === 0 || password.length === 0) {
    onFail?.('用户名或密码错误');
    return;
  }
  try {
    const { data } = await axios({
      url: `${AUTH_API_BASE}/v2/token`,
      method: 'POST',
      data: qs.stringify({
        grant_type: 'password',
        username,
        password: sha256(password),
        client_id: deviceUID,
      }),
    });
    onSuccess?.(data.access_token);
  } catch (e: any) {
    switch (e?.response?.status) {
      case 400: {
        onFail?.(e!.response!.data!.detail);
        return;
      }
      default: {
        onFail?.(e?.toString?.() ?? '');
      }
    }
  }
};

export const loginAnonymousV2 = async (
  username: string,
  deviceUID: string,
  onSuccess?: (jwtToken: string) => void,
  onFail?: (error: string) => void,
) => {
  try {
    const { data } = await axios({
      url: `${AUTH_API_BASE}/v2/anonymous-token`,
      method: 'POST',
      data: qs.stringify({
        grant_type: 'password',
        username,
        password: 'daimaxiagu.com',
        client_id: deviceUID,
      }),
    });
    onSuccess?.(data.access_token);
  } catch (e: any) {
    onFail?.(e?.toString?.() ?? '');
  }
};

export const registerWithPasswordV2 = async (
  username: string,
  password1: string,
  password2: string,
  onSuccess?: (userId: number) => void,
  onFail?: (error: string) => void,
) => {
  if (
    username.length === 0 ||
    password1.length === 0 ||
    password2.length === 0
  ) {
    onFail?.('请输入用户名和密码!');
    return;
  } else if (password1 !== password2) {
    onFail?.('两次输入的密码不一致!');
    return;
  } else if (password1.length < 8) {
    onFail?.('密码不能短于8位!');
    return;
  } else if (password1.length > 50) {
    onFail?.('密码不能长于50位!');
    return;
  } else if (username.length > 30) {
    onFail?.('用户名不能长于30位!');
    return;
  }
  const strength = passwordStrength(password1).id;
  if (strength === 0 && !/^[0-9a-zA-Z]+$/.test(password1)) {
    onFail?.('密码不合法!');
    return;
  }
  try {
    const { data } = await axios({
      url: `${AUTH_API_BASE}/v2/register`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        username,
        password: sha256(password1),
      },
    });
    onSuccess?.(data.id);
  } catch (e: any) {
    switch (e?.response?.status) {
      case 409: {
        onFail?.(e!.response!.data!.detail);
        return;
      }
      default: {
        onFail?.(e?.toString?.() ?? '');
      }
    }
  }
};

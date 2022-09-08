import axios, { AxiosRequestConfig } from 'axios';
import OJ from '@/types/oj.d';
import { devMode, OJ_API_BASE } from '@/utils/config';

let username: string | undefined;
let ojUsername = 'daimaxiagu-anonymous';
let ojPassword = 'daimaxiagu.com';
let ojLogin = false;

const ojRawRequest = async <T>(
  config: AxiosRequestConfig = {},
  onSuccess?: (data: T) => void,
  onFail?: (code: unknown, error: string) => void,
) => {
  try {
    const { data } = await axios({
      withCredentials: true,
      xsrfHeaderName: 'X-CSRFToken',
      xsrfCookieName: 'csrftoken',
      ...config,
    });
    if (data.error) {
      onFail?.(data.error, data.data);
    } else {
      onSuccess?.(data.data);
    }
  } catch (e: any) {
    onFail?.(undefined, e.toString());
  }
};

const ojRequest = async <T>(
  config: AxiosRequestConfig = {},
  onSuccess?: (data: T) => void,
  onFail?: (code: unknown, error: string) => void,
) => {
  try {
    if (!ojLogin) {
      let profile;
      await getProfile(undefined, p => {
        profile = p;
      });
      if (profile === null) {
        await login(ojUsername, ojPassword, () => {
          ojLogin = true;
        });
      } else {
        ojLogin = true;
      }
    }
  } catch (e: any) {
    onFail?.(undefined, 'Login failed');
  }
  await ojRawRequest(config, onSuccess, onFail);
};

export const getProblem = async (
  id: number | string,
  onSuccess?: (problem: OJ.IProblem) => void,
  onFail?: (code: unknown, error: string) => void,
) => {
  await ojRawRequest<OJ.IProblem>(
    {
      method: 'GET',
      url: `${OJ_API_BASE}/problem`,
      params: {
        problem_id: typeof id === 'string' ? parseInt(id, 10) : id,
      },
    },
    onSuccess,
    onFail,
  );
};

export const submitProblem = async (
  problem_id: number,
  language: OJ.ProblemLanguage,
  code: string,
  onSuccess?: (submission_id: string) => void,
  onFail?: (code: unknown, error: string) => void,
) => {
  await ojRequest<{ submission_id: string }>(
    {
      method: 'POST',
      url: `${OJ_API_BASE}/submission`,
      data: {
        problem_id,
        language,
        code,
      },
    },
    ({ submission_id }) => {
      onSuccess?.(submission_id);
    },
    onFail,
  );
};

export const getSubmission = async (
  id: string,
  onSuccess?: (submission: OJ.ISubmission) => void,
  onFail?: (code: unknown, error: string) => void,
) => {
  await ojRequest<OJ.ISubmission>(
    {
      method: 'GET',
      url: `${OJ_API_BASE}/submission`,
      params: {
        id,
      },
    },
    onSuccess,
    onFail,
  );
};

export const ifSubmissionExists = async (
  problem_id: string,
  onSuccess?: (exists: boolean) => void,
  onFail?: (code: unknown, error: string) => void,
) => {
  await ojRequest<boolean>(
    {
      method: 'GET',
      url: `${OJ_API_BASE}/submission_exists`,
      params: {
        problem_id,
      },
    },
    onSuccess,
    onFail,
  );
};

export const getProfile = async (
  username?: string,
  onSuccess?: (profile: OJ.IUserProfile | null) => void,
  onFail?: (code: unknown, error: string) => void,
) => {
  await ojRawRequest<OJ.IUserProfile | null>(
    {
      method: 'GET',
      url: `${OJ_API_BASE}/profile`,
      params: {
        username,
      },
    },
    onSuccess,
    onFail,
  );
};

export const getCaptcha = async (
  onSuccess?: (imageSrc: string) => void,
  onFail?: (code: unknown, error: string) => void,
) => {
  await ojRawRequest<string>(
    {
      method: 'GET',
      url: `${OJ_API_BASE}/captcha`,
    },
    onSuccess,
    onFail,
  );
};

export const checkUsernameOrEmail = async (
  email: string | undefined,
  username: string | undefined,
  onSuccess?: (result: { email: boolean; username: boolean }) => void,
  onFail?: (code: unknown, error: string) => void,
) => {
  await ojRawRequest<{ email: boolean; username: boolean }>(
    {
      method: 'POST',
      url: `${OJ_API_BASE}/check_username_or_email`,
      data: {
        email,
        username,
      },
    },
    onSuccess,
    onFail,
  );
};

export const register = async (
  email: string,
  username: string,
  password: string,
  captcha: string,
  onSuccess?: (result: string) => void,
  onFail?: (code: unknown, error: string) => void,
) => {
  await ojRawRequest<string>(
    {
      method: 'POST',
      url: `${OJ_API_BASE}/register`,
      data: {
        email,
        username,
        password,
        captcha,
      },
    },
    onSuccess,
    onFail,
  );
};

export const login = async (
  username: string,
  password: string,
  onSuccess?: (result: string) => void,
  onFail?: (code: unknown, error: string) => void,
) => {
  await ojRawRequest<string>(
    {
      method: 'POST',
      url: `${OJ_API_BASE}/login`,
      data: {
        username,
        password,
      },
    },
    onSuccess,
    onFail,
  );
};

export const logout = async () => {
  await ojRawRequest<boolean>({
    method: 'GET',
    url: `${OJ_API_BASE}/logout`,
  });
};

export const getSubmissions = async (
  {
    myself = true,
    result,
    username,
    problem_id,
    page = 1,
    limit = 12,
    offset = 0,
  }: {
    myself?: boolean;
    result?: OJ.SubmissionStatus;
    username?: string;
    problem_id?: number;
    page?: number;
    limit?: number;
    offset?: number;
  },
  onSuccess?: (submissions: {
    results: OJ.ISubmissionsItem[];
    total: number;
  }) => void,
  onFail?: (code: unknown, error: string) => void,
) => {
  await ojRequest<{ results: OJ.ISubmissionsItem[]; total: number }>(
    {
      method: 'GET',
      url: `${OJ_API_BASE}/submissions`,
      params: {
        myself: myself ? 1 : 0,
        problem_id,
        result,
        username,
        page,
        limit,
        offset,
      },
    },
    onSuccess,
    onFail,
  );
};

export const setOJAccount = (
  newUsername: string | undefined = undefined,
  password = 'daimaxiagu.com',
) => {
  if (username === newUsername) {
    return;
  }
  username = newUsername;
  logout();
  ojLogin = false;
  ojPassword = password;
  ojUsername =
    username === undefined
      ? 'daimaxiagu-anonymous'
      : `daimaxiagu${devMode ? '-dev' : ''}:${username}`;
};

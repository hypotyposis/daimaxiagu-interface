import { Middleware } from 'redux';
import { pull } from 'lodash';
import { Slice, MiddlewareAPI, Dispatch, AnyAction } from '@reduxjs/toolkit';

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const emptyReducer = () => {};

export const createProxyReducers = <
  T extends Record<string, unknown> = Record<string, unknown>,
>(
  reducers: T,
): T => {
  Object.keys(reducers).forEach(key => {
    if (!key.startsWith('_')) {
      (reducers as any)[`_${key}`] = reducers[key];
      (reducers as any)[key] = emptyReducer;
    }
  });
  return reducers;
};

const actionProxiesMap: Record<
  string,
  {
    nextReducer: any;
    proxies: ((
      action: AnyAction,
      api: MiddlewareAPI<Dispatch<AnyAction>, any>,
    ) => Promise<void>)[];
  }
> = {};

export const registerActionProxy = (
  slice: Slice,
  actionName: string,
  proxy: (
    action: AnyAction,
    api: MiddlewareAPI<Dispatch<AnyAction>, any>,
  ) => Promise<void>,
) => {
  const fullActionName = slice.actions[actionName].type;
  if (!actionProxiesMap[fullActionName]) {
    actionProxiesMap[fullActionName] = {
      nextReducer: slice.actions[`_${actionName}`],
      proxies: [],
    };
  }
  actionProxiesMap[fullActionName].proxies.push(proxy);
};

export const unregisterActionProxy = (
  slice: Slice,
  actionName: string,
  proxy?: (
    action: AnyAction,
    api: MiddlewareAPI<Dispatch<AnyAction>, any>,
  ) => Promise<void>,
) => {
  const fullActionName = slice.actions[actionName].type;
  if (!actionProxiesMap[fullActionName]) {
    return;
  }
  if (proxy) {
    pull(actionProxiesMap[fullActionName].proxies, proxy);
  } else {
    actionProxiesMap[fullActionName].proxies = [];
  }
  if (actionProxiesMap[fullActionName].proxies.length === 0) {
    delete actionProxiesMap[fullActionName];
  }
};

const proxyMiddleware: Middleware = api => next => action => {
  const actionProxies = actionProxiesMap[action.type];
  if (actionProxies) {
    (async () => {
      const len = actionProxies.proxies.length;
      for (let i = 0; i < len; i++) {
        await actionProxies.proxies[i](action, api);
      }
      if (actionProxies.nextReducer) {
        api.dispatch(actionProxies.nextReducer(action.payload));
      }
    })();
  }
  return next(action);
};

export default proxyMiddleware;

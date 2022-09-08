import { Middleware } from 'redux';
import { cloneDeep } from 'lodash';

const loggerMiddleware: Middleware = store => {
  return next => {
    return action => {
      const result = next(action);
      // eslint-disable-next-line no-console
      console.debug(`[Redux] ${action.type}`, {
        action: cloneDeep(action),
        state: cloneDeep(store.getState()),
      });
      return result;
    };
  };
};

export default loggerMiddleware;

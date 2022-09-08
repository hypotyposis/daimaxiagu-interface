import localforage from 'localforage';

const _getKeys = async (keys: string[]): Promise<Record<string, unknown>> => {
  if (onlineMode) {
    // TODO: 远程读
    return {};
  } else {
    // https://localforage.github.io/localForage/#data-api-getitem
    const values: Record<string, unknown> = {};
    const len = keys.length;
    for (let i = 0; i < len; i++) {
      const key = keys[i];
      values[key] = await localforage.getItem(key);
    }
    return values;
  }
};

const _setKeys = async (
  keys: string[],
  keyAndValues: Record<string, unknown>,
) => {
  if (onlineMode) {
    // TODO: 远程写
  } else {
    const len = keys.length;
    for (let i = 0; i < len; i++) {
      const key = keys[i];
      localforage.setItem(key, keyAndValues[key]);
    }
  }
};

let onlineMode = false;
let hasInited = false;
export const login = () => {
  onlineMode = true;
  hasInited = false;
};
export const logout = () => {
  onlineMode = false;
  hasInited = false;
};
const init = () => {
  if (hasInited) {
    return;
  }
  if (onlineMode) {
    batchFetch(() => [
      'settings.gui.sidebar-visible',
      'settings.gui.code-editor-type',
      'settings.gui.newbie-dialog-vidible',
      'settings.gui.levelview-description-visible',
    ]);
  } else {
    localforage.config({
      // 数据库名
      name: 'CodePunk',
      // 表名
      storeName: 'data',
    });
  }
  hasInited = true;
};

let dirtyCache: Record<string, unknown> = {};
const cleanCache: Record<string, unknown> = {};
export const get = async <T>(key: string): Promise<T | undefined> => {
  init();
  try {
    if (cleanCache[key]) {
      // console.debug(key, cleanCache[key]);
      return cleanCache[key] as T;
    }
    const value = (await _getKeys([key]))[key];
    if (value) {
      cleanCache[key] = value;
    }
    // console.debug(key, value !== null ? (value as T) : undefined);
    return value !== null ? (value as T) : undefined;
  } catch (err) {
    console.error(err);
    return undefined;
  }
};

export const batchFetch = async (genKeys: () => string[]) => {
  if (onlineMode) {
    const keys = genKeys();
    const _keys = [];
    const len = keys.length;
    for (let i = 0; i < len; i++) {
      const key = keys[i];
      if (cleanCache[key]) {
        continue;
      }
      _keys.push(key);
    }
    _getKeys(_keys);
  }
};

export const getOrSetDefault = async <T>(
  key: string,
  getDefaultValue: () => T,
): Promise<T> => {
  const value = await get(key);
  if (value !== undefined) {
    return value as T;
  } else {
    const _value = getDefaultValue();
    set(key, _value);
    return _value;
  }
};

let throttleTimerId: NodeJS.Timeout | undefined;
const throttleTimeWindow = 5000;
export const set = async <T>(key: string, value: T) => {
  if (cleanCache[key] && cleanCache[key] === value) {
    delete dirtyCache[key];
    return;
  }
  // console.warn(key, value);
  dirtyCache[key] = value;
  cleanCache[key] = value;
  if (!throttleTimerId) {
    throttleTimerId = setTimeout(() => {
      throttleTimerId = undefined;
      try {
        init();
        const keys = Object.keys(dirtyCache);
        const len = keys.length;
        _setKeys(keys, dirtyCache);
        for (let i = 0; i < len; i++) {
          const key = keys[i];
          cleanCache[key] = dirtyCache[key];
        }
      } catch (err) {
        console.error(err);
      }
      dirtyCache = {};
    }, throttleTimeWindow);
  }
};

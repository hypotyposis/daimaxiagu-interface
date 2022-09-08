export const isArray = (object: any) =>
  Object.prototype.toString.call(object) === '[object Array]';

type VariableType = 'single' | 'list';

let tmpNameCounter = 0;
let variableMap: Record<string, { type: VariableType; using: boolean }> = {};
let blocksList: { sensor: string; code: string }[] = [];

export const resetUtils = () => {
  tmpNameCounter = 0;
  variableMap = {};
  blocksList = [];
};

export const getTmpName = () => {
  if (tmpNameCounter++ === 0) {
    return 'index';
  } else {
    return `index${tmpNameCounter}`;
  }
};

export const registerVariable = (name: string, type: VariableType) => {
  variableMap[name] = { type, using: false };
};

export const getVariables = (filter?: { single?: boolean; list?: boolean }) => {
  const variableNames = Object.keys(variableMap);
  if (filter) {
    const filterMap = {
      single: filter.single === true,
      list: filter.list === true,
    };
    return variableNames.filter(
      (name: string) =>
        filterMap[variableMap[name].type] && variableMap[name].using,
    );
  } else {
    return variableNames;
  }
};

export const usingVariable = (name: string) => {
  if (variableMap[name]) {
    variableMap[name].using = true;
  }
};

export const pushBlocks = (sensor: string, code: string) => {
  blocksList.push({ sensor, code });
};

export const getBlocks = (sensor?: string) => {
  if (sensor === undefined) {
    return blocksList;
  } else {
    return blocksList.filter(blocks => blocks.sensor === sensor);
  }
};

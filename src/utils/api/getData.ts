import axios from 'axios';
import { intersection } from 'lodash';
import { parseLevel, supportedLanguages } from '@/utils/parser/level';
import { parseQuestion } from '@/utils/parser/question';
import { OSS_RESOURCE_BASE } from '@/utils/config';
import { ICollectionItemJson, IQuestionInfoJson } from '@/types/json.d';
import {
  ILevelInfo,
  IPaperInfo,
  IQuestionInfo,
  ICollectionInfo,
  ICollectionItemBase,
  ICollectionItemLevel,
  ICollectionItemVideo,
  ICollectionItemQuestions,
  CollectionItemType,
  CodeLanguageType,
} from '@/types/data.d';

export const getJson = async (
  url: string,
  onSuccess: (data: unknown) => void,
  onFail: (error: unknown) => void,
) => {
  try {
    const response = await axios({
      url,
      method: 'get',
    });
    onSuccess?.(response.data);
  } catch (error) {
    onFail?.(error);
  }
};

interface CollectionSummaryItem {
  id: string;
  preface?: string;
  title: string;
}

export type CollectionSummary = CollectionSummaryItem[];

export const getJsonPathFromId = (id: string) => {
  return id
    .split('.')[0]
    .replace(/[^a-zA-Z0-9-_]/g, '')
    .replace(/-/g, '/');
};

const MAX_TRY_TIMES = 5;
const urlCache: Record<
  string,
  | ILevelInfo
  | ICollectionInfo
  | IPaperInfo
  | IQuestionInfo
  | CollectionSummary
  | string
  | number
> = {};

const mustHaveCollectionInfoMember = ['title', 'toc'];
const mustHaveCollectionItemMember = ['title', 'level'];

export const mergeLevelData = (
  originLevelData: ILevelInfo,
  levelItem: ICollectionItemLevel,
): ILevelInfo => {
  const levelData: ILevelInfo = JSON.parse(JSON.stringify(originLevelData));
  levelData.supportedLanguages = intersection(
    levelData.supportedLanguages,
    levelItem.language,
  );
  levelData.allowedSnippets =
    levelItem.allowedSnippets ?? levelData.allowedSnippets;
  levelData.defaultLanguage =
    levelItem.defaultLanguage ?? levelData.defaultLanguage;
  levelData.title = levelItem.title ?? levelData.title;
  return levelData;
};

/**
 * @returns 如果已经获得过该数据，就直接返回；如果还没有，就返回尝试次数(第一次为`1`)；如果已经尝试超过最大次数且每次失败，则返回`-1`
 */
export const getLevelData = (
  levelId: string,
  onSuccess: (levelInfo: ILevelInfo) => unknown,
  onFail: (errorStr: string) => unknown,
): number | ILevelInfo => {
  const url = `${OSS_RESOURCE_BASE}/levels/${getJsonPathFromId(levelId)}.json`;
  if (typeof urlCache[url] === 'number') {
    if (urlCache[url] >= MAX_TRY_TIMES) {
      return -1;
    } else {
      (urlCache[url] as number)++;
    }
  } else if (typeof urlCache[url] === 'object') {
    onSuccess(urlCache[url] as ILevelInfo);
    return urlCache[url] as ILevelInfo;
  } else {
    urlCache[url] = 1;
  }
  getJson(
    url,
    (data: unknown) => {
      const result = parseLevel(data);
      if (typeof result === 'string') {
        onFail(result);
      } else {
        urlCache[url] = result;
        onSuccess(result);
      }
    },
    (error: unknown) => {
      console.error(error);
      onFail((error as any).message);
    },
  );
  return urlCache[url] as number;
};

/**
 * @returns 如果已经获得过该数据，就直接返回；如果还没有，就返回尝试次数(第一次为`1`)；如果已经尝试超过最大次数且每次失败，则返回`-1`
 */
export const getCollectionData = (
  collectionId: string,
  onSuccess: (levelInfo: ICollectionInfo) => unknown,
  onFail: (errorStr: string) => unknown,
): number | ICollectionInfo => {
  const url = `${OSS_RESOURCE_BASE}/collections/${getJsonPathFromId(
    collectionId,
  )}.json`;
  if (typeof urlCache[url] === 'number') {
    if (urlCache[url] >= MAX_TRY_TIMES) {
      return -1;
    } else {
      (urlCache[url] as number)++;
    }
  } else if (typeof urlCache[url] === 'object') {
    onSuccess(urlCache[url] as ICollectionInfo);
    return urlCache[url] as ICollectionInfo;
  } else {
    urlCache[url] = 1;
  }
  getJson(
    url,
    (_collectionInfo: unknown) => {
      for (let i = 0, len = mustHaveCollectionInfoMember.length; i < len; i++) {
        if (!(mustHaveCollectionInfoMember[i] in (_collectionInfo as any))) {
          onFail('格式错误');
          return;
        }
      }
      const __collectionInfo = _collectionInfo as ICollectionInfo;
      let previousLevel = 0;
      for (let i = 0, len1 = __collectionInfo.toc.length; i < len1; i++) {
        for (
          let j = 0, len2 = mustHaveCollectionItemMember.length;
          j < len2;
          j++
        ) {
          if (!(mustHaveCollectionItemMember[j] in __collectionInfo.toc[i])) {
            onFail('格式错误');
            return;
          }
        }
        if (__collectionInfo.toc[i].level - previousLevel > 1) {
          onFail('格式错误');
          return;
        }
        previousLevel = __collectionInfo.toc[i].level;
      }
      const toc: ICollectionItemBase[] = [];
      let dirId = 1;
      for (let i = 0, len = __collectionInfo.toc.length; i < len; i++) {
        const item = __collectionInfo.toc[i] as ICollectionItemJson;
        let type = CollectionItemType.Empty;
        if (item.id !== undefined) {
          const [_type, path] = item.id.split(':');
          switch (_type.toLowerCase()) {
            case 'level': {
              type = CollectionItemType.Level;
              break;
            }
            case 'paper': {
              type = CollectionItemType.Paper;
              break;
            }
            case 'slide': {
              type = CollectionItemType.Slide;
              break;
            }
            case 'video': {
              type = CollectionItemType.Video;
              break;
            }
            case 'oj': {
              type = CollectionItemType.OJ;
              break;
            }
            case 'questions': {
              type = CollectionItemType.Questions;
              break;
            }
            default: {
              continue;
            }
          }
          if (type === CollectionItemType.Level) {
            let languageList: CodeLanguageType[] = [];
            if (item.language) {
              const len = item.language.length;
              for (let j = 0; j < len; j++) {
                if (supportedLanguages.includes(item.language[j])) {
                  languageList.push(item.language[j] as CodeLanguageType);
                }
              }
            } else {
              languageList = [...supportedLanguages] as CodeLanguageType[];
            }
            toc.push({
              title: item.title,
              type,
              level: item.level ?? 0,
              id: path,
              rawId: item.id,
              language: languageList,
              defaultLanguage:
                item.defaultLanguage &&
                supportedLanguages.includes(item.defaultLanguage)
                  ? item.defaultLanguage
                  : undefined,
              allowedSnippets: item.snippets,
            } as ICollectionItemLevel);
          } else if (type === CollectionItemType.Video) {
            toc.push({
              title: item.title,
              type,
              level: item.level ?? 0,
              id: path,
              rawId: item.id,
              url: item.url,
            } as ICollectionItemVideo);
          } else if (type === CollectionItemType.Questions) {
            const scoreMap: Record<string, number[]> = {};
            item.questions?.forEach?.(question => {
              if (typeof question === 'string') {
                scoreMap[question] = [];
              } else if (typeof question[1] === 'number') {
                scoreMap[question[0]] = [question[1]];
              } else {
                scoreMap[question[0]] = question[1];
              }
            });
            toc.push({
              title: item.title,
              type,
              id: path,
              rawId: item.id,
              questions:
                item.questions?.map?.(question =>
                  typeof question === 'string' ? question : question[0],
                ) ?? [],
              scores: scoreMap,
            } as ICollectionItemQuestions);
          } else {
            toc.push({
              title: item.title,
              type,
              level: item.level ?? 0,
              id: path,
              rawId: item.id,
            });
          }
        } else {
          toc.push({
            rawId: `dir:${dirId++}`,
            title: item.title,
            type,
            level: item.level ?? 0,
          });
        }
      }
      urlCache[url] = {
        title: __collectionInfo.title,
        toc,
      };
      onSuccess(urlCache[url] as ICollectionInfo);
    },
    (error: unknown) => {
      console.error(error);
      onFail((error as any).message);
    },
  );
  return urlCache[url] as number;
};

export const getPaperData = (
  paperId: string,
  onSuccess: (paperInfo: IPaperInfo) => unknown,
  onFail: (errorStr: string) => unknown,
): number | IPaperInfo => {
  const url = `${OSS_RESOURCE_BASE}/papers/${getJsonPathFromId(paperId)}.md`;
  if (typeof urlCache[url] === 'number') {
    if (urlCache[url] >= MAX_TRY_TIMES) {
      return -1;
    } else {
      (urlCache[url] as number)++;
    }
  } else if (typeof urlCache[url] === 'object') {
    onSuccess(urlCache[url] as IPaperInfo);
    return urlCache[url] as IPaperInfo;
  } else {
    urlCache[url] = 1;
  }
  getJson(
    url,
    (_paperInfo: unknown) => {
      if (_paperInfo) {
        urlCache[url] = {
          title:
            /^\s*##?[\t ]*([^\n]*)/.exec(_paperInfo as string)?.[1]?.trim() ??
            '无题',
          text: _paperInfo as string,
        };
        onSuccess(urlCache[url] as IPaperInfo);
      } else {
        onFail('File is empty');
      }
    },
    (error: unknown) => {
      console.error(error);
      onFail((error as any).message);
    },
  );
  return urlCache[url] as number;
};

export const getSlideData = (
  slideId: string,
  onSuccess: (uri: string) => unknown,
  onFail: (errorStr: string) => unknown,
): number | string => {
  const url = `${OSS_RESOURCE_BASE}/slides/${getJsonPathFromId(slideId)}.html`;
  if (typeof urlCache[url] === 'number') {
    if (urlCache[url] >= MAX_TRY_TIMES) {
      return -1;
    } else {
      (urlCache[url] as number)++;
    }
  } else if (typeof urlCache[url] === 'string') {
    urlCache[url] = url;
    onSuccess(url);
    return url;
  } else {
    urlCache[url] = 1;
  }
  getJson(
    url,
    (_paperInfo: unknown) => {
      onSuccess(url);
    },
    (error: unknown) => {
      console.error(error);
      onFail((error as any).message);
    },
  );
  return urlCache[url] as number;
};

export const getCollectionSummary = (
  onSuccess: (data: CollectionSummary) => unknown,
  onFail: (errorStr: string) => unknown,
): number | CollectionSummary => {
  const url = `${OSS_RESOURCE_BASE}/collectionsInfo.json`;
  if (typeof urlCache[url] === 'number') {
    if (urlCache[url] >= MAX_TRY_TIMES) {
      return -1;
    } else {
      (urlCache[url] as number)++;
    }
  } else if (typeof urlCache[url] === 'object') {
    onSuccess(urlCache[url] as CollectionSummary);
    return urlCache[url] as CollectionSummary;
  } else {
    urlCache[url] = 1;
  }
  getJson(
    url,
    (_paperInfo: unknown) => {
      urlCache[url] = _paperInfo as CollectionSummary;
      onSuccess(_paperInfo as CollectionSummary);
    },
    (error: unknown) => {
      console.error(error);
      onFail((error as any).message);
    },
  );
  return urlCache[url] as number;
};

export const getQuestionData = (
  questionId: string,
  onSuccess: (questionInfo: IQuestionInfo) => unknown,
  onFail: (errorStr: string) => unknown,
): number | IQuestionInfo => {
  const url = `${OSS_RESOURCE_BASE}/questions/${getJsonPathFromId(
    questionId,
  )}.json`;
  if (typeof urlCache[url] === 'number') {
    if (urlCache[url] >= MAX_TRY_TIMES) {
      return -1;
    } else {
      (urlCache[url] as number)++;
    }
  } else if (typeof urlCache[url] === 'object') {
    onSuccess(urlCache[url] as IQuestionInfo);
    return urlCache[url] as IQuestionInfo;
  } else {
    urlCache[url] = 1;
  }
  getJson(
    url,
    _questionInfo => {
      const questionInfo = _questionInfo as IQuestionInfoJson | undefined;
      if (questionInfo) {
        const result = parseQuestion(questionInfo);
        if (typeof result === 'string') {
          onFail(result);
        } else {
          urlCache[url] = result;
          onSuccess(urlCache[url] as IQuestionInfo);
        }
      } else {
        onFail('File is empty');
      }
    },
    (error: unknown) => {
      console.error(error);
      onFail((error as any).message);
    },
  );
  return urlCache[url] as number;
};

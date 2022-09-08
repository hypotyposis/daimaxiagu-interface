import { ILevelInfo, CodeLanguageType } from '@/types/data.d';
import { ILevelInfoJson } from '@/types/json.d';
import { DefaultCode, COCOS_INDEX } from '@/utils/config';

const mustHaveLevelInfoMember = [
  'language',
  'template',
  'game',
  'title',
  'map',
];

export const supportedLanguages = ['cpp', 'python', 'scratch', 'go'];

export const parseLevel = (levelInfoJsonLike: unknown): ILevelInfo | string => {
  for (let i = 0, len = mustHaveLevelInfoMember.length; i < len; i++) {
    if (!(mustHaveLevelInfoMember[i] in (levelInfoJsonLike as any))) {
      return '格式错误';
    }
  }
  const levelInfoJson = levelInfoJsonLike as ILevelInfoJson;
  if (!(levelInfoJson.game in COCOS_INDEX)) {
    return '未知游戏类型';
  }
  const languageList: CodeLanguageType[] = [];
  for (let i = 0, len = levelInfoJson.language.length; i < len; i++) {
    const language = levelInfoJson.language[i].toLowerCase();
    if (supportedLanguages.includes(language)) {
      languageList.push(language as CodeLanguageType);
    }
  }
  if (languageList.length === 0) {
    return '关卡支持的语言都不存在';
  }
  const defaultCode: Record<string, string> = {};
  const description: Record<string, string> = {};
  const tips: Record<string, string[]> = {};
  for (let i = 0, len = languageList.length; i < len; i++) {
    const language = languageList[i];
    defaultCode[language] =
      levelInfoJson.code?.[language] ?? DefaultCode[language] ?? '';
    description[language] =
      levelInfoJson.description?.[language] ??
      levelInfoJson.description?.['*'] ??
      '';
    tips[language] =
      levelInfoJson.tips?.[language] ?? levelInfoJson.tips?.['*'] ?? [];
  }

  return {
    supportedLanguages: languageList,
    allowedSnippets: levelInfoJson.snippets,
    cocosHTMLUri: COCOS_INDEX[levelInfoJson.game],
    codeRunnerTemplate: levelInfoJson.template,
    showSnippetBar: levelInfoJson.showSnippetBar !== false,
    defaultCode,
    description,
    tips,
    title: levelInfoJson.title,
    mapData: levelInfoJson.map,
  };
};

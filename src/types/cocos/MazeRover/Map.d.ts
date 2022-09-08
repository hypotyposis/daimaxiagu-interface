/**
 * 方块类型
 * @export
 * @enum {number}
 */
export enum BlockType {
  /** 虚空 */
  Void = 0,
  /** 边界 */
  Bound = 1,
  /** 道路 */
  Path = 2,
  /** 墙壁 */
  Wall = 3,
}

/**
 * 实体类型
 * @export
 * @enum {number}
 */
export enum EntityType {
  /** 玩家 */
  Player = 0,
  /** 金币 */
  Coin = 1,
  /** 旗帜 */
  Flag = 2,
}

/**
 * 导入/导出的地图对象
 * @export
 * @interface IMapFile
 */
export interface IMapFile {
  /**
   * 地图类型，如`2d`, `3d`, `out`等
   * @type {string}
   * @memberof IMapFile
   */
  type: string;
  /**
   * 地图版本
   * @type {(string | number)}
   * @memberof IMapFile
   */
  version: string | number;
}

/**
 * 2d地图v0版
 * @export
 * @interface IMAPFile2DV0
 * @extends {IMapFile}
 */
export interface IMAPFile2DV0 extends IMapFile {
  /**
   * 地图类型，必须是`2d`
   * @type {'2d'}
   * @memberof IMAPFile2DV0
   */
  type: '2d';
  /**
   * 地图版本，必须是`0`
   * @type {'0'}
   * @memberof IMAPFile2DV0
   */
  version: '0';
  /**
   * 二维地图数据，包含方块ID
   * @type {number[][]}
   * @memberof IMAPFile2DV0
   */
  data: number[][];
}

/**
 * 导出序列化地图v0版
 * @export
 * @interface IMAPFileOutV0
 * @extends {IMapFile}
 */
export interface IMAPFileOutV0 extends IMapFile {
  /**
   * 地图类型，必须是`out`
   * @type {'out'}
   * @memberof IMAPFileOutV0
   */
  type: 'out';
  /**
   * 地图版本，必须是`0`
   * @type {'0'}
   * @memberof IMAPFileOutV0
   */
  version: '0';
  /**
   * 地图大小，分别代表X,Y,Z
   * @type {[number, number, number]}
   * @memberof IMAPFileOutV0
   */
  size: [number, number, number];
  /**
   * 压缩后的地图字符串
   * @type {string}
   * @memberof IMAPFileOutV0
   */
  blocks: string;
  /**
   * 地图字符串的方块类型映射
   * @type {Record<string, BlockType>}
   * @memberof IMAPFileOutV0
   */
  blockTypes: Record<string, BlockType>;
  /**
   * 实体列表，分别代表实体类型，X,Y,Z和元数据
   * @type {[number, number, number, number, Record<string, unknown>]}
   * @memberof IMAPFileOutV0
   */
  entityList: [number, number, number, number, Record<string, unknown>][];
  /**
   * 地图元数据
   * @type {Record<string, unknown>}
   * @memberof IMAPFileOutV0
   */
  meta: Record<string, unknown>;
}

import {
  BrickAction,
  BrickDesignStateType,
  ConfigType,
  BrickdStoreType,
} from '../types';

let DRAG_SORT_CACHE: string[] | null = null;

export const setDragSortCache = (dragSort?: string[] | null) =>
  (DRAG_SORT_CACHE = dragSort);
export const getDragSortCache = () => DRAG_SORT_CACHE;

export type WarnType = (msg: string) => void;
let WARN: WarnType | null = null;

export const getWarn = () => WARN;
export const setWarn = (warn: WarnType | null) => (WARN = warn);

let STORE: BrickdStoreType<BrickDesignStateType, BrickAction> | null = null;
export const setStore = (
  store: BrickdStoreType<BrickDesignStateType, BrickAction> | null,
) => (STORE = store);
export const getStore = () => STORE;

let BRICKD_CONFIG: ConfigType | null = null;
export const getBrickdConfig = () => BRICKD_CONFIG;
export const setBrickdConfig = (config: ConfigType | null) =>
  (BRICKD_CONFIG = config);

export const cleanStateCache = () => {
  setBrickdConfig(null);
  setWarn(null);
  setStore(null);
  setDragSortCache(null);
};

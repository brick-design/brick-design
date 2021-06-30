import {
  BrickAction,
  BrickDesignStateType,
  ConfigType,
  BrickdStoreType, DragSourceType, DropTargetType, StateType,
} from '../types';
import { generateNewKey, getNewKey, ROOT } from './index';

/**
 * 拖拽排序 缓存
 */
let DRAG_SORT_CACHE: string[] | null = null;

export const setDragSortCache = (dragSort?: string[] | null) =>
  (DRAG_SORT_CACHE = dragSort);
export const getDragSortCache = () => DRAG_SORT_CACHE;

/**
 * 警告回调函数 缓存
 */
export type WarnType = (msg: string) => void;
let WARN: WarnType | null = null;

export const getWarn = () => WARN;
export const setWarn = (warn: WarnType | null) => (WARN = warn);

/**
 * store 缓存
 */
let STORE: BrickdStoreType<BrickDesignStateType, BrickAction> | null = null;
export const setStore = (
  store: BrickdStoreType<BrickDesignStateType, BrickAction> | null,
) => (STORE = store);
export const getStore = () => STORE;

/**
 * 全局配置缓存
 */
let BRICKD_CONFIG: ConfigType | null = null;
export const getBrickdConfig = () => BRICKD_CONFIG;
export const setBrickdConfig = (config: ConfigType | null) =>
  (BRICKD_CONFIG = config);

/**
 * 拖拽源 缓存
 */
export type DragSourcePayload = Partial<DragSourceType> & {
  componentName?: string;
  defaultProps?: any;
};
let DRAG_SOURCE: DragSourceType | null=null;
export const getDragSource = () => DRAG_SOURCE;
export const setDragSource = (dragSource: DragSourcePayload | null) => {
  if(!dragSource) return DRAG_SOURCE=dragSource;
  const RootState=STORE.getState();
  const { layerName } = RootState;
  if(!layerName) return;
  let { template, dragKey } = dragSource;
  const { componentName, defaultProps, parentKey, parentPropName } = dragSource;
  /**
   * componentName有值说明为新添加的组件，为其生成vDom
   */
  dragKey = dragKey || ROOT;
  if (componentName) {
    template = {
      [ROOT]: {
        componentName: componentName,
        props: defaultProps,
      },
    };
  }

  const { pageConfig } = RootState[layerName] as StateType;

  /**
   * 如果componentConfigs有根节点并且vDOMCollection有值，就将vDOMCollection中的
   * vDom合并到componentConfigs，为实时拖拽预览做准备
   */
  if (pageConfig[ROOT] && template) {
    const newKey = getNewKey(pageConfig);
    dragKey = `${newKey}`;
    template = generateNewKey(template, newKey);
  }

  DRAG_SOURCE = {
    template,
    dragKey,
    parentKey,
    parentPropName
  };
};
/**
 * 拖放目标 缓存
 */
let DROP_TARGET: null | DropTargetType=null;
export const getDropTarget = () => DROP_TARGET;
export const setDropTarget = (dropTarget: null | DropTargetType) =>DROP_TARGET=dropTarget;


export const cleanStateCache = () => {
  setBrickdConfig(null);
  setWarn(null);
  setStore(null);
  setDragSortCache(null);
  setDropTarget(null);
  setDragSource(null);
};

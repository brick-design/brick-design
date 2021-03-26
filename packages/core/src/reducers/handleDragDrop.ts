import produce from 'immer';
import { isEqual } from 'lodash';
import { generateNewKey, getNewKey, ROOT } from '../utils';
import { DropTargetType, StateType } from '../types';
import { DragSourcePayload } from '../actions';

/**
 * 获取拖拽组件数据
 * @param state
 * @param payload
 * @returns {{dragSource: *}}
 */
export function getDragSource(
  state: StateType,
  payload: DragSourcePayload,
): StateType {
  // eslint-disable-next-line prefer-const
  let { pageConfig, undo } = state;
  // eslint-disable-next-line prefer-const
  let { vDOMCollection, dragKey } = payload;
  const { componentName, defaultProps, parentKey, parentPropName } = payload;
  /**
   * componentName有值说明为新添加的组件，为其生成vDom
   */
  dragKey = dragKey || ROOT;
  if (componentName) {
    vDOMCollection = {
      [ROOT]: {
        componentName: componentName,
        props: defaultProps,
      },
    };
  }

  /**
   * 如果componentConfigs有根节点并且vDOMCollection有值，就将vDOMCollection中的
   * vDom合并到componentConfigs，为实时拖拽预览做准备
   */
  if (pageConfig[ROOT] && vDOMCollection) {
    undo.push({ pageConfig });
    const newKey = getNewKey(pageConfig);
    dragKey = `${newKey}`;
    const newVDOMCollection = generateNewKey(vDOMCollection, newKey);
    pageConfig = produce(pageConfig, (oldConfigs) => {
      //为虚拟dom集合生成新的key与引用，防止多次添加同一模板造成vDom顶替
      Object.assign(oldConfigs, newVDOMCollection);
    });
  }
  return {
    ...state,
    dragSource: {
      vDOMCollection,
      dragKey,
      parentKey,
      parentPropName,
    },
    pageConfig,
    undo,
  };
}

/**
 * 获取放置组件的容器组件信息
 * @param state
 * @param payload
 */
export function getDropTarget(
  state: StateType,
  payload: DropTargetType,
): StateType {
  /**
   * 如果location为undefined说明当前组件不是容器组件
   * 清除dropTarget信息
   */
  const { dropTarget } = state;
  if (isEqual(payload, dropTarget)) return state;
  return {
    ...state,
    dropTarget: payload,
  };
}

export function clearDropTarget(state: StateType): StateType {
  const { dropTarget } = state;

  if (dropTarget) {
    return {
      ...state,
      dropTarget: null,
      hoverKey: null,
    };
  }

  return state;
}

export function clearDragSource(state: StateType) {
  const { dragSource } = state;
  if (dragSource) return { ...state, dragSource: null,dragSort:null };
  return state;
}

export function getDragSort(state: StateType,payload:string[]){
return {
  ...state,
  dragSort:payload
};
}

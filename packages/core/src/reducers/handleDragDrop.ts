import { generateVDOM, getNewDOMCollection } from '../utils';
import { DropTargetType, StateType } from '../types';
import { DragSourcePayload } from '../actions';
import produce from 'immer';
import uuid from 'uuid';


/**
 * 获取拖拽组件数据
 * @param state
 * @param payload
 * @returns {{dragSource: *}}
 */
export function getDragSource(state: StateType, payload: DragSourcePayload):StateType {
  // eslint-disable-next-line prefer-const
  let { componentConfigs, undo, propsConfigSheet } = state;
  // eslint-disable-next-line prefer-const
  let { componentName, defaultProps, vDOMCollection, propsConfigCollection, dragKey, parentKey, parentPropName } = payload;
  if (componentName) {
    vDOMCollection = generateVDOM(componentName, defaultProps);
  }
  if (componentConfigs.root && vDOMCollection) {
    undo.push({ componentConfigs, propsConfigSheet });
    dragKey = uuid();
    const { newPropsConfigCollection, newVDOMCollection } = getNewDOMCollection({
      vDOMCollection,
      propsConfigCollection,
    }, dragKey);
    componentConfigs = produce(componentConfigs, oldConfigs => {
      //为虚拟dom集合生成新的key与引用，防止多次添加同一模板造成vDom顶替
      Object.assign(oldConfigs, newVDOMCollection);
    });
    propsConfigSheet = produce(propsConfigSheet, oldPropsConfig => {
      Object.assign(oldPropsConfig, newPropsConfigCollection);
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
    componentConfigs,
    propsConfigSheet,
    undo,
  };
}

/**
 * 获取放置组件的容器组件信息
 * @param state
 * @param payload
 */
export function getDropTarget(state: StateType, payload: DropTargetType): StateType {
  /**
   * 如果location为undefined说明当前组件不是容器组件
   * 清除dropTarget信息
   */
  const { selectedInfo } = state;
  if (selectedInfo) return state;
  const { selectedKey } = payload;
  return {
    ...state,
    dropTarget: payload,
    hoverKey: selectedKey,
  };
}

export function clearDropTarget(state: StateType): StateType {
  return {
    ...state,
    dropTarget: null,
    hoverKey: null,
  };
}

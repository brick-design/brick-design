import { generateNewKey, getNewKey, ROOT } from '../utils';
import { DropTargetType, StateType } from '../types';
import { DragSourcePayload } from '../actions';
import produce from 'immer';


/**
 * 获取拖拽组件数据
 * @param state
 * @param payload
 * @returns {{dragSource: *}}
 */
export function getDragSource(state: StateType, payload: DragSourcePayload): StateType {
  // eslint-disable-next-line prefer-const
  let { componentConfigs, undo, propsConfigSheet } = state;
  // eslint-disable-next-line prefer-const
  let { componentName, defaultProps, vDOMCollection, propsConfigCollection, dragKey, parentKey, parentPropName } = payload;
  /**
   * componentName有值说明为新添加的组件，为其生成vDom
   */
  dragKey=dragKey||ROOT
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
  if (componentConfigs[ROOT] && vDOMCollection) {
    undo.push({ componentConfigs, propsConfigSheet });
    const newKey=getNewKey(componentConfigs)
    dragKey = `${newKey}`;
    const { newPropsConfigCollection, newVDOMCollection } = generateNewKey({
      vDOMCollection,
      propsConfigCollection,
    }, newKey);
    componentConfigs = produce(componentConfigs, oldConfigs => {
      //为虚拟dom集合生成新的key与引用，防止多次添加同一模板造成vDom顶替
      Object.assign(oldConfigs, newVDOMCollection);
    });
    propsConfigSheet = produce(propsConfigSheet, oldPropsConfig => {
      if(newPropsConfigCollection){
        Object.assign(oldPropsConfig, newPropsConfigCollection);

      }
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
  const { selectedInfo,dropTarget } = state;
  const { selectedKey,domTreeKeys } = payload;
  let dropTargetResult=payload
  if (selectedInfo)  {
    const {selectedKey,propName}=selectedInfo
    if(domTreeKeys.includes(selectedKey)&&!dropTarget){
      dropTargetResult={selectedKey,propName,domTreeKeys}
    }else {
      return state
    }
  }
  return {
    ...state,
    dropTarget:dropTargetResult,
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

export function clearDragSource(state:StateType) {
  const {dragSource}=state
  if(dragSource)return{...state,dragSource:null}
  return state
}

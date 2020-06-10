import { StateType } from '../types';
import { copyConfig, deleteChildNodes, deleteChildNodesKey, getLocation, HandleInfoType } from '../utils';
import get from 'lodash/get';
import update from 'lodash/update';
import { produce } from 'immer';
import uuid from 'uuid';
import { LayoutSortPayload } from '../actions';
import { LEGO_BRIDGE } from '../store';

/**
 * 往画板或者容器组件添加组件
 * @param state
 * @returns {{componentConfigs: *}}
 */
export function addComponent(state: StateType): StateType {
  const {
    undo, redo,
    componentConfigs,
    selectedInfo,
    dragSource,
    dropTarget,
  } = state;
  /**
   * 如果没有拖拽的组件不做添加动作, 如果没有
   */
  const { selectedKey, propName, domTreeKeys } = selectedInfo || dropTarget || {};
  if (!dragSource) return state;
  const { vDOMCollection, dragKey, parentKey, parentPropName } = dragSource;

  if (componentConfigs.root && !selectedKey){
    if(vDOMCollection){
      return { ...state, ...(undo.pop()), dragSource: null };
    }else {
      return {...state,dragSource:null}
    }
  }

  /**
   * 当拖拽的父key与drop目标key一致说明未移动
   * 当拖拽的key包含在drop目标的domTreeKeys,说明拖拽组件是目标组件的父组件或者是自身
   */
  if (parentKey && parentKey === selectedKey || domTreeKeys && domTreeKeys.includes(dragKey!)) return {...state,dragSource:null};

  if (!componentConfigs.root) {
    undo.push({ componentConfigs });
    redo.length = 0;
    return {
      ...state,
      componentConfigs: vDOMCollection!,
      dragSource: null,
      undo,
      redo,
    };
  }

  /**
   * 获取当前拖拽组件的父组件约束，以及属性节点配置信息
   */
  const dragComponentName = get(componentConfigs[dragKey!], 'componentName');
  const dropComponentName = get(componentConfigs[selectedKey!], 'componentName');
  const { fatherNodesRule } = get(LEGO_BRIDGE.config!.AllComponentConfigs, dragComponentName);
  const { nodePropsConfig, childNodesRule } = get(LEGO_BRIDGE.config!.AllComponentConfigs, dropComponentName);

  /**
   * 子组件约束限制，减少不必要的组件错误嵌套
   */
  const childRules = propName ? nodePropsConfig![propName].childNodesRule : childNodesRule;
  if (childRules) {
    if (!childRules.includes(dragComponentName)) {
      const msg = `${propName || dropComponentName}:只允许拖拽${childRules.toString()}组件`;
      if (LEGO_BRIDGE.errorCallback) {
        LEGO_BRIDGE.errorCallback(msg);
        return state;
      } else {
        throw new Error(msg);

      }
    }
  }
  /**
   * 父组件约束限制，减少不必要的组件错误嵌套
   */
  if (fatherNodesRule && !fatherNodesRule.includes(propName ? `${dropComponentName}.${propName}` : `${dropComponentName}`)) {
    const msg = `${dragComponentName}:只允许放入${fatherNodesRule.toString()}组件或者属性中`;
    if (LEGO_BRIDGE.errorCallback) {
      LEGO_BRIDGE.errorCallback(msg);
      return state;
    } else {
      throw new Error(msg);
    }
  }

  undo.push({ componentConfigs });
  redo.length = 0;
  return {
    ...state,
    componentConfigs: produce(componentConfigs, oldConfigs => {
      //添加新组件到指定容器中
      update(oldConfigs, getLocation(selectedKey!, propName), childNodes => {
        return childNodes?[...childNodes, dragKey]:[dragKey];
      });
      //如果有父key说明是跨组件的拖拽，原先的父容器需要删除该组件的引用
      if (parentKey) {
        update(oldConfigs, getLocation(parentKey), childNodes => deleteChildNodesKey(childNodes,dragKey!,parentPropName));
      }
    }),
    dragSource: null,
    dropTarget: null,
    undo,
    redo,
  };
}

/**
 * 复制组件
 * @param state
 * @returns {{componentConfigs: *}}
 */
export function copyComponent(state: StateType): StateType {
  const { undo, redo, componentConfigs, selectedInfo, propsConfigSheet } = state;
  /**
   * 未选中组件不做任何操作
   */
  if (!selectedInfo || selectedInfo.selectedKey === 'root') {
    return state;
  }
  const { selectedKey, parentPropName, parentKey } = selectedInfo;
  undo.push({ componentConfigs, propsConfigSheet });
  const handleState: HandleInfoType = { componentConfigs, propsConfigSheet };
  redo.length = 0;
  const newKey = uuid();
  return {
    ...state,
    ...produce<HandleInfoType>(handleState, oldState => {
      update(oldState.componentConfigs, getLocation(parentKey!, parentPropName), childNodes => [...childNodes, newKey]);
      copyConfig(oldState, selectedKey, newKey);
    }),
    undo,
    redo,
  };
}

/**
 * 当domTree中拖拽节点调整顺序时触发
 * @param state
 * @param payload
 * @returns {{componentConfigs: *}}
 */
export function onLayoutSortChange(state: StateType, payload: LayoutSortPayload) {
  const { sortKeys, parentKey, parentPropName, dragInfo } = payload;
  const { undo, redo, componentConfigs } = state;
  undo.push({ componentConfigs });
  redo.length = 0;
  return {
    ...state,
    componentConfigs: produce(componentConfigs, oldConfigs => {
      update(oldConfigs, getLocation(parentKey, parentPropName), () => sortKeys);
      if (dragInfo) {
        const { key, parentKey, parentPropName } = dragInfo;
        update(oldConfigs, getLocation(parentKey), (childNodes) => deleteChildNodesKey(childNodes,key,parentPropName));
      }
    }),
    undo,
    redo,
  } as StateType;
}

/**
 * 删除组件
 * @param state
 * @returns {{propsSetting: *, componentConfigs: *, selectedInfo: *}}
 */
export function deleteComponent(state: StateType): StateType {
  const { undo, redo, componentConfigs, selectedInfo, propsConfigSheet } = state;
  /**
   * 未选中组件将不做任何操作
   */
  if (!selectedInfo) {
    return state;
  }
  const { selectedKey, parentKey, parentPropName } = selectedInfo;
  undo.push({ componentConfigs, selectedInfo, propsConfigSheet });
  const handleState: HandleInfoType = { componentConfigs, propsConfigSheet };

  redo.length = 0;
  return {
    ...state,
    ...produce(handleState, oldState => {
      if (selectedKey === 'root') {
        oldState.componentConfigs = {};
        oldState.propsConfigSheet = {};
      } else {
        update(oldState.componentConfigs, getLocation(parentKey), childNodes => deleteChildNodesKey(childNodes,selectedKey,parentPropName));
        const childNodes = oldState.componentConfigs[selectedKey].childNodes;
        if (childNodes) {
          deleteChildNodes(oldState, childNodes);
        }
        delete oldState.componentConfigs[selectedKey];
        delete oldState.propsConfigSheet[selectedKey];
      }
    }),
    selectedInfo: null,
    undo,
    redo,
  };
}

/**
 * 清除所有子节点
 * @param state
 * @returns {{undo: *, componentConfigs, redo: *}}
 */

export function clearChildNodes(state: StateType): StateType {
  const { componentConfigs, selectedInfo, undo, redo, propsConfigSheet } = state;
  if (!selectedInfo) {
    //todo
    return state;
  }
  const { selectedKey, propName } = selectedInfo;
  undo.push({ componentConfigs, propsConfigSheet });
  const handleState: HandleInfoType = { componentConfigs, propsConfigSheet };

  redo.length = 0;
  return {
    ...state,
    ...produce(handleState, oldState => {
      const childNodes=get(oldState.componentConfigs,getLocation(selectedKey))
      if(childNodes){
        deleteChildNodes(oldState, childNodes,propName);
        update(oldState.componentConfigs, getLocation(selectedKey), (childNodes) => {
          if(Array.isArray(childNodes)||!propName){
            return undefined
          }else {
            delete childNodes[propName]
            return Object.keys(childNodes).length===0?undefined:childNodes
          }
        });
      }
    }),
    undo,
    redo,
  };
}


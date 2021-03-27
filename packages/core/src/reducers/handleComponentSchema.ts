import { get, update,isEqual} from 'lodash';
import { produce } from 'immer';
import { StateType } from '../types';
import {
  copyConfig,
  deleteChildNodes,
  deleteChildNodesKey,
  getLocation,
  getNewKey,
  handleRules,
  restObject,
  ROOT,
  warn,
} from '../utils';
import { LayoutSortPayload } from '../actions';

/**
 * 往画板或者容器组件添加组件
 * @param state
 * @returns {{pageConfig: *}}
 */
export function addComponent(state: StateType): StateType {
  const { undo, redo, pageConfig, dragSource, dropTarget,dragSort } = state;
  /**
   * 如果没有拖拽的组件不做添加动作, 如果没有
   */
  if (!dragSource || (!dropTarget && pageConfig[ROOT]))
    return { ...state, dragSource: null,dragSort:null };
  const { vDOMCollection, dragKey, parentKey, parentPropName } = dragSource;
  /**
   * 如果没有root根节点，新添加的组件添加到root
   */
  if (!pageConfig[ROOT]) {
    undo.push({ pageConfig });
    redo.length = 0;
    return {
      ...state,
      pageConfig: vDOMCollection!,
      dragSource: null,
      dropTarget: null,
      dragSort:null,
      undo,
      redo,
    };
  }
  // eslint-disable-next-line prefer-const
  let { selectedKey, propName,childNodeKeys } = dropTarget;
  /**
   * 如果有root根节点，并且即没有选中的容器组件也没有drop的目标，那么就要回退到drag目标，
   * 添加之前的页面配置
   */
  if (!selectedKey) {
    /**
     * 如果有parentKey说明是拖拽的是新添加的组件，
     * 返回原先的state状态
     */
    if (!parentKey) {
      return { ...state, ...undo.pop(), dragSource: null,dragSort:null };
    } else {
      return { ...state, dragSource: null,dragSort:null };
    }
  }

  if (!dragSort||
    parentKey===selectedKey&&isEqual(childNodeKeys,dragSort)||
    handleRules(pageConfig, dragKey!, selectedKey, propName)
  ) {
    return { ...state, dragSource: null, dropTarget: null ,dragSort:null};
  }

  parentKey && undo.push({ pageConfig });
  redo.length = 0;
  return {
    ...state,
    pageConfig: produce(pageConfig, (oldConfigs) => {
      //添加新组件到指定容器中
      update(oldConfigs, getLocation(selectedKey!, propName), () => dragSort);
      //如果有父key说明是跨组件的拖拽，原先的父容器需要删除该组件的引用
      if (parentKey&&(parentKey!==selectedKey||parentPropName!==propName)) {
        update(oldConfigs, getLocation(parentKey), (childNodes) =>
          deleteChildNodesKey(childNodes, dragKey!, parentPropName),
        );
      }
    }),
    dragSource: null,
    dropTarget: null,
    dragSort:null,
    undo,
    redo,
  };
}

/**
 * 复制组件
 * @param state
 * @returns {{pageConfig: *}}
 */
export function copyComponent(state: StateType): StateType {
  const { undo, redo, pageConfig, selectedInfo } = state;
  /**
   * 未选中组件不做任何操作
   */
  if (!selectedInfo) {
    warn('Please select the node you want to copy');
    return state;
  }
  if (selectedInfo.selectedKey === ROOT) {
    warn('Prohibit copying root node');
    return state;
  }
  const { selectedKey, parentPropName, parentKey } = selectedInfo;
  undo.push({ pageConfig });
  redo.length = 0;
  const newKey = getNewKey(pageConfig);
  return {
    ...state,
    pageConfig: produce(pageConfig, (oldState) => {
      update(
        oldState,
        getLocation(parentKey!, parentPropName),
        (childNodes) => [...childNodes, `${newKey}`],
      );
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
 * @returns {{pageConfig: *}}
 */
export function onLayoutSortChange(
  state: StateType,
  payload: LayoutSortPayload,
): StateType {
  const { sortKeys, parentKey, parentPropName, dragInfo } = payload;
  const { undo, redo, pageConfig } = state;
  undo.push({ pageConfig });
  redo.length = 0;
  return {
    ...state,
    pageConfig: produce(pageConfig, (oldConfigs) => {
      update(
        oldConfigs,
        getLocation(parentKey, parentPropName),
        () => sortKeys,
      );
      /**
       * dragInfo有值说明为跨组件排序，需要删除拖拽组件原先父组件中的引用
       */
      if (
        dragInfo &&
        (dragInfo.parentKey !== parentKey ||
          dragInfo.parentPropName !== parentPropName)
      ) {
        const { key, parentKey, parentPropName } = dragInfo;
        update(oldConfigs, getLocation(parentKey), (childNodes) =>
          deleteChildNodesKey(childNodes, key, parentPropName),
        );
      }
    }),
    undo,
    redo,
  };
}

/**
 * 删除组件
 * @param state
 * @returns {{propsSetting: *, pageConfig: *, selectedInfo: *}}
 */
export function deleteComponent(state: StateType): StateType {
  const { undo, redo, pageConfig, selectedInfo } = state;
  /**
   * 未选中组件将不做任何操作
   */
  if (!selectedInfo) {
    warn('Please select the components you want to delete');
    return state;
  }
  const { selectedKey, parentKey, parentPropName } = selectedInfo;
  undo.push({ pageConfig, selectedInfo });

  redo.length = 0;
  return {
    ...state,
    pageConfig: produce(pageConfig, (oldState) => {
      /**
       * 如果选中的是根节点说明要删除整个页面
       */
      if (selectedKey === ROOT) {
        return {};
      } else {
        // 删除选中组件在其父组件中的引用
        update(oldState, getLocation(parentKey), (childNodes) =>
          deleteChildNodesKey(childNodes, selectedKey, parentPropName),
        );
        const childNodes = oldState[selectedKey].childNodes;
        /**
         * 如果childNodes有值，就遍历childNodes删除其中的子节点
         */
        if (childNodes) {
          deleteChildNodes(oldState, childNodes);
        }
        delete oldState[selectedKey];
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
 * @returns {{undo: *, pageConfig, redo: *}}
 */

export function clearChildNodes(state: StateType): StateType {
  const { pageConfig, selectedInfo, undo, redo } = state;
  if (!selectedInfo) {
    warn(
      'Please select the component or property you want to clear the child nodes',
    );
    return state;
  }
  const { selectedKey, propName } = selectedInfo;
  const childNodes = get(pageConfig, getLocation(selectedKey));
  if (!childNodes) return state;
  undo.push({ pageConfig });

  redo.length = 0;
  return {
    ...state,
    pageConfig: produce(pageConfig, (oldState) => {
      deleteChildNodes(oldState, childNodes, propName);
      update(oldState, getLocation(selectedKey), (childNodes) => {
        /**
         * 如果 没有propName说明要清除组件的所有子节点
         */
        if (!propName) {
          return undefined;
        } else {
          return restObject(childNodes, propName);
        }
      });
    }),
    undo,
    redo,
  };
}

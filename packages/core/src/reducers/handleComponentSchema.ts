import { get, update, isEqual } from 'lodash';
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
import { LayoutSortPayload, OperatePayload } from '../actions';
import { getDragSortCache, getDragSource, getDropTarget, setDragSource, setDropTarget } from '../utils/caches';

/**
 * 往画板或者容器组件添加组件
 * @param state
 * @returns {{pageConfig: *}}
 */
export function addComponent(state: StateType): StateType {
  const { undo, redo, pageConfig } = state;
  /**
   * 如果没有拖拽的组件不做添加动作, 如果没有
   */
  const dragSource=getDragSource(), dropTarget=getDropTarget();
  if (!dragSource || (!dropTarget && pageConfig[ROOT])) {
    return state;
  }

  const { template, dragKey, parentKey, parentPropName,style } = dragSource;
  setDragSource(null);
  /**
   * 如果没有root根节点，新添加的组件添加到root
   */
  if (!pageConfig[ROOT]) {
    undo.push({ pageConfig });
    redo.length = 0;
    return {
      ...state,
      pageConfig: template,
      undo,
      redo,
    };
  }
  // eslint-disable-next-line prefer-const
  let { dropKey, propName, childNodeKeys } = dropTarget;
  setDropTarget(null);
  /**
   * 如果有root根节点，并且即没有选中的容器组件也没有drop的目标，那么就要回退到drag目标，
   * 添加之前的页面配置
   */
  const dragSort=getDragSortCache();
  if (
    !dragSort ||
    (parentKey === dropKey && isEqual(childNodeKeys, dragSort)) ||
    handleRules(pageConfig)
  ) {
    return state;
  }
  parentKey && undo.push({ pageConfig });
  redo.length = 0;
  return {
    ...state,
    pageConfig: produce(pageConfig, (oldConfigs) => {
      //添加新组件到指定容器中
      if(style){
        let node;
        if(template){
          node=template[dragKey];
        }else {
          node=oldConfigs[dragKey];
        }
        update(node,'props.style',(oldStyle={})=>{
          return {...oldStyle,...style};
        });
      }
      template&&Object.assign(oldConfigs, template);
      update(oldConfigs, getLocation(dropKey!, propName), () => dragSort);
      //如果有父key说明是跨组件的拖拽，原先的父容器需要删除该组件的引用
      if (
        parentKey &&
        (parentKey !== dropKey || parentPropName !== propName)
      ) {
        update(oldConfigs, getLocation(parentKey), (childNodes) =>
          deleteChildNodesKey(childNodes, dragKey!, parentPropName),
        );
      }
    }),
    undo,
    redo,
  };
}

/**
 * 复制组件
 * @param state
 * @returns {{pageConfig: *}}
 */
export function copyComponent(state: StateType,payload:OperatePayload): StateType {
  const { undo, redo, pageConfig, selectedInfo } = state;
  const {key}=payload;

  /**
   * 未选中组件不做任何操作
   */
  if (!selectedInfo&&!key) {
    warn('Please select the node you want to copy');
    return state;
  }
  if (get(selectedInfo,'selectedKey') === ROOT||key===ROOT) {
    warn('Prohibit copying root node');
    return state;
  }
  const { selectedKey, parentPropName, parentKey } = selectedInfo||{};
  undo.push({ pageConfig });
  redo.length = 0;
  const newKey = getNewKey(pageConfig);
  return {
    ...state,
    pageConfig: produce(pageConfig, (oldState) => {
      update(
        oldState,
        getLocation(parentKey!||payload.parentKey, parentPropName||payload.parentPropName),
        (childNodes) => [...childNodes, `${newKey}`],
      );
      copyConfig(oldState, selectedKey||key, newKey);
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
export function deleteComponent(state: StateType,payload:OperatePayload): StateType {
  const {key}=payload;
  const { undo, redo, pageConfig, selectedInfo } = state;
  /**
   * 未选中组件将不做任何操作
   */
  if (!selectedInfo&&!key) {
    warn('Please select the components you want to delete');
    return state;
  }
  const { selectedKey, parentKey, parentPropName } = selectedInfo||{};
  undo.push({ pageConfig, selectedInfo });

  redo.length = 0;
  return {
    ...state,
    pageConfig: produce(pageConfig, (oldState) => {
      /**
       * 如果选中的是根节点说明要删除整个页面
       */
      if (selectedKey === ROOT||key===ROOT) {
        return {};
      } else {
        // 删除选中组件在其父组件中的引用
        update(oldState, getLocation(parentKey||payload.parentKey), (childNodes) =>
          deleteChildNodesKey(childNodes, selectedKey, parentPropName||payload.parentPropName),
        );
        const childNodes = oldState[selectedKey||key].childNodes;
        /**
         * 如果childNodes有值，就遍历childNodes删除其中的子节点
         */
        if (childNodes) {
          deleteChildNodes(oldState, childNodes);
        }
        delete oldState[selectedKey||key];
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

export function clearChildNodes(state: StateType,payload:OperatePayload): StateType {
  const { pageConfig, selectedInfo, undo, redo } = state;
  const {key}=payload;
  if (!selectedInfo||!key) {
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

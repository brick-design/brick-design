import { StateType } from '../types';
import { SelectComponentPayload } from '../actions';
import { getComponentConfig, handleRequiredHasChild } from '../utils';

/**
 * 选中组件
 * @param state
 * @param payload
 * @returns {{ undo: *, propsSetting: {propsConfig, mergePropsConfig, addPropsConfig: *, props: *}, redo: *, selectedInfo: {selectedKey: *, location: *, domTreeKeys: *[], fatherLocation: *, isContainer: boolean, style: *, componentName: *, nodePropsConfig}}}
 */

export function selectComponent(
  state: StateType,
  payload: SelectComponentPayload,
): StateType {
  const { undo, redo, selectedInfo, pageConfig } = state;
  const { propName, domTreeKeys, key, parentKey, parentPropName } = payload;
  // if (selectedInfo) {
  //   const { selectedKey, propName: selectedPropName } = selectedInfo;
  //   if (
  //     (selectedKey === key && selectedPropName == propName) ||
  //     handleRequiredHasChild(selectedInfo, pageConfig)
  //   )
  //     return state;
  //   if (selectedKey === key) {
  //     if (propName && selectedPropName !== propName) {
  //       domTreeKeys.push(`${key}${propName}`);
  //       return {
  //         ...state,
  //         selectedInfo: {
  //           ...selectedInfo,
  //           propName,
  //           domTreeKeys,
  //         },
  //       };
  //     } else {
  //       return {
  //         ...state,
  //         selectedInfo: {
  //           ...selectedInfo,
  //           parentKey,
  //           parentPropName,
  //         },
  //       };
  //     }
  //   }
  // }

  propName && domTreeKeys.push(`${key}${propName}`);
  const { props, componentName } = pageConfig[key];
  const { propsConfig } = getComponentConfig(componentName);
  undo.push({ selectedInfo });
  redo.length = 0;
  return {
    ...state,
    selectedInfo: {
      selectedKey: key,
      propName,
      domTreeKeys,
      parentKey,
      parentPropName,
      props,
      propsConfig,
    },
    undo,
    redo,
  };
}

/**
 * 清除选中状态
 * @param state
 * @returns {{undo: *, propsSetting: {}, redo: *, selectedInfo: {}}}
 */
export function clearSelectedStatus(state: StateType) {
  const { selectedInfo, pageConfig, undo, redo } = state;
  if (!selectedInfo || handleRequiredHasChild(selectedInfo, pageConfig)) {
    return state;
  }
  undo.push({ selectedInfo });
  redo.length = 0;
  return {
    ...state,
    selectedInfo: null,
    undo,
    redo,
  };
}

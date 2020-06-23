import get from 'lodash/get';
import { merge } from 'lodash';
import { StateType } from '../types';
import { SelectComponentPayload } from '../actions';
import { LEGO_BRIDGE } from '../store';
import { getComponentConfig, handleRequiredHasChild } from '../utils';
import produce from 'immer';

/**
 * 选中组件
 * @param state
 * @param payload
 * @returns {{ undo: *, propsSetting: {propsConfig, mergePropsConfig, addPropsConfig: *, props: *}, redo: *, selectedInfo: {selectedKey: *, location: *, domTreeKeys: *[], fatherLocation: *, isContainer: boolean, style: *, componentName: *, nodePropsConfig}}}
 */

export function selectComponent(state: StateType, payload: SelectComponentPayload): StateType {
  const { undo, redo, selectedInfo, propsConfigSheet, componentConfigs } = state;
  const { propName, domTreeKeys, key, parentKey, parentPropName } = payload;
  if (selectedInfo) {
    const { selectedKey, propName: selectedPropName } = selectedInfo;
    if (selectedKey === key && selectedPropName == propName || handleRequiredHasChild(selectedInfo, componentConfigs)) return state;
    if (selectedKey === key) {
      if (propName && selectedPropName !== propName) {
        domTreeKeys.push(`${key}${propName}`);
        return {
          ...state,
          selectedInfo: {
            ...selectedInfo,
            propName,
            domTreeKeys,
          },
        };
      } else {
        return {
          ...state,
          selectedInfo: {
            ...selectedInfo,
            parentKey,
            parentPropName,
          },

        };
      }

    }
  }

  propName && domTreeKeys.push(`${key}${propName}`);
  const { props, componentName } = componentConfigs[key];
  const { propsConfig } = getComponentConfig(componentName);
  undo.push({ selectedInfo });
  redo.length = 0;
  return {
    ...state,
    dropTarget: null,
    selectedInfo: {
      selectedKey: key,
      propName,
      domTreeKeys,
      parentKey,
      parentPropName,
      props,
      propsConfig: produce(propsConfig, oldPropsConfig => {
        merge(oldPropsConfig, propsConfigSheet[key]);
      }),
    },
    undo,
    redo,
    hoverKey: null,

  };
}

/**
 * 清除选中状态
 * @param state
 * @returns {{undo: *, propsSetting: {}, redo: *, selectedInfo: {}}}
 */
export function clearSelectedStatus(state: StateType) {
  const { selectedInfo, componentConfigs, undo, redo } = state;
  if (!selectedInfo || handleRequiredHasChild(selectedInfo, componentConfigs)) {
    return state;
  }
  undo.push({ selectedInfo });
  redo.length = 0;
  return {
    ...state,
    dropTarget: null,
    selectedInfo: null,
    undo,
    redo,
  };
}

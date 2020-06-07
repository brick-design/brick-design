import { isEmpty, merge, update } from 'lodash';
import { getAddPropsConfig, getFieldInPropsLocation } from '../utils';
import { PropsConfigType, StateType } from '../types';
import produce, { original } from 'immer';
import get from 'lodash/get';
import { LEGO_BRIDGE } from '../store';
import { AddPropsConfigPayload, ChangePropsPayload, DeletePropsConfigPayload } from '../actions';

/**
 * 添加属性配置
 * @param state
 * @param payload
 * @returns {{propsSetting: *}}
 */
export function addPropsConfig(state: StateType, payload: AddPropsConfigPayload): StateType {
  const { selectedInfo, undo, redo, propsConfigSheet } = state;
  if (!selectedInfo) return state;
  const { newPropField, fatherFieldLocation, childPropsConfig, propType } = payload;
  const { propsConfig, selectedKey } = selectedInfo;
  let isAdd = true;
  const addPropsConfig = getAddPropsConfig(propsConfigSheet, selectedKey);
  const newAddPropsConfig = produce(addPropsConfig, oldAddPropsConfig => {
    update(oldAddPropsConfig, fatherFieldLocation, (propsContent: any) => {
      // 对象数组 添加一个对象时的逻辑
      if (!newPropField) return childPropsConfig;
      if (!propsContent) propsContent = {};
      if (propsContent[newPropField]) {
        isAdd = false;
        //todo
      } else {
        propsContent[newPropField] = {
          type: propType,
          isAdd,
        };
      }
      return propsContent;
    });
  });
  if (!isAdd) return state;
  undo.push({ selectedInfo, propsConfigSheet });
  redo.length = 0;
  return {
    ...state,
    selectedInfo: {
      ...selectedInfo,
      propsConfig: produce(propsConfig, oldPropsConfig => {
        merge(oldPropsConfig, newAddPropsConfig);
      }),
    },
    propsConfigSheet: produce(propsConfigSheet, oldPropsConfigSheet => {
      oldPropsConfigSheet[selectedKey] = newAddPropsConfig;
    }),
    undo,
    redo,
  };
}

/**
 * 删除属性配置
 * @param state
 * @param payload
 * @returns {{propsSetting: *}}
 */
export function deletePropsConfig(state: StateType, payload: DeletePropsConfigPayload): StateType {
  const { selectedInfo, undo, redo, propsConfigSheet, componentConfigs } = state;
  if (!selectedInfo) return state;
  const { fatherFieldLocation, field } = payload;
  const { selectedKey } = selectedInfo;

  const fieldInPropsLocation = getFieldInPropsLocation(fatherFieldLocation);
  const addPropsConfig = getAddPropsConfig(propsConfigSheet, selectedKey);
  const newAddPropsConfig = produce(addPropsConfig, oldAddPropsConfig => {
    update(oldAddPropsConfig, fatherFieldLocation, prevPropsConfig => {
      delete prevPropsConfig[field];
      return prevPropsConfig;
    });

  });
  const { propsConfig } = get(LEGO_BRIDGE.config!.AllComponentConfigs, componentConfigs[selectedKey].componentName);
  undo.push({ selectedInfo, propsConfigSheet, componentConfigs });
  redo.length = 0;
  return {
    ...state,
    componentConfigs: produce(componentConfigs, oldConfig => {
      const paths=[selectedKey,'props',...fieldInPropsLocation]
      if (get(oldConfig,[...paths,field])) {
        update(oldConfig,paths, prevProps => {
          delete prevProps[field];
          return prevProps;
        });
      }
    }),
    propsConfigSheet: produce(propsConfigSheet, oldPropsConfigSheet => {
      oldPropsConfigSheet[selectedKey] = newAddPropsConfig;
    }),
    selectedInfo: {
      ...selectedInfo,
      propsConfig: produce(propsConfig, oldPropsConfig => {
        merge(oldPropsConfig, newAddPropsConfig);
      }),
    },
    undo,
    redo,
  };
}

/**
 * 提交属性
 * @param state
 * @param payload
 * @returns {{propsSetting: *, componentConfigs: *}}
 */
export function changeProps(state: StateType, payload: ChangePropsPayload): StateType {
  const { componentConfigs, selectedInfo, undo, redo } = state;
  if (!selectedInfo) return state;
  const { props } = payload;
  const { selectedKey } = selectedInfo;
  undo.push({ componentConfigs });
  redo.length = 0;
  return {
    ...state,
    componentConfigs: produce(componentConfigs!, oldConfigs => {
      const style = get(oldConfigs, [selectedKey, 'props', 'style']);
      if (style) {
        oldConfigs[selectedKey].props = { ...props, style };
      } else {
        oldConfigs[selectedKey].props = props;
      }
    }),
    undo,
    redo,
  };
}

/**
 * 重置属性
 * @param state
 */
export function resetProps(state: StateType): StateType {
  const { selectedInfo, componentConfigs, undo, redo } = state;
  if (!selectedInfo) return state;
  const { selectedKey, props } = selectedInfo;
  undo.push({ componentConfigs });
  redo.length = 0;
  return {
    ...state,
    componentConfigs: produce(componentConfigs, oldConfigs => {
      const style = get(oldConfigs, [selectedKey, 'props', 'style']);
      if (style) {
        oldConfigs[selectedKey].props = { ...props, style };
      } else {
        oldConfigs[selectedKey].props = props;
      }
    }),
    undo,
    redo,
  };

}



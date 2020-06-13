import { merge, update } from 'lodash';
import { getComponentConfig, getFieldInPropsLocation, restObject, warn } from '../utils';
import { PropsConfigSheetALL, StateType } from '../types';
import produce, { original } from 'immer';
import get from 'lodash/get';
import { AddPropsConfigPayload, ChangePropsPayload, DeletePropsConfigPayload } from '../actions';

/**
 * 添加属性配置
 * @param state
 * @param payload
 * @returns {{propsSetting: *}}
 */
export function addPropsConfig(state: StateType, payload: AddPropsConfigPayload): StateType {
  const { selectedInfo, undo, redo, propsConfigSheet,componentConfigs } = state;
  if (!selectedInfo) return state;
  const { newPropField, fatherFieldLocation, childPropsConfig, propType } = payload;
  const { selectedKey } = selectedInfo;
  let isAdd = true;
  let addPropsConfig:PropsConfigSheetALL = propsConfigSheet[selectedKey]||{};

    addPropsConfig = produce(addPropsConfig, oldAddPropsConfig => {
      const msg=`${newPropField}:This property already exists`
      const newPropFieldConfig={
        type: propType,
        isAdd,
      }
      if(fatherFieldLocation) {
        update(oldAddPropsConfig, fatherFieldLocation, (propsContent: any) => {
          // 对象数组 添加一个对象时的逻辑
          if (!newPropField) return childPropsConfig;
          if (!propsContent) propsContent = {};
          if (propsContent[newPropField]) {
            isAdd = false;
            warn(msg)
          } else {
            propsContent[newPropField] = newPropFieldConfig;
          }
          return propsContent;
        });
      }else if (oldAddPropsConfig[newPropField!]) {
        isAdd=false
        warn(msg);
      } else {
        oldAddPropsConfig[newPropField!] = newPropFieldConfig;
      }

    });

  if (!isAdd) return state;
  const {propsConfig}=getComponentConfig(componentConfigs[selectedKey].componentName)

  undo.push({ selectedInfo, propsConfigSheet });
  redo.length = 0;
  return {
    ...state,
    selectedInfo: {
      ...selectedInfo,
      propsConfig: produce(propsConfig, oldPropsConfig => {
        merge(oldPropsConfig, addPropsConfig);
      }),
    },
    propsConfigSheet: produce(propsConfigSheet, oldPropsConfigSheet => {
      oldPropsConfigSheet[selectedKey] = addPropsConfig;
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
  const addPropsConfig =propsConfigSheet[selectedKey];
  const newAddPropsConfig = produce(addPropsConfig, oldAddPropsConfig => {
    if(fatherFieldLocation){
      update(oldAddPropsConfig, fatherFieldLocation, prevPropsConfig => {
        return restObject(prevPropsConfig,field);
      });
    }else {
      return restObject(oldAddPropsConfig,field)
    }

  });
  const { propsConfig } = getComponentConfig(componentConfigs[selectedKey].componentName);
  undo.push({ selectedInfo, propsConfigSheet, componentConfigs });
  redo.length = 0;
  return {
    ...state,
    componentConfigs: produce(componentConfigs, oldConfig => {
      const fieldPath=fieldInPropsLocation[0]!==''?fieldInPropsLocation:[]
      const paths = [selectedKey, 'props',...fieldPath];
      if (get(oldConfig, [...paths, field])!==undefined) {
        update(oldConfig, paths, prevProps => {
          return restObject(prevProps,field);

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



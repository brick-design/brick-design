import {
  ChildNodesType,
  ComponentConfigsType,
  PropsConfigSheetType, PropsConfigType,
  PropsNodeType,
  SelectedInfoType,
  VirtualDOMType,
  PropsConfigSheetALL,
} from '../types';
import uuid from 'uuid';
import each from 'lodash/each';
import get from 'lodash/get';
// import flattenDeep from 'lodash/flattenDeep';
// import map from 'lodash/map';
import { LEGO_BRIDGE } from '../store';
import { SelectComponentPayload } from '../actions';

/**
 * 复制组件
 * @param componentConfigs
 * @param selectedKey
 * @param newKey
 */
export interface HandleInfoType {
  componentConfigs: ComponentConfigsType,
  propsConfigSheet: PropsConfigSheetType
}

export const copyConfig = (handleInfo: HandleInfoType, selectedKey: string, newKey: string) => {

  handleInfo.componentConfigs[newKey] = { ...handleInfo.componentConfigs[selectedKey] };
  handleInfo.propsConfigSheet[newKey] = selectedKey;
  const vDom = handleInfo.componentConfigs[newKey];
  const childNodes = vDom.childNodes;
  if (Array.isArray(childNodes)) {
    vDom.childNodes = copyChildNodes(handleInfo, childNodes);
  } else if (childNodes) {
    const newChildNodes: PropsNodeType = {};
    each((childNodes as PropsNodeType), (nodes, propName) => {
      newChildNodes[propName] = copyChildNodes(handleInfo, nodes);
    });
    vDom.childNodes = newChildNodes;
  }
};

function copyChildNodes(handleInfo: HandleInfoType, childNodes: string[]) {
  const newChildKeys = [];
  for (const oldKey of childNodes) {
    const newChildKey = uuid();
    newChildKeys.push(newChildKey);
    copyConfig(handleInfo, oldKey, newChildKey);
  }
  return newChildKeys;
}


export function deleteChildNodes(handleInfo: HandleInfoType, childNodes: ChildNodesType) {
  if (Array.isArray(childNodes)) {
    deleteArrChild(handleInfo, childNodes);
  } else {
    each(childNodes, (propChildNodes) => deleteArrChild(handleInfo, propChildNodes));
  }

}

function deleteArrChild(handleInfo: HandleInfoType, childNodes: string[]) {
  for (const key of childNodes) {
    const childNodesInfo = handleInfo.componentConfigs[key].childNodes;
    if (childNodesInfo) {
      deleteChildNodes(handleInfo, childNodesInfo);
    }

    delete handleInfo.componentConfigs[key];
    delete handleInfo.propsConfigSheet[key];
  }
}

/**
 * 获取路径
 * */
export function getLocation(key: string, propName?: string): string[] {
  const basePath = [key, 'childNodes'];
  return propName ? [...basePath, propName] : basePath;
}


export interface VDOMAndPropsConfigType {
  componentConfigs: ComponentConfigsType,
  propsConfigSheet: PropsConfigSheetType

}

export interface DragVDOMAndPropsConfigType {
  vDOMCollection: ComponentConfigsType,
  propsConfigCollection?: PropsConfigSheetType
}

/**
 *  生成新的Key
 * 防止模板出现重复key
 * @param vDOMAndPropsConfig
 * @param dragVDOMAndPropsConfig
 * @param rootKey
 */
export const getNewDOMCollection = (dragVDOMAndPropsConfig: DragVDOMAndPropsConfigType, rootKey: string) => {
  const { vDOMCollection, propsConfigCollection } = dragVDOMAndPropsConfig;
  const keyMap: { [key: string]: string } = {};
  const newVDOMCollection: ComponentConfigsType = {};
  const newPropsConfigCollection: PropsConfigSheetType = {};
  each(vDOMCollection, (vDom, key) => {
    let newKey = uuid();
    if (key === 'root') {
      newKey = rootKey;
    }
    keyMap[key] = newKey;
    newVDOMCollection[newKey]=vDom
  });

  each(newVDOMCollection, (vDom) => {
    const childNodes = vDom.childNodes;
    if (Array.isArray(childNodes)) {
      vDom.childNodes = childNodes.map((key) => keyMap[key]);
    } else if (childNodes) {
      const newChildNodes: PropsNodeType = {};
      each(childNodes, (nodes, propName) => {
        newChildNodes[propName] = nodes.map((key) => keyMap[key]);
      });
      vDom.childNodes = newChildNodes;
    }

  });
  each(propsConfigCollection,(v,k)=>{
    if(typeof v==='string'){
      newPropsConfigCollection[keyMap[k]]=keyMap[v]
    }else {
      newPropsConfigCollection[keyMap[k]]=v
    }
  })
  return {newVDOMCollection,newPropsConfigCollection};
};


/**
 * 获取字段在props中的位置
 * @param fieldConfigLocation
 * @returns {string}
 */
export const getFieldInPropsLocation = (fieldConfigLocation: string) => {
  return fieldConfigLocation.split('.').filter(location => location !== 'childPropsConfig');
};


/**
 * 处理子节点非空
 * @param selectedInfo
 * @param componentConfigs
 * @param payload
 */
export const handleRequiredHasChild = (selectedInfo: SelectedInfoType, componentConfigs: ComponentConfigsType) => {
  const { selectedKey, propName: selectedPropName } = selectedInfo;
  const { componentName, childNodes } = componentConfigs[selectedKey];
  const { nodePropsConfig,isRequired } = get(LEGO_BRIDGE.config!.AllComponentConfigs, componentName);
  return selectedPropName && nodePropsConfig![selectedPropName].isRequired &&
    get(childNodes,selectedPropName).length === 0||isRequired&&childNodes!.length===0;

};


export const generateVDOM = (componentName: string, defaultProps?: any) => {

  const vDOM: VirtualDOMType = {
    componentName: componentName,
    props: defaultProps,
  };
  if (LEGO_BRIDGE.containers!.includes(componentName)) {
    const { nodePropsConfig } = get(LEGO_BRIDGE.config!.AllComponentConfigs, componentName);
    vDOM.childNodes = [];
    // 是否为多属性节点
    if (nodePropsConfig) {
      const childNodes: PropsNodeType = {};
      each(nodePropsConfig, (nodePropConfig, propName) => {
        childNodes[propName] = [];
      });
      vDOM.childNodes = childNodes;
    }
  }
  return { root: vDOM };
};

/**
 * 用于获取组件名字数组
 * @param data
 * @returns {Array}
 */
export function flattenDeepArray(data: any) {
  return Object.keys(data).map((v) => {
    if (data[v] && data[v].components) return Object.keys(data[v].components).map((subK) => subK);
    return v;
  }).flat(Infinity) as string[];
}

export function shallowEqual(objA: any, objB: any) {
    for(const k of Object.keys(objA)){
     if(objA[k]!==objB[k]) return false
    }
  return true;
}

export function getAddPropsConfig(propsConfigSheet: PropsConfigSheetType, selectedKey: string): PropsConfigSheetALL {
  const addPropsConfig = propsConfigSheet[selectedKey];
  if (typeof addPropsConfig === 'string') {
    return getAddPropsConfig(propsConfigSheet, addPropsConfig);
  }
  return addPropsConfig || {};
}

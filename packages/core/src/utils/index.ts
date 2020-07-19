import {
  BrickAction,
  ChildNodesType,
  ComponentConfigsType,
  ComponentConfigTypes,
  PropsConfigSheetType,
  PropsNodeType,
  SelectedInfoType,
  StateType,
} from '../types';
import {each,get,isEmpty} from 'lodash';
import { LEGO_BRIDGE } from '../store';
import { ReducerType } from '../reducers';

/**
 * 根节点key
 */
export const ROOT='0'

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

export const copyConfig = (handleInfo: HandleInfoType, selectedKey: string, newKey: number) => {
  const { componentConfigs, propsConfigSheet } = handleInfo
  if (propsConfigSheet[selectedKey]) {
    propsConfigSheet[newKey] = propsConfigSheet[selectedKey];
  }
  const vDom = componentConfigs[selectedKey];
  const childNodes = vDom.childNodes
  if (!childNodes) {
    componentConfigs[newKey] = vDom
  } else {
    const newVDom = { ...vDom }
    componentConfigs[newKey] = newVDom
    if (Array.isArray(childNodes)) {
      newVDom.childNodes = copyChildNodes(handleInfo, childNodes);
    }else {
      const newChildNodes: PropsNodeType = {};
      each(childNodes, (nodes, propName) => {
        newChildNodes[propName] = copyChildNodes(handleInfo, nodes!);
      });
      newVDom.childNodes = newChildNodes;
    }
  }
}

function copyChildNodes(handleInfo: HandleInfoType, childNodes: string[]) {
  const {componentConfigs}=handleInfo
  const newChildKeys:string[] = [];
  for (const oldKey of childNodes) {
    const newChildKey = getNewKey(componentConfigs);
    newChildKeys.push(`${newChildKey}`);
    copyConfig(handleInfo, oldKey, newChildKey);
  }
  return newChildKeys;
}


export function deleteChildNodes(handleInfo: HandleInfoType, childNodes: ChildNodesType,propName?:string) {
  if (Array.isArray(childNodes)) {
    deleteArrChild(handleInfo, childNodes);
  } else{
    each(childNodes, (propChildNodes,key) => {
      if(propName){
        if(key===propName){
          deleteArrChild(handleInfo, propChildNodes!)
        }
      }else {
        deleteArrChild(handleInfo, propChildNodes!)
      }

    });
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

export interface DragVDomAndPropsConfigType {
  vDOMCollection: ComponentConfigsType,
  propsConfigCollection?: PropsConfigSheetType
}

/**
 * 生成新的Key
 * @param dragVDOMAndPropsConfig
 * @param rootKey
 */
export const generateNewKey = (dragVDOMAndPropsConfig: DragVDomAndPropsConfigType, rootKey: number) => {
  const { vDOMCollection, propsConfigCollection } = dragVDOMAndPropsConfig;
  const keyMap: { [key: string]: string } = {};
  const newVDOMCollection: ComponentConfigsType = {};
  let newPropsConfigCollection: PropsConfigSheetType|undefined;
  let newKey = rootKey;
  each(vDOMCollection, (vDom, key) => {
    ++newKey
    if (key === ROOT) {
      newKey = rootKey;
    }
    keyMap[key] = `${newKey}`;
    newVDOMCollection[newKey] = vDom;
  });

  each(newVDOMCollection, (vDom) => {
    const childNodes = vDom.childNodes;
    if(!childNodes) return
    if (Array.isArray(childNodes)) {
      vDom.childNodes = childNodes.map((key) => keyMap[key]);
    } else{
      const newChildNodes: PropsNodeType = {};
      each(childNodes, (nodes, propName) => {
      newChildNodes[propName] = nodes!.map((key) => keyMap[key]);
      });
      vDom.childNodes = newChildNodes;
    }

  });
  if(propsConfigCollection){
    newPropsConfigCollection={}
    each(propsConfigCollection, (v, k) => {
      newPropsConfigCollection![keyMap[k]] = v;
    });
  }

  return { newVDOMCollection, newPropsConfigCollection };
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
  const { nodePropsConfig, isRequired } = getComponentConfig(componentName);
  return selectedPropName && nodePropsConfig![selectedPropName].isRequired &&
    !get(childNodes, selectedPropName) || isRequired && !childNodes;

};

export function shallowEqual(objA: any, objB: any) {
  for (const k of Object.keys(objA)) {
    if (objA[k] !== objB[k]) return false;
  }
  return true;
}



export function deleteChildNodesKey(childNodes:ChildNodesType,deleteKey:string,parentPropName?:string) {
  if(Array.isArray(childNodes)){
    const resultChildNodes= childNodes.filter((nodeKey: string) => nodeKey !== deleteKey)
    return restObject(resultChildNodes)
  }else {
    const resultChildNodes= childNodes[parentPropName!]!.filter((nodeKey: string) => nodeKey !== deleteKey)
    if(resultChildNodes.length===0){
      delete childNodes[parentPropName!]
    }else{
      childNodes[parentPropName!]=resultChildNodes
    }
    return restObject(childNodes)
  }
}

export function getComponentConfig(componentName:string):ComponentConfigTypes{
  const allComponentConfigs=get(LEGO_BRIDGE,['config','AllComponentConfigs'])
  if(!allComponentConfigs){
    error('Component configuration information set not found！! !')
  }
  const componentConfig=allComponentConfigs[componentName]
  if(componentName&&!componentConfig){
    warn(`${componentName} configuration information not found！! !`)
  }
  return componentConfig
}

export function isContainer(componentName:string) {
  const containers=get(LEGO_BRIDGE,['config','containers'])
  if(!containers){
    error(`Please configure the container category of the components`)
  }else {
   return  containers.includes(componentName)
  }
}

export function error(msg:string) {
    console.error(msg)
    throw new Error(msg)
}

export function warn(msg:string){
  const warn=get(LEGO_BRIDGE,['config','warn'])
  if(warn){
    warn(msg)
  }else{
    console.warn((msg))
  }
  return true
}

export function getNewKey(componentConfigs:ComponentConfigsType) {
  const lastKey=Object.keys(componentConfigs).pop()
  return Number(lastKey)+1
}

export function restObject(obj:any,field?:string) {
  if(field){
    delete obj[field]
  }
  if(Object.keys(obj).length===0) return undefined
  return obj

}


export function handleRules(componentConfigs:ComponentConfigsType,dragKey:string,selectedKey:string,propName?:string,isForbid?:boolean) {
  /**
   * 获取当前拖拽组件的父组件约束，以及属性节点配置信息
   */
  const dragComponentName=componentConfigs[dragKey!].componentName
  const dropComponentName=componentConfigs[selectedKey!].componentName
  const { fatherNodesRule } = getComponentConfig(dragComponentName);
  const { nodePropsConfig, childNodesRule } = getComponentConfig(dropComponentName);

  /**
   * 子组件约束限制，减少不必要的组件错误嵌套
   */
  const childRules = propName ? nodePropsConfig![propName].childNodesRule : childNodesRule;
  if (childRules&&!childRules.includes(dragComponentName)) {
    !isForbid&&warn(`${propName || dropComponentName}:only allow drag and drop to add${childRules.toString()}`)
    return true
  }
  /**
   * 父组件约束限制，减少不必要的组件错误嵌套
   */
  if (fatherNodesRule && !fatherNodesRule.includes(propName ? `${dropComponentName}.${propName}` : `${dropComponentName}`)) {
    !isForbid&&warn(`${dragComponentName}:Only allowed as a child node or attribute node of${fatherNodesRule.toString()}`)
    return true
  }
  return false
}

export function combineReducers(brickReducer:ReducerType,customReducer?:ReducerType):ReducerType {
  return (state:StateType|undefined,action:BrickAction):StateType=>{
    const newState= brickReducer(state,action)
    if(customReducer){
      return customReducer(newState,action)
    }else {
      return newState
    }
  }
}

export function createTemplateConfigs(templateConfigs:ComponentConfigsType,
                                      templatePropsConfigSheet:PropsConfigSheetType,
                                      componentConfigs:ComponentConfigsType,
                                      propsConfigSheet:PropsConfigSheetType,
                                      childNodes:ChildNodesType) {
  if(Array.isArray(childNodes)){
    for (const key of childNodes){
      templateConfigs[key]=componentConfigs[key];
      if(propsConfigSheet[key]){
        templatePropsConfigSheet[key]=propsConfigSheet[key]
      }
      const {childNodes}=templateConfigs[key]
      if(childNodes) createTemplateConfigs(templateConfigs,templatePropsConfigSheet,componentConfigs,propsConfigSheet,childNodes)
    }
  }else {
    each(childNodes,(childKeys)=>{
      if(!isEmpty(childKeys)) createTemplateConfigs(templateConfigs,templatePropsConfigSheet,componentConfigs,propsConfigSheet,childKeys)
    })
  }
}


export function createTemplate(state:StateType) {
  const {selectedInfo,componentConfigs,propsConfigSheet}=state
  const {selectedKey}=selectedInfo
  const templateConfigs={[ROOT]:componentConfigs[selectedKey]}
  const templatePropsConfigSheet={[ROOT]:propsConfigSheet[selectedKey]}
  const {childNodes}=componentConfigs[selectedKey]
  if(!isEmpty(childNodes)){
    createTemplateConfigs(templateConfigs,templatePropsConfigSheet,componentConfigs,propsConfigSheet,childNodes)
  }
  return { templateConfigs,templatePropsConfigSheet }
}


import { ChildNodesType, ComponentConfigsType, PropsNodeType, SelectedInfoType, VirtualDOMType } from '../types';
import uuid from 'uuid';
import each from 'lodash/each';
import get from 'lodash/get';
import flattenDeep from 'lodash/flattenDeep';
import map from 'lodash/map';
import { LEGO_BRIDGE } from '../store';

/**
 * 复制组件
 * @param componentConfigs
 * @param selectedKey
 * @param newKey
 */
export const copyConfig = (componentConfigs: ComponentConfigsType, selectedKey: string,newKey:string) => {

    componentConfigs[newKey]= {...componentConfigs[selectedKey]}

    const vDom=componentConfigs[newKey]
    const childNodes=vDom.childNodes
    if(Array.isArray(childNodes)){
        vDom.childNodes=copyChildNodes(componentConfigs,childNodes)
    }else if (childNodes){
        const newChildNodes:PropsNodeType={}
        each((childNodes as PropsNodeType),(nodes,propName)=>{
            newChildNodes[propName]=copyChildNodes(componentConfigs,nodes)
        })
        vDom.childNodes=newChildNodes
    }
};

function copyChildNodes(componentConfigs:ComponentConfigsType,childNodes:string[]) {
    const newChildKeys=[]
    for(let oldKey of childNodes){
        let newChildKey=uuid()
        newChildKeys.push(newChildKey)
        copyConfig(componentConfigs,oldKey,newChildKey)
    }
    return newChildKeys
}


export function deleteChildNodes(componentConfigs:ComponentConfigsType,childNodes:ChildNodesType){
    if(Array.isArray(childNodes)){
        deleteArrChild(componentConfigs,childNodes)
    }else {
        each(childNodes,(propChildNodes)=>deleteArrChild(componentConfigs,propChildNodes))
    }

}
function deleteArrChild(componentConfigs:ComponentConfigsType,childNodes:string[]) {
    for(let key of childNodes){
        const childNodesInfo= componentConfigs[key].childNodes
        if(childNodesInfo){
            deleteChildNodes(componentConfigs,childNodesInfo)
        }
        delete componentConfigs[key]
    }
}
/**
 * 获取路径
 * @param location
 * @param index
 * @param propName
 */
export function getLocation(key:string,propName?:string):string[] {
    const basePath=[key,'childNodes']
    return propName?[...basePath,propName]:basePath;
}

/**
 * 生成新的Key
 * 防止模板出现重复key
 * @param vDOMCollection
 * @param rootKey
 */
export const getNewDOMCollection = (vDOMCollection: ComponentConfigsType,rootKey:string) => {
    const keyMap:{[key:string]:string}={}
    const newDOMCollection:ComponentConfigsType={}
    each(vDOMCollection,(vDom,key)=>{
        if(key==='root'){
            newDOMCollection[rootKey]=vDom
            keyMap[key]=rootKey
        }else {
            keyMap[key]=uuid()
        }
    })
    each(vDOMCollection,(vDom)=>{
       const childNodes=vDom.childNodes

            if(Array.isArray(childNodes)){
                vDom.childNodes=childNodes.map((key)=>keyMap[key])
            }else if(childNodes){
                let newChildNodes:PropsNodeType={}
                each(childNodes,(nodes,propName)=>{
                    newChildNodes[propName]=nodes.map((key)=>keyMap[key])
                })
                vDom.childNodes=newChildNodes
            }

    })
    return newDOMCollection;
};



/**
 * 获取字段在props中的位置
 * @param fieldConfigLocation
 * @returns {string}
 */
export const getFieldInPropsLocation = (fieldConfigLocation: string) => {
    return fieldConfigLocation.split('.').filter(location => location !== 'childPropsConfig').join('.');
};


/**
 * 处理子节点非空
 * @param selectedInfo
 * @param componentConfigs
 * @returns {boolean}
 */
export const handleRequiredHasChild = (selectedInfo: SelectedInfoType, componentConfigs: ComponentConfigsType, payload?: any) => {
    //todo
    // const { isRequiredHasChild, location, selectedKey } = selectedInfo;
    // if (payload) {
    //     const { propName, componentConfig: { key } } = payload;
    //     const newSelectedKey = propName ? `${key}${propName}` : key;
    //     if (newSelectedKey === selectedKey) return false;
    // }
    // if (!isRequiredHasChild) return false;
    // const childNodesLocation = getFatherLocation(location);
    // const result = isEmpty(get(componentConfigs, childNodesLocation));
    // if (result) {
    //     console.warn('当前选中组件必须拥有子组件');
    // }
    // return result;

};

export const handleComponentInfo = (payload: any) => {
    const { propName, componentConfig } = payload;
    const { fatherName, childNodes } = componentConfig;
    let { componentName } = componentConfig;
    componentName = fatherName || componentName;
    const isContainer = !!childNodes;
    let { nodePropsConfig } = get(LEGO_BRIDGE.config.AllComponentConfigs, componentName), childNodesRule, isOnlyNode;
    if (nodePropsConfig) {
        if (propName) {
            ({ childNodesRule, isOnlyNode } = get(nodePropsConfig, propName));
        } else {
            each(nodePropsConfig, (config) => {
                ({ childNodesRule, isOnlyNode } = config);
            });
        }

    }
    return {
        isContainer,
        isOnlyNode,
        childNodesRule,
        componentName,
    };
};



export const generateVDOM=(componentName:string,defaultProps:any={})=>{

    const vDOM:VirtualDOMType={
        componentName: componentName,
        props: defaultProps
    }
    if (LEGO_BRIDGE.containers.includes(componentName)) {
        const {nodePropsConfig} = get(LEGO_BRIDGE.config.AllComponentConfigs, componentName);
        vDOM.childNodes=[]
        // 是否为多属性节点
        if(nodePropsConfig){
            const childNodes:PropsNodeType={}
            each(nodePropsConfig, (nodePropConfig, propName) => {
                childNodes[propName] = [];
            });
            vDOM.childNodes=childNodes
        }
    }
    return {root:vDOM}
}

/**
 * 用于获取组件名字数组
 * @param data
 * @returns {Array}
 */
export function flattenDeepArray(data: any) {
    return flattenDeep(map(data, (v, k) => {
        if (v && v.components) return map(v.components, (_, subK) => subK);
        return k;
    }));
}

export function update(o:any,paths:string[],func:(t:any)=>any) {
    let temp:any=o
    let tempHost:any
    for(let i=0;i<paths.length;i++){
        temp=temp[paths[i]]
        if(i===paths.length-1){
            tempHost=temp
        }
    }
    tempHost[paths[paths.length-1]]=func(temp)
}


function is(x:any, y:any) {
    if (x === y) {
        return x !== 0 || y !== 0 || 1 / x === 1 / y
    } else {
        return x !== x && y !== y
    }
}

export  function shallowEqual(objA:any, objB:any) {
    if (is(objA, objB)) return true

    if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
        return false
    }
    const keysA = Object.keys(objA)
    const keysB = Object.keys(objB)

    if (keysA.length !== keysB.length) return false

    for (let key of keysA) {
        if (!Object.prototype.hasOwnProperty.call(objB, key) || !is(objA[key], objB[key])) {
            return false
        }
    }

    return true
}


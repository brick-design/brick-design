import { StateType } from '../types';
import { copyConfig, deleteChildNodes, getLocation, getNewDOMCollection } from '../utils';
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
export function addComponent(state: StateType) {
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
    const {selectedKey,  propName,domTreeKeys} = selectedInfo||dropTarget||{};
    if (!dragSource||componentConfigs.root&&!selectedKey) return state
    const { vDOMCollection,dragKey, parentKey,parentPropName} = dragSource;


    /**
     * 当拖拽的父key与drop目标key一直说明未移动
     * 当拖拽的key与drop目标key一直说明是他自己
     */
    if(parentKey&&parentKey===selectedKey||domTreeKeys&&domTreeKeys.includes(dragKey)) return state

    if(!componentConfigs.root) {
        undo.push({componentConfigs});
        redo.length = 0;
        return {
            ...state,
            componentConfigs:vDOMCollection,
            dragSource:null,
            undo,
            redo
        }
    }

    /**
     * 获取当前拖拽组件的父组件约束，以及属性节点配置信息
     */
    const dragComponentName=get(dragKey?componentConfigs[dragKey]:vDOMCollection.root,'componentName')
    const dropComponentName=get(componentConfigs[selectedKey!],'componentName')
    const {fatherNodesRule} = get(LEGO_BRIDGE.config.AllComponentConfigs,dragComponentName );
    const {nodePropsConfig}=get(LEGO_BRIDGE.config.AllComponentConfigs,dropComponentName)

    /**
     * 父组件约束限制，减少不必要的组件错误嵌套
     */
    if (fatherNodesRule && !fatherNodesRule.includes(propName ? `${dropComponentName}.${propName}` : `${dropComponentName}`)) {
        // todo
       throw new Error(`${dragComponentName}:只允许放入${fatherNodesRule.toString()}组件或者属性中`);
    }
    /**
     * 子组件约束限制，减少不必要的组件错误嵌套
     */
    if(nodePropsConfig&&propName){
        const childNodesRule=nodePropsConfig[propName].childNodesRule
        if (childNodesRule && !childNodesRule.includes(dragComponentName)) {
            // todo
            throw new Error(`${propName || dropComponentName}:只允许拖拽${childNodesRule.toString()}组件`);
        }
    }
    return {
        ...state,
        componentConfigs:produce(componentConfigs,oldConfigs=>{
            //
            let newKey=dragKey||uuid()
            //添加新组件到指定容器中
            update(oldConfigs,getLocation(selectedKey!,propName),childNodes=>{
                return [...childNodes,newKey]
            })
            //如果有父key说明是跨组件的拖拽，原先的父容器需要删除该组件的引用
            if(parentKey){
                update(oldConfigs,getLocation(parentKey,parentPropName),childNodes=>childNodes.filter((nodeKey:string)=>nodeKey!==dragKey))
            }

            if(vDOMCollection){
                //为虚拟dom集合生成新的key与引用，防止多次添加同一模板造成vDom顶替
                Object.assign(oldConfigs,getNewDOMCollection(vDOMCollection,newKey))
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
export function copyComponent(state: StateType) {
    const {undo, redo, componentConfigs, selectedInfo} = state;
    /**
     * 未选中组件不做任何操作
     */
    if (!selectedInfo||selectedInfo.selectedKey==='root') {
        console.warn(!selectedInfo?'请选择你要复制的组件':'禁止复制根节点或者OnlyNode节点')
        return state
    }
    const {selectedKey,parentPropName,parentKey} = selectedInfo;
    undo.push({componentConfigs});
    redo.length = 0;
    return {
        ...state,
        componentConfigs:produce(componentConfigs,oldConfigs=>{
            const newKey=uuid()
            update(oldConfigs,getLocation(parentKey,parentPropName),childNodes=>[...childNodes,newKey])
            copyConfig(oldConfigs, selectedKey,newKey);
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
    const {sortKeys,parentKey,parentPropName,dragInfo} = payload;
    const {undo, redo, componentConfigs} = state;
    undo.push({componentConfigs});
    redo.length = 0;
    return {
        ...state,
        componentConfigs:produce(componentConfigs,oldConfigs=>{
            update(oldConfigs, getLocation(parentKey,parentPropName), () => sortKeys);
            if(dragInfo){
                const {key,parentKey,parentPropName}=dragInfo
                update(oldConfigs,getLocation(parentKey,parentPropName),(childNodes)=>{
                    return  childNodes.filter((nodeKey:string)=>nodeKey!==key)
                })
            }
        }),
        undo,
        redo,
    };
}

/**
 * 删除组件
 * @param state
 * @returns {{propsSetting: *, componentConfigs: *, selectedInfo: *}}
 */
export function deleteComponent(state: StateType) {
    const {undo, redo, componentConfigs, selectedInfo, propsSetting} = state;
    /**
     * 未选中组件将不做任何操作
     */
    if (!selectedInfo) {
        //todo
        console.error('请选择你要删除的组件')
        return state
    }
    const {selectedKey, parentKey,parentPropName} = selectedInfo;
    undo.push({componentConfigs, propsSetting, selectedInfo});
    redo.length = 0;
    return {
        ...state,
        componentConfigs:produce(componentConfigs,oldConfig=>{
            if(selectedKey==='root'){
                return {}
            }else {
                update(oldConfig,getLocation(parentKey,parentPropName),childNodes=>childNodes.filter((childKey:string)=>childKey!==selectedKey))
                delete oldConfig[selectedKey]
            }
        }),
        propsSetting: null,
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

export function clearChildNodes(state: StateType) {
    const {componentConfigs, selectedInfo, undo, redo} = state;
    if (!selectedInfo) {
        //todo
        console.warn("请选择要清除子节点的组件")
        return state
    }
    const {selectedKey,propName} = selectedInfo;
    undo.push({componentConfigs});
    redo.length = 0;
    return {
        ...state,
        componentConfigs:produce(componentConfigs,oldConfig=>{
                deleteChildNodes(oldConfig,oldConfig[selectedKey].childNodes!)
            update(oldConfig, getLocation(selectedKey,propName), () => []);
        }),
        undo,
        redo,
    };
}

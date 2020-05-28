import { generateVDOM, getNewDOMCollection } from '../utils';
import { StateType } from '../types';
import { DragSourcePayload, DropTargetPayload } from '../actions';
import produce from 'immer'
import uuid from 'uuid';

/**
 * 获取拖拽组件数据
 * @param state
 * @param payload
 * @returns {{dragSource: *}}
 */
export function getDragSource(state:StateType, payload:DragSourcePayload) {
    let {componentConfigs,undo}=state
    let { componentName,defaultProps,vDOMCollection,dragKey, parentKey, parentPropName} = payload;
    if(componentName){
        vDOMCollection=generateVDOM(componentName,defaultProps)
    }
    if(componentConfigs.root&&vDOMCollection){
        undo.push(componentConfigs)
        dragKey=uuid()
        componentConfigs=produce(componentConfigs,oldConfigs=>{
            //为虚拟dom集合生成新的key与引用，防止多次添加同一模板造成vDom顶替
            Object.assign(oldConfigs,getNewDOMCollection(vDOMCollection!,dragKey!))

        })
    }
    return {
        ...state,
        dragSource:{
            vDOMCollection,
            dragKey,
            parentKey,
            parentPropName
        },
        componentConfigs,
        undo
    };
}

/**
 * 获取放置组件的容器组件信息
 * @param state
 * @param payload
 */
export function getDropTarget(state:StateType,  payload:DropTargetPayload ) {
    /**
     * 如果location为undefined说明当前组件不是容器组件
     * 清除dropTarget信息
     */
    const {selectedInfo}=state
    if (!payload.selectedKey||selectedInfo) return {
        ...state,
        dropTarget: null,
        hoverKey: null,
    };
    const { selectedKey,propName,domTreeKeys } = payload;
    return {
        ...state,
        dropTarget: {
            selectedKey,
            propName,
            domTreeKeys
        },
        hoverKey: selectedKey,
    };
}

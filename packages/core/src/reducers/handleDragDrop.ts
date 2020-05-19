import { generateVDOM } from '../utils';
import { StateType } from '../types';
import { DragSourcePayload, DropTargetPayload } from '../actions';

/**
 * 获取拖拽组件数据
 * @param state
 * @param payload
 * @returns {{dragSource: *}}
 */
export function getDragSource(state:StateType, payload:DragSourcePayload) {
    const { componentName,defaultProps,vDOMCollection,dragKey, parentKey, parentPropName} = payload;

    return {
        ...state,
        dragSource:{
            vDOMCollection:componentName?generateVDOM(componentName,defaultProps):vDOMCollection,
            dragKey,
            parentKey,
            parentPropName
        },
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

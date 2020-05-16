import {generateVDOM, handleComponentInfo} from "../utils";
import {StateType} from "@/store/interfaces";
import {string} from "prop-types";
import {DragSourcePayload} from "@/store";

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
            vDOMCollection:vDOMCollection||generateVDOM(componentName!,defaultProps),
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
export function getDropTarget(state:StateType,  payload:any ) {
    /**
     * 如果location为undefined说明当前组件不是容器组件
     * 清除dropTarget信息
     */
    if (!payload.selectedKey) return {
        ...state,
        dropTarget: null,
        hoverKey: null,
    };
    const { selectedKey,propName } = payload;
    return {
        ...state,
        dropTarget: {
            selectedKey,
            propName
        },
        hoverKey: selectedKey,
    };
}

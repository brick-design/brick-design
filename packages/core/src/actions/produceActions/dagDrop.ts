import ACTION_TYPES from "../actionTypes";
import {ComponentConfigsType} from "../../types";
import {LEGO_BRIDGE} from "../../store";

export type DragSourcePayload={
    componentName?:string,
    defaultProps?:any,
    vDOMCollection?:ComponentConfigsType,
    dragKey?:string,
    parentKey?:string,
    parentPropName?:string
}
export const getDragSource=(payload:DragSourcePayload)=>LEGO_BRIDGE.dispatch({type:ACTION_TYPES.getDragSource,payload})
export type DropTargetPayload={
    selectedKey?:string,
    propName?:string
}
export const getDropTarget=(payload:DropTargetPayload)=>LEGO_BRIDGE.dispatch({type:ACTION_TYPES.getDropTarget,payload})

import ACTION_TYPES from "../actionTypes";
import {VirtualDOMType} from "../../interfaces";
import {LEGO_BRIDGE} from "../../store";

export const addComponent=()=> LEGO_BRIDGE.dispatch({type:ACTION_TYPES.addComponent})
export const copyComponent=()=>LEGO_BRIDGE.dispatch({type:ACTION_TYPES.copyComponent})

export type DragInfoType={
    key:string,
    parentKey:string,
    parentPropName?:string
}
export type LayoutSortPayload={
    sortKeys:string[],
    parentKey:string,
    parentPropName:string,
    dragInfo?:DragInfoType
}
export const onLayoutSortChange= (payload: LayoutSortPayload)=>LEGO_BRIDGE.dispatch({type:ACTION_TYPES.onLayoutSortChange,payload})
export const deleteComponent=()=>LEGO_BRIDGE.dispatch({type:ACTION_TYPES.deleteComponent})
export const clearChildNodes=()=>LEGO_BRIDGE.dispatch({type:ACTION_TYPES.clearChildNodes})

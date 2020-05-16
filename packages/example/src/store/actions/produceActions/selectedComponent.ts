import ACTION_TYPES from "../actionTypes";
import {VirtualDOMType} from "../../interfaces";
import {LEGO_BRIDGE} from "../../store";

export type selectComponentType={
    key:string,
    parentKey?:string,
    parentPropName?:string,
    propName?:string,
    domTreeKeys:string[],
}
export const selectComponent=(payload:selectComponentType)=>LEGO_BRIDGE.dispatch({type:ACTION_TYPES.selectComponent,payload})

export const clearSelectedStatus=()=>LEGO_BRIDGE.dispatch({type:ACTION_TYPES.clearSelectedStatus})

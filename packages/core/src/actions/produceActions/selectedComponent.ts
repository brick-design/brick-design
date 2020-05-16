import ACTION_TYPES from "../actionTypes";
import {LEGO_BRIDGE} from "../../store";

export interface SelectedInfoBaseType {
    key:string,
    parentKey:string,
    parentPropName?:string,
    domTreeKeys:string[],
}
export interface SelectComponentType extends SelectedInfoBaseType{
    propName?:string,
}
export const selectComponent=(payload:SelectComponentType)=>LEGO_BRIDGE.dispatch({type:ACTION_TYPES.selectComponent,payload})

export const clearSelectedStatus=()=>LEGO_BRIDGE.dispatch({type:ACTION_TYPES.clearSelectedStatus})

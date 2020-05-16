import ACTION_TYPES from "../actionTypes";
import {PROPS_TYPES, PropsConfigType} from "../../interfaces";
import {LEGO_BRIDGE} from "../../store";

export type AddPropsConfigInfo={
    newPropField?:string,
    fatherFieldLocation:string,
    childPropsConfig?:PropsConfigType[],
    propType?:string
}
export const addPropsConfig=(payload:AddPropsConfigInfo)=>LEGO_BRIDGE.dispatch({type:ACTION_TYPES.addPropsConfig,payload})
export type DeletePropsConfigInfo={
    fatherFieldLocation:string,
    field:string
}
export const deletePropsConfig=(payload:DeletePropsConfigInfo)=>LEGO_BRIDGE.dispatch({type:ACTION_TYPES.deletePropsConfig,payload})
export type SubmitPropsType={
    props:any
}
export const submitProps=(payload:SubmitPropsType)=>LEGO_BRIDGE.dispatch({type:ACTION_TYPES.submitProps,payload})

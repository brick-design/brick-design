import ACTION_TYPES from '../actionTypes';
import { LEGO_BRIDGE } from '../../store';
import { PropsConfigType } from '../../types';

export type AddPropsConfigInfo={
    newPropField?:string,
    fatherFieldLocation:string,
    childPropsConfig?:PropsConfigType[],
    propType?:string
}
export const addPropsConfig=(payload:AddPropsConfigInfo)=>LEGO_BRIDGE.dispatch({type:ACTION_TYPES.addPropsConfig,payload})
export type DeletePropsConfigPayload={
    fatherFieldLocation:string,
    field:string
}
export const deletePropsConfig=(payload:DeletePropsConfigPayload)=>LEGO_BRIDGE.dispatch({type:ACTION_TYPES.deletePropsConfig,payload})
export type SubmitPropsPayload={
    props:any
}
export const submitProps=(payload:SubmitPropsPayload)=>LEGO_BRIDGE.dispatch({type:ACTION_TYPES.submitProps,payload})

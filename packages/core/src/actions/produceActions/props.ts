import ACTION_TYPES from '../actionTypes';
import { LEGO_BRIDGE } from '../../store';
import { PropsConfigType } from '../../types';
const {dispatch}=LEGO_BRIDGE.store!

export type AddPropsConfigPayload={
    newPropField?:string,
    fatherFieldLocation:string,
    childPropsConfig?:PropsConfigType[],
    propType?:string
}
export const addPropsConfig=(payload:AddPropsConfigPayload)=>dispatch({type:ACTION_TYPES.addPropsConfig,payload})
export type DeletePropsConfigPayload={
    fatherFieldLocation:string,
    field:string
}
export const deletePropsConfig=(payload:DeletePropsConfigPayload)=>dispatch({type:ACTION_TYPES.deletePropsConfig,payload})
export type ChangePropsPayload={
    props:any
}
export const changeProps=(payload:ChangePropsPayload)=>dispatch({type:ACTION_TYPES.changeProps,payload})

export const resetProps=()=>dispatch({type:ACTION_TYPES.resetProps})

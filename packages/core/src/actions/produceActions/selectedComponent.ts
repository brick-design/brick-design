import ACTION_TYPES from '../actionTypes';
import { LEGO_BRIDGE } from '../../store';
import { SelectedInfoBaseType } from '../../types';
const {dispatch}=LEGO_BRIDGE.store!

export type SelectComponentPayload= SelectedInfoBaseType&{propName?:string}
export const selectComponent=(payload:SelectComponentPayload)=>dispatch({type:ACTION_TYPES.selectComponent,payload})

export const clearSelectedStatus=()=>dispatch({type:ACTION_TYPES.clearSelectedStatus})

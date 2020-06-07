import ACTION_TYPES from '../actionTypes';
import { LEGO_BRIDGE } from '../../store';
import { SelectedInfoBaseType } from '../../types';

export type SelectComponentPayload= SelectedInfoBaseType&{propName?:string}
export const selectComponent=(payload:SelectComponentPayload)=>LEGO_BRIDGE.store!.dispatch({type:ACTION_TYPES.selectComponent,payload})

export const clearSelectedStatus=()=>LEGO_BRIDGE.store!.dispatch({type:ACTION_TYPES.clearSelectedStatus})

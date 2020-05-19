import ACTION_TYPES from '../actionTypes';
import { LEGO_BRIDGE } from '../../store';
import { SelectedInfoBaseType } from '../../types';

export type SelectComponentType= SelectedInfoBaseType&{propName?:string}
export const selectComponent=(payload:SelectComponentType)=>LEGO_BRIDGE.dispatch({type:ACTION_TYPES.selectComponent,payload})

export const clearSelectedStatus=()=>LEGO_BRIDGE.dispatch({type:ACTION_TYPES.clearSelectedStatus})

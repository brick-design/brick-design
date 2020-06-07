import ACTION_TYPES from '../actionTypes';
import { LEGO_BRIDGE } from '../../store';

export const clearHovered=()=>LEGO_BRIDGE.store!.dispatch({type:ACTION_TYPES.clearHovered})
export type OverTargetPayload={
    hoverKey:string
}
export const overTarget=(payload:OverTargetPayload)=>LEGO_BRIDGE.store!.dispatch({type:ACTION_TYPES.overTarget,payload})

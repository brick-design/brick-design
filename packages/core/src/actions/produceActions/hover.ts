import ACTION_TYPES from '../actionTypes';
import { LEGO_BRIDGE } from '../../store';
const {dispatch}=LEGO_BRIDGE.store!

export const clearHovered=()=>dispatch({type:ACTION_TYPES.clearHovered})
export type OverTargetPayload={
    hoverKey:string
}
export const overTarget=(payload:OverTargetPayload)=>dispatch({type:ACTION_TYPES.overTarget,payload})

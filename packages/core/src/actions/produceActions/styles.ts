import ACTION_TYPES from '../actionTypes';
import { LEGO_BRIDGE } from '../../store';
const {dispatch}=LEGO_BRIDGE.store!

export type stylePayload={style:any}
export const changeStyles=(payload:stylePayload)=>dispatch({type:ACTION_TYPES.changeStyles,payload})
export const resetStyles=()=>dispatch({type:ACTION_TYPES.resetProps})

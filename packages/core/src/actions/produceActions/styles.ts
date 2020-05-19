import ACTION_TYPES from '../actionTypes';
import { LEGO_BRIDGE } from '../../store';

export type stylePayload={style:any}
export const changeStyles=(payload:stylePayload)=>LEGO_BRIDGE.dispatch({type:ACTION_TYPES.changeStyles,payload})

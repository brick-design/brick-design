import ACTION_TYPES from '../actionTypes';
import { LEGO_BRIDGE } from '../../store';

const {dispatch}=LEGO_BRIDGE.store!

export const undo=()=>dispatch({type:ACTION_TYPES.undo})
export const redo=()=>dispatch({type:ACTION_TYPES.redo})

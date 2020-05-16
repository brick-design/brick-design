import ACTION_TYPES from '../actionTypes';
import { LEGO_BRIDGE } from '../../store';

export const undo=()=>LEGO_BRIDGE.dispatch({type:ACTION_TYPES.addPropsConfig})
export const redo=()=>LEGO_BRIDGE.dispatch({type:ACTION_TYPES.deletePropsConfig})

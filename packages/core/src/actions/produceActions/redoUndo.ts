import ACTION_TYPES from '../actionTypes';
import { LEGO_BRIDGE } from '../../store';

export const undo = () => LEGO_BRIDGE.store!.dispatch({ type: ACTION_TYPES.undo });
export const redo = () => LEGO_BRIDGE.store!.dispatch({ type: ACTION_TYPES.redo });

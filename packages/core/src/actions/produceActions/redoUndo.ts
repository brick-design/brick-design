import ACTION_TYPES from '../actionTypes';
import { createActions } from '../../utils';

export const undo = () => createActions({ type: ACTION_TYPES.undo });
export const redo = () => createActions({ type: ACTION_TYPES.redo });

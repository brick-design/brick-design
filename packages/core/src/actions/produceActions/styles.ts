import ACTION_TYPES from '../actionTypes';
import { createActions } from '../../store';

export type stylePayload = { style: any }
export const changeStyles = (payload: stylePayload) => createActions({
  type: ACTION_TYPES.changeStyles,
  payload,
});
export const resetStyles = () => createActions({ type: ACTION_TYPES.resetStyles });

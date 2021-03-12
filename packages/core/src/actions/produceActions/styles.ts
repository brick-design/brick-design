import ACTION_TYPES from '../actionTypes';
import { createActions } from '../../utils';

export type stylePayload = { style: any };
export const changeStyles = (payload: stylePayload) =>
  createActions({
    type: ACTION_TYPES.changeStyles,
    payload,
  });
export const resetStyles = () =>
  createActions({ type: ACTION_TYPES.resetStyles });

export type ResizePayload = {
  width?: string;
  height?: string;
};
export const resizeChange = (payload: ResizePayload) =>
  createActions({ type: ACTION_TYPES.resizeChange, payload });

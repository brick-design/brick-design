import ACTION_TYPES from '../actionTypes';
import { createActions } from '../../utils';

export type stylePayload = { style: any,isMerge?:boolean };
export const changeStyles = (payload: stylePayload) =>
  createActions({
    type: ACTION_TYPES.changeStyles,
    payload,
  });

export type VisualizedStylesPayload = {
  width?: string;
  height?: string;
  transform?:string
};
export const changeVisualizedStyles = (payload: VisualizedStylesPayload) =>
  createActions({ type: ACTION_TYPES.changeVisualizedStyles, payload });

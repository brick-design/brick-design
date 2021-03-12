import ACTION_TYPES from '../actionTypes';
import { createActions } from '../../utils';

export const clearHovered = () =>
  createActions({ type: ACTION_TYPES.clearHovered });
export type OverTargetPayload = {
  hoverKey: string;
};
export const overTarget = (payload: OverTargetPayload) =>
  createActions({
    type: ACTION_TYPES.overTarget,
    payload,
  });

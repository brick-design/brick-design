import ACTION_TYPES from '../actionTypes';
import { createActions } from '../../utils';

export type ChangePropsPayload = {
  props: any;
};
export const changeProps = (payload: ChangePropsPayload) =>
  createActions({
    type: ACTION_TYPES.changeProps,
    payload,
  });

export const resetProps = () =>
  createActions({ type: ACTION_TYPES.resetProps });

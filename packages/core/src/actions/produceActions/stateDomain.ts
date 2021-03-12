import ACTION_TYPES from '../actionTypes';
import { createActions } from '../../utils';

export type ComponentKeyPayload = { key: string };
export const setStateDomain = (payload: ComponentKeyPayload) =>
  createActions({ type: ACTION_TYPES.setStateDomain, payload });

export const restStateDomain = (payload: ComponentKeyPayload) =>
  createActions({
    type: ACTION_TYPES.restStateDomain,
    payload,
  });

import { ApiType, PlainObject } from '@brickd/utils';
import ACTION_TYPES from '../actionTypes';
import { createActions } from '../../utils';

export const setComponentState = (payload: PlainObject) =>
  createActions({ type: ACTION_TYPES.setComponentState, payload });

export type ApiPayload = {
  api: ApiType;
};
export const setApi = (payload: ApiPayload) =>
  createActions({ type: ACTION_TYPES.setApi, payload });

import ACTION_TYPES from '../actionTypes';
import { createActions } from '../../store';
import { ApiType } from '../../types';

export type ApiPayload = {
	api:ApiType
}
export const setApi = (payload:ApiPayload) =>
	createActions({ type: ACTION_TYPES.setApi,payload });


import { ApiType } from '@brickd/utils';
import ACTION_TYPES from '../actionTypes';
import { createActions } from '../../utils';

export type ApiPayload = {
	api:ApiType
}
export const setApi = (payload:ApiPayload) =>
	createActions({ type: ACTION_TYPES.setApi,payload });


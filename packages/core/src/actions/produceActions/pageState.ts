import ACTION_TYPES from '../actionTypes';
import { createActions } from '../../store';
import { PlainObjectType } from '../../types';

export type StatePayload = {
	[key:string]: PlainObjectType
}
export const setState = (payload:StatePayload) =>
	createActions({ type: ACTION_TYPES.setState,payload });

export const removeState=(payload:{key:string})=>createActions({
	type: ACTION_TYPES.removeState,
	payload,
});

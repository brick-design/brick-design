import ACTION_TYPES from '../actionTypes';
import { createActions } from '../../utils';
import { PROPS_TYPES, PropsConfigType } from '../../types';

export type AddPropsConfigPayload = {
	newPropField?: string
	fatherFieldLocation: string
	childPropsConfig?: PropsConfigType[]
	propType?: PROPS_TYPES
}
export const addPropsConfig = (payload: AddPropsConfigPayload) =>
	createActions({
		type: ACTION_TYPES.addPropsConfig,
		payload,
	});
export type DeletePropsConfigPayload = {
	fatherFieldLocation: string
	field: string
}
export const deletePropsConfig = (payload: DeletePropsConfigPayload) =>
	createActions({
		type: ACTION_TYPES.deletePropsConfig,
		payload,
	});
export type ChangePropsPayload = {
	props: any
}
export const changeProps = (payload: ChangePropsPayload) =>
	createActions({
		type: ACTION_TYPES.changeProps,
		payload,
	});

export const resetProps = () => createActions({ type: ACTION_TYPES.resetProps });

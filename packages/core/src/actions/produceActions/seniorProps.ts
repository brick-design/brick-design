import ACTION_TYPES from '../actionTypes';
import { createActions } from '../../utils';

export type ChangeSeniorPropsPayload = {
	props: any;
};
export const changeSeniorProps = (payload: ChangeSeniorPropsPayload) =>
	createActions({
		type: ACTION_TYPES.changeSeniorProps,
		payload,
	});

import ACTION_TYPES from '../actionTypes';
import { PlatformInfoType } from '../../types';
import { createActions } from '../../store';

export const changePlatform = (payload: PlatformInfoType) =>
	createActions({
		type: ACTION_TYPES.changePlatform,
		payload,
	});

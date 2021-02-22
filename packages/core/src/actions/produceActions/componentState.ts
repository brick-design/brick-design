import { StatePayload } from './pageState';
import ACTION_TYPES from '../actionTypes';
import { createActions } from '../../utils';


export const setComponentState = (payload:StatePayload) =>
	createActions({ type: ACTION_TYPES.setComponentState,payload });


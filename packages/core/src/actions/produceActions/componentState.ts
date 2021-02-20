import { StatePayload } from './pageState';
import ACTION_TYPES from '../actionTypes';
import { createActions } from '../../store';


export const setComponentState = (payload:StatePayload) =>
	createActions({ type: ACTION_TYPES.setComponentState,payload });


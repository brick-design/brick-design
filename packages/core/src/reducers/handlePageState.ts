import {merge} from 'lodash';
import { StateType } from '../types';
import { StatePayload } from '../actions';

export function setState(state: StateType, payload: StatePayload): StateType{
	const {pageState}=state;
	return {
		...state,
		pageState:merge(pageState,payload),
	};
}


export function removeState(state: StateType, payload: {key:string}): StateType{
	const {key}=payload;
	const {pageState}=state;
	delete pageState[key];
	return {
		...state,
		pageState
	};
}

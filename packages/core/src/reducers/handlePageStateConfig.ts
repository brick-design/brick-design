import {merge} from 'lodash';
import { StateType } from '../types';
import { ApiPayload, StatePayload } from '../actions';

export function setPageState(state: StateType, payload: StatePayload): StateType{
	const {pageState,pageStateConfig}=state;
	return {
		...state,
		pageState:merge(pageState,{state:payload}),
		pageStateConfig:{...pageStateConfig,state:payload}
	};
}


export function setPageApi(state: StateType, payload: ApiPayload): StateType{
	const {pageStateConfig}=state;
	return {
		...state,
		pageStateConfig:merge(pageStateConfig,payload)
	};
}

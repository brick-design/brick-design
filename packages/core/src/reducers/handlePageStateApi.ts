import {merge} from 'lodash';
import { PlainObject } from '@brickd/utils';
import { StateType } from '../types';
import { ApiPayload } from '../actions';

export function setPageState(state: StateType, payload: PlainObject): StateType{
	const {pageStateConfig}=state;
	return {
		...state,
		pageStateConfig:{...pageStateConfig,state:payload}
	};
}


export function setPageApi(state: StateType, payload: ApiPayload): StateType{
	const {pageStateConfig}=state;
	return {
		...state,
		pageStateConfig:merge({},pageStateConfig,payload)
	};
}

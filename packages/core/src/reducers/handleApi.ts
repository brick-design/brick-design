import {isEmpty} from 'lodash';
import { produce } from 'immer';
import { StateType } from '../types';
import { ApiPayload } from '../actions';
import {
	warn,
} from '../utils';

export function setApi(state: StateType, payload: ApiPayload): StateType{
	const {selectedInfo,pageConfig,undo,redo}=state;
	if(!selectedInfo){
		warn('Please select the components');
		return state;
	}
	undo.push({ pageConfig});
	redo.length = 0;
	return {
		...state,
		pageConfig:produce(pageConfig,(oldConfigs)=>{
			const config = oldConfigs[selectedInfo.selectedKey];
			if(isEmpty(payload.api)&&config.api){
				delete config.api;
			}else {
				config.api=payload.api;
			}

		}),
		undo,
		redo
	};
}


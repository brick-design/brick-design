import {isEmpty,merge} from 'lodash';
import { produce } from 'immer';
import { PlainObjectType, StateType } from '../types';
import {
	warn,
} from '../utils';


export function setComponentState(state: StateType, payload: PlainObjectType): StateType{
	const {selectedInfo,pageConfig,undo,redo,pageState}=state;
	if(!selectedInfo){
		warn('Please select the components');
		return state;
	}
	const {selectedKey}=selectedInfo;
	undo.push({ pageConfig});
	redo.length = 0;
	return {
		...state,
		pageState:merge(pageState,{[selectedKey]:payload}),
		pageConfig:produce(pageConfig,(oldConfigs)=>{
			const config = oldConfigs[selectedKey];
			if(isEmpty(payload)&&config.state){
				delete config.state;
			}else {
				config.state=payload;
			}

		}),
		undo,
		redo
	};
}


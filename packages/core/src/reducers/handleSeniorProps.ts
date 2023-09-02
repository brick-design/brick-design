import produce from 'immer';

import { StateType } from '../types';

import { ChangeSeniorPropsPayload } from '../actions';

/**
 * 提交属性
 * @param state
 * @param payload
 * @returns {{propsSetting: *, pageConfig: *}}
 */
export function changeSeniorProps(
	state: StateType,
	payload: ChangeSeniorPropsPayload,
): StateType {
	const { pageConfig, selectedInfo, undo, redo } = state;
	if (!selectedInfo) return state;
	const { props } = payload;
	const { selectedKey } = selectedInfo;
	undo.push({ pageConfig });
	redo.length = 0;
	return {
		...state,
		pageConfig: produce(pageConfig!, (oldConfigs) => {
				const cConfig = oldConfigs[selectedKey];
				oldConfigs[selectedKey] = { ...cConfig, ...props };
		}),
		undo,
		redo,
	};
}

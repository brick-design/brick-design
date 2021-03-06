import {merge} from 'lodash';
import { StateType } from '../types';

export const legoState: StateType = {
	pageConfig: {}, // 所有组件信息
	selectedInfo: null, // 选中组件的信息
	undo: [],
	redo: [],
	hoverKey: null,
	dragSource: null,
	dropTarget: null,
	platformInfo: { isMobile: false, size: ['100%', '100%'] },
};
export function initPageBrickdState(state: StateType,payload:Partial<StateType>): StateType {
	return merge({},legoState,state,payload);
}

export function removePageBrickdState(): StateType{
	return undefined;
}

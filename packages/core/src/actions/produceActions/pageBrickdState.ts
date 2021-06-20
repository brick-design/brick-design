import ACTION_TYPES from '../actionTypes';
import { createActions } from '../../utils';
import { StateType } from '../../types'
export type PageBrickdStateType={
	[layerName:string]:Partial<StateType>
}
export const initPageBrickdState = (payload: PageBrickdStateType) =>
  createActions({ type: ACTION_TYPES.initPageBrickdState, payload });

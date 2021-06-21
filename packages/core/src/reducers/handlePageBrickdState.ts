import { merge, each } from 'lodash';
import { BrickDesignStateType, StateType } from '../types';
import { PageBrickdStateType } from '../actions';

export const legoState: StateType = {
  pageConfig: {}, // 所有组件信息
  selectedInfo: null, // 选中组件的信息
  undo: [],
  redo: [],
  hoverKey: null,
  dragSource: null,
  dropTarget: null,
  platformInfo: { platformName: 'PC', size: [1920, 1080] },
};

export function initPageBrickdState(
  state: BrickDesignStateType,
  payload: PageBrickdStateType,
): BrickDesignStateType {
  let newState = {};
  const layerName = Object.keys(payload)[0];

  each(payload, (v, k) => {
    newState[k] = merge(v, legoState);
  });

  return { layerName, ...newState };
}

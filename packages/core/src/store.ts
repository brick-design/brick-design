import { createStore, Store } from 'redux';
import { reducer, ReducerType } from './reducers';
import { BrickAction, ConfigType, StateType } from './types';
import { combineReducers } from './utils';

export type LegoBridgeType = {
  config?: ConfigType,
  store: Store<StateType, BrickAction> | null
}
export const LEGO_BRIDGE: LegoBridgeType = {
  store: null,
};

export const legoState: StateType = {
  componentConfigs: {}, // 所有组件信息
  selectedInfo: null, // 选中组件的信息
  propsConfigSheet: {},  // 属性设置暂存属性数据
  undo: [],
  redo: [],
  hoverKey: null,
  dragSource: null,
  dropTarget: null,
  platformInfo: { isMobile: false, size: ['100%', '100%'] },
};
export function createActions(action:BrickAction) {
return LEGO_BRIDGE.store!.dispatch(action)
}
export function createLegStore(initState: Partial<StateType> = {},customReducer?:ReducerType) {
  if (LEGO_BRIDGE.store) return LEGO_BRIDGE.store;
  const store = createStore(
    combineReducers(reducer,customReducer), 
    { ...legoState, ...initState },
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__()
  );
  LEGO_BRIDGE.store = store;
  return store;
}


import { createStore } from 'redux';
import { reducer, ReducerType } from './reducers';
import { ConfigType } from './types';
import { combineReducers, getPageState } from './utils';
import {
  WarnType,
  setWarn,
  getBrickdConfig,
  setBrickdConfig,
  getStore,
  setStore,
} from './utils/caches';

export function createLegoStore(
  config: ConfigType,
  customReducer?: ReducerType,
  warn?: WarnType,
) {
  if (warn) setWarn(warn);
  if (getBrickdConfig() && !config) {
    throw Error('config未初始化');
  } else if (!getBrickdConfig()) {
    setBrickdConfig(config);
  }
  if (getStore()) return getStore();

  const store = createStore(
    combineReducers(reducer, customReducer),
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
      (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
  );
  const legoStore = { ...store, getPageState };
  setStore(legoStore);
  return legoStore;
}

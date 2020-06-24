import { createElement } from 'react';
import { LegoContext } from './LegoContext';
import { createLegStore, LEGO_BRIDGE } from '../store';
import { ConfigType, StateType } from '../types';
import { ReducerType } from '../reducers';

export interface LegoProviderProps {
  children?: any,
  initState?: Partial<StateType>,
  config?: ConfigType,
  reduce?:ReducerType
}

export function LegoProvider({ children, initState, config,reduce }: LegoProviderProps = {}) {
  if (!LEGO_BRIDGE.config && !config) {
    throw Error('config未初始化');
  } else if (!LEGO_BRIDGE.config) {
    LEGO_BRIDGE.config = config;
  }
  return createElement(LegoContext.Provider, { value: createLegStore(initState,reduce) }, children);
}

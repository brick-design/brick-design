import { createElement } from 'react';
import { LegoContext } from './LegoContext';
import { createLegStore, LEGO_BRIDGE } from '../store';
import { ConfigType, StateType } from '../types';

export interface LegoProviderProps {
  children?: any,
  initState?: Partial<StateType>,
  config?: ConfigType
}

export function LegoProvider({ children, initState, config }: LegoProviderProps = {}) {
  if (!LEGO_BRIDGE.config && !config) {
    throw Error('config未初始化');
  } else if (!LEGO_BRIDGE.config) {
    LEGO_BRIDGE.config = config;
  }
  return createElement(LegoContext.Provider, { value: createLegStore(initState) }, children);
}

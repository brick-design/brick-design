import React, { useEffect, createContext } from 'react';
import {
  ConfigType,
  createLegoStore,
  ReducerType,
  getStore,
  WarnType,
  cleanStateCache,
} from '@brickd/core';

export interface BrickProviderType {
  config: ConfigType;
  customReducer?: ReducerType;
  warn?: WarnType;
  children?: any;
}

export const BrickContext = createContext(null);
function BrickProvider(props: BrickProviderType) {
  const { config, customReducer, warn, children } = props;
  useEffect(() => {
    return cleanStateCache;
  }, []);
  if (!getStore()) {
    createLegoStore(config, customReducer, warn);
  }
  return (
    <BrickContext.Provider value={getStore()}>{children}</BrickContext.Provider>
  );
}

export default React.memo(BrickProvider);

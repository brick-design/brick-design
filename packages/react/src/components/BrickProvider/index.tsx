import * as React from 'react';
import { useEffect, createContext } from 'react';
import {
  ConfigType,
  createLegoStore,
  ReducerType,
  getStore,
  WarnType,
  cleanStateCache,
} from '@brickd/core';

interface BrickProviderType {
  config: ConfigType;
  customReducer?: ReducerType;
  children?: any;
  warn?: WarnType;
}

export const BrickContext = createContext(null);
function BrickProvider(props: BrickProviderType) {
  const { config, customReducer, children, warn } = props;
  useEffect(() => cleanStateCache, []);
  if (!getStore()) {
    createLegoStore(config, customReducer, warn);
  }
  return (
    <BrickContext.Provider value={getStore()}>{children}</BrickContext.Provider>
  );
}

export default React.memo(BrickProvider);

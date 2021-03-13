import React, { createContext, ProviderProps } from 'react';

export const StaticContext = createContext({
  pageConfig: {},
  componentsMap: {},
  props: {},
  options: undefined,
  pageName: null,
});
export const StaticContextProvider = (props: ProviderProps<any>) => (
  <StaticContext.Provider {...props} />
);

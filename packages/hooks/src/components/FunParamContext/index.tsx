import React, { createContext, ProviderProps } from 'react';

export const FunParamContext = createContext(null);
export const FunParamContextProvider = (props: ProviderProps<any>) => (
  <FunParamContext.Provider {...props} />
);

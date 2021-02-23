import React, { createContext } from 'react';

export const FunParamContext=createContext(undefined);
export const FunParamContextProvider=({ children,value})=><FunParamContext.Provider value={value}>{children}</FunParamContext.Provider>;

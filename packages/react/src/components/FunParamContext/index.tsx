import React, { createContext } from 'react';

export const FunParamContext=createContext({funParams:undefined});
export const FunParamContextProvider=({ children,value={funParams:undefined}})=><FunParamContext.Provider value={value}>{children}</FunParamContext.Provider>;

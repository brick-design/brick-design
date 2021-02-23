import React, { createContext } from 'react';

export const StaticContext=createContext({pageConfig:{},componentsMap:{},props:{},options:undefined});
export const StaticContextProvider=({ children,value})=><StaticContext.Provider value={value}>{children}</StaticContext.Provider>;

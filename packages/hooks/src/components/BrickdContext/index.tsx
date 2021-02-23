import React, { createContext } from 'react';

export const BrickdContext=createContext({setPageState:_=>_,pageState:{}});
export const BrickdContextProvider=({ children,value})=><BrickdContext.Provider value={value}>{children}</BrickdContext.Provider>;

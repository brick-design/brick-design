import React, { createContext, ProviderProps } from 'react';

export const PropsContext = createContext({});

export const PropsProvider = (props: ProviderProps<any>) => {
  return <PropsContext.Provider {...props} />;
};

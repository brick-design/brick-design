import React, { createContext, ProviderProps } from 'react';

export const BrickStoreContext = createContext(null);

export const BrickStoreProvider = (props: ProviderProps<any>) => {
  return <BrickStoreContext.Provider {...props} />;
};

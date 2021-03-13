import React, { createContext, ProviderProps } from 'react';

export const MapNodeContext = createContext(null);
export const MapNodeContextProvider = (props: ProviderProps<any>) => (
  <MapNodeContext.Provider {...props} />
);

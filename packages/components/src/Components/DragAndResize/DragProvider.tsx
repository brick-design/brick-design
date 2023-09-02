import React, { createContext, ProviderProps, useContext } from 'react';

export const DragContext = createContext(null);

export const DragProvider = (props: ProviderProps<any>) => {
	return <DragContext.Provider {...props} />;
};

export function useDragChange(){
	return useContext(DragContext);
}

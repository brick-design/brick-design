import { createContext } from 'react';
import { BrickStore } from '@brickd/hooks';

export type ZoomStateType = {
  scale: number;
};
export const ZoomContext = createContext<BrickStore<ZoomStateType>>(null);
export const ZoomProvider = ZoomContext.Provider;

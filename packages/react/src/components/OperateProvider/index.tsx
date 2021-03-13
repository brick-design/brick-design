import React, { createContext, ProviderProps } from 'react';
import { BrickStore } from '@brickd/hooks';

export type OperateStateType = {
  hoverNode?: HTMLElement;
  selectedNode?: HTMLElement;
  dropNode?: HTMLElement;
  isModal?: boolean;
  dragKey?: string;
  operateHoverKey?: string;
  operateSelectedKey?: string;
};
export const OperateContext = createContext<BrickStore<OperateStateType>>(null);
export const OperateProvider = (
  props: ProviderProps<BrickStore<OperateStateType>>,
) => {
  return <OperateContext.Provider {...props} />;
};

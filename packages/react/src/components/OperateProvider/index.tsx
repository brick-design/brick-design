import React, { createContext, ProviderProps } from 'react';
import { BrickStore } from '@brickd/hooks';

export type OperateStateType = {
  hoverNode?: HTMLElement;
  selectedNode?: HTMLElement;
  dropNode?: HTMLElement;
  isModal?: boolean;
  operateHoverKey?: string;
  operateSelectedKey?: string;
  index?: number;
  isDropAble?:boolean
  isLock?:boolean
};
export const OperateContext = createContext<BrickStore<OperateStateType>>(null);
export const OperateProvider = (
  props: ProviderProps<BrickStore<OperateStateType>>,
) => {
  return <OperateContext.Provider {...props} />;
};

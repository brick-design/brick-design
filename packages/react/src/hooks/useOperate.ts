import { useCallback, useContext } from 'react';
import { BrickStore } from '@brickd/hooks';
import {
  OperateContext,
  OperateStateType,
} from '../components/OperateProvider';

export function useOperate(isModal?: boolean) {
  const operateStore = useContext<BrickStore<OperateStateType>>(OperateContext);
  const setOperateState = useCallback((operateState: OperateStateType, executeKey?: string) => {
    operateState.isModal = isModal;
    operateStore.setPageState(operateState,undefined,executeKey);
  }, []);

  return {
    setOperateState,
    getOperateState: operateStore.getPageState,
    setSubscribe: operateStore.subscribe,
  };
}

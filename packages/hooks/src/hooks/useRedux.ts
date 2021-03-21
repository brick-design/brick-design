import { useMemo, useRef } from 'react';
import { isEqual } from 'lodash';
import { BrickStore } from '../utils';

export function useRedux(propsState: any) {
  const brickStore = useRef(new BrickStore(propsState)).current;
  const prevPropsState = useRef(propsState).current;
  useMemo(() => {
    if (!isEqual(prevPropsState, propsState))
      brickStore.setPageState(propsState, true);
    return;
  }, [propsState, prevPropsState]);
  return brickStore;
}

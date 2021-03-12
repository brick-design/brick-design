import { useMemo, useRef } from 'react';
import { isEqual } from 'lodash';
import { BrickStore } from '../utils';

export function useRedux(propsState: any) {
  const brickStore = useRef(new BrickStore(propsState));
  const prevPropsState = useRef(propsState);
  useMemo(() => {
    if (!isEqual(prevPropsState.current, propsState))
      brickStore.current.setPageState(propsState, true);
    return;
  }, [propsState, prevPropsState.current]);
  return brickStore.current;
}

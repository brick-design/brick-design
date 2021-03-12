import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { isEqual } from 'lodash';

export function useBrickdState(propsState: any) {
  const [brickdState, setBrickdState] = useState(propsState);
  const prevPropsState = useRef(propsState);

  useEffect(() => {
    if (propsState && !isEqual(propsState, prevPropsState.current)) {
      prevPropsState.current = propsState;
      setBrickdState(propsState);
    }
  }, [propsState, prevPropsState.current, setBrickdState]);

  const setState = useCallback(
    (newState) => setBrickdState({ ...brickdState, ...newState }),
    [brickdState, setBrickdState],
  );
  const state = useMemo(() => ({ ...brickdState, setState }), [
    setState,
    brickdState,
  ]);
  return { state, setState };
}

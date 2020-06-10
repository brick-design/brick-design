import { useContext, useLayoutEffect, useReducer, useRef } from 'react';
import { shallowEqual } from '../utils';
import { LegoContext } from '../components/LegoContext';

const handleState = (selector: string[], storeState: any) => selector.reduce((states: any, key: string) => {
  states[key] = storeState[key];
  return states;
}, {});

type ControlUpdate<T> = (prevState: T, nextState: T) => boolean

function useSelectorWithStore<T>(selector: string[], store: any, controlUpdate?: ControlUpdate<T>): T {
  const [, forceRender] = useReducer(s => s + 1, 0);
  const prevSelector = useRef<string[]>([]);
  const prevStoreState = useRef();
  const prevSelectedState = useRef<any>({});
  const storeState = store.getState();

  let selectedState: any;
  if (storeState !== prevStoreState.current) {
    selectedState = handleState(selector, storeState);
  } else {
    selectedState = prevSelectedState.current;
  }

  useLayoutEffect(() => {
    prevSelector.current = selector;
    prevStoreState.current = storeState;
    prevSelectedState.current = selectedState;
  });

  useLayoutEffect(() => {
    function checkForUpdates() {
      const storeState = store.getState();

      const nextSelectedState = handleState(prevSelector.current, storeState);

      if (shallowEqual(nextSelectedState, prevSelectedState.current) ||
        controlUpdate && !controlUpdate(prevSelectedState.current, nextSelectedState)) {
        return;
      }
      prevStoreState.current = storeState;
      prevSelectedState.current = nextSelectedState;
      forceRender();
    }
    checkForUpdates();
    const unsubscribe = store.subscribe(checkForUpdates);
    return unsubscribe;
  }, [store]);

  return selectedState;
}

export function useSelector<T, U extends string>(selector: U[], controlUpdate?: ControlUpdate<T>): T {
  const store = useContext(LegoContext);
  return useSelectorWithStore<T>(
    selector,
    store!,
    controlUpdate,
  );
}


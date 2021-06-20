import { useLayoutEffect, useRef, useContext } from 'react';
import { ALL_PROPS } from '@brickd/utils';
import { useForceRender } from './useForceRender';
import { BrickStoreContext } from '../components/BrickStoreContext';

export function get<T>(obj: any, path: string): T {
  return path.split('.').reduce((a, c) => a && a[c], obj) as T;
}

export function shallowEqual(objA: any, objB: any) {

  if(objA!==objB&&(typeof objA!=='object'||typeof objB!=='object')) return true
  for (const k of Object.keys(objA)) {
    if (objA[k] !== objB[k]) return false;
  }
  return true;
}

const handleState = (
  selector: string[],
  storeState: any,
  stateDeep?: string,
) => {
  if (selector.includes(ALL_PROPS)) {
    return storeState;
  }
  return selector.reduce((states: any, key: string) => {
    let selectedState = storeState[key];
    if (stateDeep) {
      key = stateDeep.split('.').pop();
      selectedState = get(selectedState, stateDeep);
    }
    states[key] = selectedState;
    return states;
  }, {});
};

export type ControlUpdate<T> = (prevState: T, nextState: T) => boolean;

function useSelectorWithStore<T>(
  selector: string[],
  store: any,
  controlUpdate?: ControlUpdate<T>,
  stateDeep?: string,
  isRoot?:boolean
): T {
  const forceRender = useForceRender();
  const prevSelector = useRef([]);
  const prevStoreState = useRef();
  const prevSelectedState = useRef({} as any);
  const storeState = store.getPageState(isRoot);
  let selectedState: any;
  if (storeState&&storeState !== prevStoreState.current) {
    selectedState = handleState(selector, storeState, stateDeep);
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
      const storeState = store.getPageState(isRoot);
      const nextSelectedState =storeState? handleState(
        prevSelector.current,
        storeState,
        stateDeep,
      ):storeState;
      if (
        shallowEqual(nextSelectedState, prevSelectedState.current) ||
        (controlUpdate &&
          !controlUpdate(prevSelectedState.current, nextSelectedState))
      ) {
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

  return store.isPageStore
    ? {
        ...selectedState,
        setPageState: store.setPageState,
        getPageState: store.getPageState,
      }
    : selectedState;
}

export function useBrickSelector<T, U extends string>(
  selector: U[],
  controlUpdate?: ControlUpdate<T>,
  stateDeep?: string,
  context: any = BrickStoreContext,
  isRoot?:boolean
): T {
  const store = useContext(context);
  return useSelectorWithStore<T>(selector, store!, controlUpdate, stateDeep,isRoot);
}

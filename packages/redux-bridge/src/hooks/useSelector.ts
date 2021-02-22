import { REDUX_BRIDGE } from '../configs';

export function get<T>(obj: any, path: string): T {
	return path
		.split('.')
		.reduce((a, c) => (a && a[c]), obj) as T;
}

export function shallowEqual(objA: any, objB: any) {
	for (const k of Object.keys(objA)) {
		if (objA[k] !== objB[k]) return false;
	}
	return true;
}

const handleState = (selector: string[], storeState: any,stateDeep?:string) =>
	selector.reduce((states: any, key: string) => {
		let  selectedState= storeState[key];
		if(stateDeep){
			key=stateDeep.split('.').pop();
			selectedState=get(selectedState,stateDeep);
		}
		states[key] = selectedState;
		return states;
	}, {});

type ControlUpdate<T> = (prevState: T, nextState: T) => boolean

function useSelectorWithStore<T>(
	selector: string[],
	store: any,
	controlUpdate?: ControlUpdate<T>,
	stateDeep?: string
): T {
	const { useLayoutEffect, useReducer, useRef } = REDUX_BRIDGE.framework;
	const [, forceRender] = useReducer((s) => s + 1, 0);
	const prevSelector = useRef([]);
	const prevStoreState = useRef();
	const prevSelectedState = useRef({});
	const storeState = store.getPageState();
	let selectedState: any;
	if (storeState !== prevStoreState.current) {
		selectedState = handleState(selector, storeState,stateDeep);
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
			const storeState = store.getPageState();
			const nextSelectedState = handleState(prevSelector.current, storeState,stateDeep);
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

	return selectedState;
}

export function useSelector<T, U extends string>(
	selector: U[],
	controlUpdate?: ControlUpdate<T>,
	stateDeep?: string
): T {
	const { useContext } = REDUX_BRIDGE.framework;
	const store = useContext(REDUX_BRIDGE.context);
	return useSelectorWithStore<T>(selector, store!, controlUpdate,stateDeep);
}

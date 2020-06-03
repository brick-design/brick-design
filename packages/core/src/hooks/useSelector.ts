import { useContext, useLayoutEffect, useReducer, useRef } from 'react';
import { shallowEqual } from '../utils';
import get from 'lodash/get';
import LegoContext from '../components/LegoContext';


const handleState = (selector: string[], storeState: any) => selector.reduce((states: any, key: string) => {
    states[key] = storeState[key]
    return states
}, {})

type ControlUpdate<T> = (prevState: T, nextState: T) => boolean

function useSelectorWithStore<T>(selector: string[], store: any, controlUpdate?: ControlUpdate<T>, stateDeep?: string) {
    const [, forceRender] = useReducer(s => s + 1, 0)
    const prevSelector = useRef<string[]>([])
    const prevStoreState = useRef()
    const prevSelectedState = useRef<any>({})
    let storeState = store.getState()
    if(stateDeep){
        storeState=  get(storeState,stateDeep,storeState)
    }
    let selectedState: any
    if (storeState !== prevStoreState.current || !shallowEqual(selector, prevSelector.current)) {
        selectedState = handleState(selector, storeState)
    } else {
        selectedState = prevSelectedState.current
    }

    useLayoutEffect(() => {
        prevSelector.current = selector
        prevStoreState.current = storeState
        prevSelectedState.current = selectedState
    })

    useLayoutEffect(() => {
        function checkForUpdates() {
            let storeState = store.getState()
            if(stateDeep){
                storeState= get(storeState,stateDeep,storeState)
            }
            const nextSelectedState = handleState(prevSelector.current, storeState)

            if (shallowEqual(nextSelectedState, prevSelectedState.current)||
                controlUpdate&&!controlUpdate(prevSelectedState.current, nextSelectedState)){
                return
            }
            prevStoreState.current = storeState
            prevSelectedState.current = nextSelectedState
                forceRender()
        }
        const unsubscribe = store.subscribe(checkForUpdates)
        return unsubscribe
    }, [store])

    return selectedState as T
}

export function useSelector<T>(selector: string[], controlUpdate?: ControlUpdate<T>, stateDeep?: string) {
    if (process.env.NODE_ENV !== 'production' && !selector) {
        throw new Error(`You must pass a selector to useSelector`)
    }
    const store = useContext(LegoContext)
    return useSelectorWithStore(
        selector,
        store!,
        controlUpdate,
        stateDeep
    )
}


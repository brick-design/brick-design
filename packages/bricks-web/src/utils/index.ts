import { useEffect, useRef } from 'react';
import { HookState } from '../BrickTree/SortItem';

export function usePrevious<T>(value: any) {
    const ref = useRef<T>();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}


export function controlUpdate(prevState: HookState, nextState: HookState, key: string) {

    if (prevState.componentConfigs[key] === nextState.componentConfigs[key]) {
        const {selectedKey: prevSelectedKey,propName:prevPropName} = prevState.selectedInfo || {}
        const {selectedKey,propName} = nextState.selectedInfo || {}
        return prevSelectedKey == key &&
            (selectedKey !== key||selectedKey === key&&prevPropName!==propName) ||
            prevSelectedKey !== key && selectedKey === key ||
            prevState.hoverKey === key && nextState.hoverKey !== key ||
            prevState.hoverKey !== key && nextState.hoverKey === key;


    }
    return true
}

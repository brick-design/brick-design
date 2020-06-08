import { STATE_PROPS, useSelector } from 'brickd-core';
import { HookState } from '../common/handleFuns';

export const stateSelector:STATE_PROPS[]=['componentConfigs','propsConfigSheet']

export function controlUpdate(prevState: HookState, nextState: HookState, key: string) {
    return prevState.componentConfigs[key] === nextState.componentConfigs[key]
}
export function useCommon(key: string) {
    const {componentConfigs,propsConfigSheet} = useSelector<HookState>(stateSelector,
        (prevState, nextState) => controlUpdate(prevState, nextState, key))
    return {
        propsConfigSheet,
        componentConfigs,
    }
}

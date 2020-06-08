import { ComponentConfigsType, PropsConfigSheetType, STATE_PROPS, useSelector } from 'brickd-core';

export type HookState = {
    componentConfigs: ComponentConfigsType,
    propsConfigSheet:PropsConfigSheetType
}

export function controlUpdate(prevState: HookState, nextState: HookState, key: string) {
    return prevState.componentConfigs[key] !== nextState.componentConfigs[key]
}
export function useCommon(key: string) {
    const {componentConfigs,propsConfigSheet} = useSelector<HookState,STATE_PROPS>(['componentConfigs','propsConfigSheet'],
        (prevState, nextState) => controlUpdate(prevState, nextState, key))
    return {
        propsConfigSheet,
        componentConfigs,
    }
}

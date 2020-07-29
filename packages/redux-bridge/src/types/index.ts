export interface ContextType {
	Provider: any
	displayName?: string
}

export type CreateContextType = (defaultValue: any) => ContextType

export type CreateElementType = (
	type: any,
	props?: any,
	...children: any
) => any

export type UseContextType = (context: ContextType) => any

type EffectCallback = () => void | (() => void | undefined)
type DependencyList = ReadonlyArray<any>

export type UseLayoutEffectType = (
	effect: EffectCallback,
	deps?: DependencyList,
) => void

export type UseReducerType = (
	reducer: any,
	initializerArg: any,
	initializer?: any,
) => [any, any]

interface MutableRefObject {
	current: any
}

export type UseRefType = (initialValue?: any) => MutableRefObject

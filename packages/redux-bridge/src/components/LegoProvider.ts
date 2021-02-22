import { REDUX_BRIDGE } from '../configs';

export interface LegoProviderProps{
	children?: any
	value?:any
}

export function LegoProvider({ children,...rest }: LegoProviderProps = {}) {
	if (!REDUX_BRIDGE.framework) {
		throw Error('未初始化Framework');
	}
	const { createContext, createElement } = REDUX_BRIDGE.framework;

	if (!REDUX_BRIDGE.context) {
		REDUX_BRIDGE.context = createContext(null);
	}
	return createElement(
		REDUX_BRIDGE.context.Provider,
		rest,
		children,
	);
}

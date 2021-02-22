import {
	ContextType,
	CreateContextType,
	CreateElementType,
	UseContextType,
	UseLayoutEffectType,
	UseReducerType,
	UseRefType,
} from '../types';

interface FrameworkType {
	createContext: CreateContextType
	createElement: CreateElementType
	useContext: UseContextType
	useLayoutEffect: UseLayoutEffectType
	useReducer: UseReducerType
	useRef: UseRefType
}

interface ReduxBridgeType {
	framework: FrameworkType | null
	context: ContextType | null
}

export const REDUX_BRIDGE: ReduxBridgeType = {
	framework: null,
	context: null,
};
export const initFramework = (framework: FrameworkType) =>
	(REDUX_BRIDGE.framework = framework);

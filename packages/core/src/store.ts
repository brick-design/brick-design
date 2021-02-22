import { Action, AnyAction, createStore, Store } from 'redux';
import { reducer, ReducerType } from './reducers';
import { ConfigType } from './types';
import {
	combineReducers,
	getBrickdConfig,
	getPageState,
	getStore,
	setBrickdConfig,
	setStore,
	setWarn,
	WarnType,
} from './utils';

export interface BrickdStoreType<T,U extends Action = AnyAction> extends Store<T,U>{
	getPageState:any
}

export function createLegStore(
	config: ConfigType,
	customReducer?: ReducerType,
	warn?:WarnType
) {
	if(warn) setWarn(warn);
	if (getStore()) return getStore();

	if (getBrickdConfig() && !config) {
		throw Error('config未初始化');
	} else if (!getBrickdConfig()) {
		setBrickdConfig(config);
	}
	const store = createStore(
		combineReducers(reducer, customReducer),
		(window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
			(window as any).__REDUX_DEVTOOLS_EXTENSION__(),
	);

	setStore({...store,getPageState});
	return store;
}

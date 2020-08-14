import * as React from 'react';
import { initFramework, LegoProvider, REDUX_BRIDGE } from '@brickd/redux-bridge';
import {
	ConfigType,
	createLegStore,
	ReducerType,
	StateType,
} from '@brickd/core';

initFramework(React);

interface BrickProviderType {
	initState?: Partial<StateType>
	config: ConfigType
	customReducer?: ReducerType
	children?: any
}

function BrickProvider(props: BrickProviderType) {
	const { initState, config, customReducer, children } = props;
	if (!REDUX_BRIDGE.store) {
		REDUX_BRIDGE.store = createLegStore(initState, config, customReducer);
	}
	return <LegoProvider>{children}</LegoProvider>;
}

export default React.memo(BrickProvider);

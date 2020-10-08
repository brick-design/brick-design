import * as React from 'react';
import { initFramework, LegoProvider, REDUX_BRIDGE } from '@brickd/redux-bridge';
import {
	ConfigType,
	createLegStore,
	ReducerType,
	StateType,
	LegoBridgeType
} from '@brickd/core';

initFramework(React);

interface BrickProviderType extends Omit<LegoBridgeType, 'store'>{
	initState?: Partial<StateType>
	config: ConfigType
	customReducer?: ReducerType
	children?: any
}

function BrickProvider(props: BrickProviderType) {
	const { initState, config, customReducer, children,warn } = props;
	if (!REDUX_BRIDGE.store) {
		REDUX_BRIDGE.store = createLegStore(initState, config, customReducer,warn);
	}
	return <LegoProvider>{children}</LegoProvider>;
}

export default React.memo(BrickProvider);

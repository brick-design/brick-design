import * as React from 'react';
import { useEffect } from 'react';
import { initFramework, LegoProvider } from '@brickd/redux-bridge';
import {
	ConfigType,
	createLegStore,
	ReducerType,
	 getStore,
 WarnType,
	cleanStateCache} from '@brickd/core';


initFramework(React);

interface BrickProviderType{
	config: ConfigType
	customReducer?: ReducerType
	children?: any
	warn?:WarnType;
}

function BrickProvider(props: BrickProviderType) {
	const {config, customReducer, children,warn } = props;
	useEffect(()=>{
		return ()=>cleanStateCache();
	},[]);
	if (!getStore()) {
		createLegStore(config, customReducer,warn);

	}
	return <LegoProvider value={getStore()}>{children}</LegoProvider>;
}

export default React.memo(BrickProvider);

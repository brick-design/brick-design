import React, {
	memo,
	useMemo,
} from 'react';

import {
	useService,
	BrickStoreProvider,
	StaticContextProvider,
	FunParamContextProvider, useRedux,
} from '@brickd/hooks';
import {get} from 'lodash';
import Container from './warppers/Container';
import NoneContainer from './warppers/NoneContainer';

interface BrickRenderProps  {
	componentsMap:any,
	pageConfig?:any,
	pageStateConfig?:any,
	options?:any
	[propName:string]:any
}


function BrickRender(brickdProps: BrickRenderProps) {
	const ROOT_KEY='0';
	const {componentsMap,pageConfig,pageStateConfig,options,...props} = brickdProps;
	const {state,api}=pageStateConfig||{};
	const brickdStore=useRedux(state);
	const staticState=useMemo(()=>({pageConfig,componentsMap,props,options}),[pageConfig,componentsMap,props,options]);
	const rootComponent=get(pageConfig,ROOT_KEY);
	useService(brickdStore.getPageState(),api);
	if(!rootComponent) return null;
	return (<BrickStoreProvider value={brickdStore}>
		<FunParamContextProvider value={undefined}>
		<StaticContextProvider value={staticState}>
		{rootComponent.childNodes?<Container renderKey={ROOT_KEY}/>:<NoneContainer renderKey={ROOT_KEY}/>}
		</StaticContextProvider>
			</FunParamContextProvider>
	</BrickStoreProvider>);
}

export default memo(BrickRender);

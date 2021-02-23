import React, {
	memo,
	useMemo,
} from 'react';

import {
	useService,
	BrickdContextProvider,
	StaticContextProvider,
	useBrickdState,
	FunParamContextProvider,
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
	const {state:brickdState}=useBrickdState(state,true);
	const staticState=useMemo(()=>({pageConfig,componentsMap,props,options}),[pageConfig,componentsMap,props,options]);
	const rootComponent=get(pageConfig,[ROOT_KEY]);
	useService(brickdState,api);
	if(!rootComponent) return null;
	return (<BrickdContextProvider value={brickdState}>
		<FunParamContextProvider value={undefined}>
		<StaticContextProvider value={staticState}>
		{rootComponent.childNodes?<Container renderKey={ROOT_KEY}/>:<NoneContainer renderKey={ROOT_KEY}/>}
		</StaticContextProvider>
			</FunParamContextProvider>
	</BrickdContextProvider>);
}

export default memo(BrickRender);

import { useContext } from 'react';
import { useComponentProps, useComponentState, useHiddenComponent, useService } from '@brickd/hooks';
import { setState, VirtualDOMType } from '@brickd/core';
import { useGetState } from './useGetState';
import { FunParamContext } from '../components/FunParamContext';

export function useCommon(key:string,vNode:VirtualDOMType){
	const { props:prevProps, state,api,isHidden} = vNode;
	const {funParams} =useContext(FunParamContext);
	const pageState=useGetState(key,funParams);
	useService(key,pageState,setState,api);
	useComponentState(key,setState,state);
	const props=useComponentProps(prevProps,pageState);
	const hidden=useHiddenComponent(pageState,isHidden);
	return {props,hidden};

}

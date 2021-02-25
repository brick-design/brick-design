import { useMemo } from 'react';
import { getStateFields } from '@brickd/utils';
import { useGetState } from './useGetState';
import { useService } from './useService';
import { useComponentProps } from './useComponentProps';
import { useHiddenComponent } from './useHiddenComponent';

export function useCommon(vNode:any,rest:any){
	const { props:prevProps, state,api,isHidden} = vNode;
	const selector=useMemo(()=>getStateFields({prevProps,api,isHidden}),[prevProps,api,isHidden]);

	const pageState=useGetState(state,selector);
	useService(pageState,api);
	const props=useComponentProps(prevProps,pageState,rest);
	const hidden=useHiddenComponent(pageState,isHidden);
	return {props,hidden};
}

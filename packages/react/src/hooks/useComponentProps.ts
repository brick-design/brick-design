import {  useMemo } from 'react';
import { dataMapping } from '@brickd/utils';
import { useGetState } from './useGetState';

export function useComponentProps(prevProps:any,key:string){
	const pageState=useGetState(key);
	const props=useMemo(()=>dataMapping(prevProps,pageState),[pageState]);
	return props;
}

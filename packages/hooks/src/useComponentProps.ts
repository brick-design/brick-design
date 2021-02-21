import {  useMemo } from 'react';
import { dataMapping } from '@brickd/utils';

export function useComponentProps(prevProps:any,pageState:any){
	const props=useMemo(()=>dataMapping(prevProps,pageState),[pageState]);
	return props;
}

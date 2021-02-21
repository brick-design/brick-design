import {  evalExpression, tokenize } from '@brickd/utils';
import { useGetState } from './useGetState';

export function useHiddenComponent(key:string,isHidden?:string){
	const pageState=useGetState(key);
	return isHidden&&isHidden.includes('$')?tokenize(isHidden,pageState):evalExpression(isHidden,pageState);

}

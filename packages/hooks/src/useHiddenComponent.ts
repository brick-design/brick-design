import {  evalExpression, tokenize } from '@brickd/utils';

export function useHiddenComponent(pageState:any,isHidden?:string){
	return isHidden&&isHidden.includes('$')?tokenize(isHidden,pageState):evalExpression(isHidden,pageState);

}

import { useCallback } from 'react';

import { useSelector } from './useSelector';
import { isAllowAdd, isNeedJudgeFather } from '../utils';

export function useDropAble(componentName:string){
	const controlUpdate=useCallback(()=>{
		if(isNeedJudgeFather()){
			return isAllowAdd(componentName);
		}
		return  false;
	},[]);
	useSelector(['dragSource'],controlUpdate);
}

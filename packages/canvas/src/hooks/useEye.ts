import { useEffect, useState } from 'react';
import { useOperate } from './useOperate';

export function useEye(key:string){
	const [isShow,setIsShow]=useState(true);
	const {setSubscribe}=useOperate();
	console.log('useEye>>>>>>>>>>',key,isShow);
	useEffect(()=>{
		const changeIsShow=()=>{
			setIsShow(!isShow);
		};
		const unSubscribe=setSubscribe(changeIsShow,key);
		return unSubscribe;
	},[setIsShow,isShow]);
	return isShow;
}

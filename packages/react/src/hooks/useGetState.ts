import { useEffect, useMemo } from 'react';
import { useSelector } from '@brickd/redux-bridge';
import { removeState } from '@brickd/core';

export function useGetState(key:string){
	const selectState=useSelector(['pageState'],undefined,key);
	const componentState=selectState[key]||{};
	const {state={}}=useSelector(['pageState'],undefined,'state');
	const resultState= useMemo(()=>({...state,...componentState}),[state,componentState]);
	useEffect(()=>{
		return ()=>removeState({key});
	},[]);
	return resultState;
}

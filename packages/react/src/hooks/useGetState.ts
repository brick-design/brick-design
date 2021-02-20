import { useEffect, useMemo } from 'react';
import { useSelector } from '@brickd/redux-bridge';
import { removeState, setState } from '@brickd/core';

export function useGetState(key:string){
	const selectState=useSelector(['pageState'],()=>true,key);
	const componentState=selectState[key]||{};
	const {state={}}=useSelector(['pageState'],()=>true,'state');
	const resultState= useMemo(()=>new Proxy({...state,...componentState},{
		get: function (target, propKey, receiver) {
			return Reflect.get(target, propKey, receiver);
		},
		set: function (target, propKey, value, receiver) {
			let stateKey=key;
			if(propKey in state){
				stateKey='state';
			}
			setState({[stateKey]:{[propKey]:value}});
			return Reflect.set(target, propKey, value, receiver);
		}
	}),[state,componentState]);
	useEffect(()=>{
		return ()=>removeState({key});
	},[]);
	return resultState;
}

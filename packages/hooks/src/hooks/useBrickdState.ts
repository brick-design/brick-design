import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { isEqual } from 'lodash';

export function useBrickdState(propsState:any,isRoot?:boolean){

	const [brickdState,setBrickdState]=useState(propsState);
	const prevPropsState= useRef(propsState);

	useEffect(()=>{
		if(!isEqual(propsState,prevPropsState.current)){
			prevPropsState.current=propsState;
			setBrickdState(state);
		}
	},[propsState,prevPropsState.current,setBrickdState]);

	const setState=useCallback((newState)=>setBrickdState({...brickdState,...newState}),[brickdState,setBrickdState]);
	const state=useMemo(()=>{
		if (isRoot) return {...brickdState,setPageState:setState};
		return {...brickdState,setState};
	},[brickdState,setState]);

	return {state,setState};
}

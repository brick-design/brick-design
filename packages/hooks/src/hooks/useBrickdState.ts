import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { isEqual } from 'lodash';

export function useBrickdState(propsState:any,isRoot?:boolean){

	const [brickdState,setBrickdState]=useState(propsState);
	const prevPropsState= useRef(propsState);

	useEffect(()=>{
		if(propsState&&!isEqual(propsState,prevPropsState.current)){
			prevPropsState.current=propsState;
			setBrickdState(propsState);
		}
	},[propsState,prevPropsState.current,setBrickdState]);

	const setState=useCallback((newState)=>setBrickdState({...brickdState,...newState}),[brickdState,setBrickdState]);
	const state=useMemo(()=>isRoot?{...brickdState,setPageState:setState}:{...brickdState,setState},[setState,brickdState]);
	return {state,setState};
}

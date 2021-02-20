import {useEffect} from 'react';
import { PlainObjectType, setState } from '@brickd/core';

export function useComponentState(key:string,state?: PlainObjectType){
	useEffect(()=>{
		if(state){
			setState({[key]:state});
		}
	},[]);
}

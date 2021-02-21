import { useEffect, useRef } from 'react';
import { PlainObjectType, setState } from '@brickd/core';
import {isEqual} from 'lodash';

export function useComponentState(key:string,props:any,state?: PlainObjectType){
	const prevState= useRef(state);
	useEffect(()=>{
		if(!isEqual(state,prevState.current)){
			setState({[key]:state});
		}
	},[state,prevState]);
}

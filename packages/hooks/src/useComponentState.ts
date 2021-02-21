import { useEffect, useRef } from 'react';
import {isEqual} from 'lodash';
import { PlainObject } from '@brickd/utils';
import { SetStateType } from './types';

export function useComponentState(key:string,setState:SetStateType,state?:PlainObject){
	const prevState= useRef(state);
	useEffect(()=>{
		if(!isEqual(state,prevState.current)){
			setState({[key]:state});
		}
	},[state,prevState]);
}

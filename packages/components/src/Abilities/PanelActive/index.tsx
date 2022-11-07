import React, { createContext, useContext, useEffect, useRef } from 'react';
import { BrickStore } from '@brickd/hooks';
import {get} from 'lodash';
import { usePrevious } from '../../utils';

const PanelActiveContext=createContext({});
export default function PanelActive(props){
	const {children}=props;
	const store=useRef(new BrickStore({})).current;
	return <PanelActiveContext.Provider value={store}>
		{children}
	</PanelActiveContext.Provider>;
}


function handleStates(state:any,key:string){
	for(const k of Object.keys(state)){
		if(state[k]){
			state[k]=false;
			break;
		}
	}
	state[key]=true;
	return {...state};
}

export function useActive(key:string,targetRef:any){
	const store=useContext(PanelActiveContext) as BrickStore<any>;
	const prevStatus= usePrevious(get(store.getPageState(),key));
	useEffect(()=>{
		const unSubscribe= store.subscribe(()=>{
			const status=get(store.getPageState(),key);
			if(prevStatus!==status){
				// eslint-disable-next-line no-empty
				if(status){
					targetRef.current.style.zIndex='2';
				}else {
					targetRef.current.style.zIndex='1';
				}
			}

		});
		return unSubscribe;
	},[prevStatus]);

	const setActive=()=>{
		const states= store.getPageState();
		store.setPageState(handleStates(states,key),true);
	};

	return setActive;
}

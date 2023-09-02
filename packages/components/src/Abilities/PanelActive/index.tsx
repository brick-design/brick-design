import React, { createContext, RefObject, useContext, useEffect, useRef } from 'react';
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

export function useActiveParent(keys:string[],targetRef:RefObject<HTMLDivElement>) {
	const store = useContext(PanelActiveContext) as BrickStore<any>;

	useEffect(() => {
		return store.subscribe(() => {
			const state = store.getPageState();
			console.log('useEffect>>>>>>',state);
			for (const k of keys) {
				if (state[k]) {
					console.log('state>>>>>>',state[k]);
					return targetRef.current.style.zIndex = '10000';
				}
				targetRef.current.style.zIndex = '0';
			}
		});
	});
}
export function useActive(key:string,targetRef:RefObject<HTMLDivElement>){
	const store=useContext(PanelActiveContext) as BrickStore<any>;
	const prevStatus= usePrevious(get(store.getPageState(),key));
	useEffect(()=>{
		const unSubscribe= store.subscribe(()=>{
			const status=get(store.getPageState(),key);
			if(prevStatus!==status){
				// eslint-disable-next-line no-empty
				if(status){
					targetRef.current.style.zIndex='1000';
				}else {
					targetRef.current.style.zIndex='0';
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

import { useEffect } from 'react';
import { setState, LEGO_BRIDGE,ApiType } from '@brickd/core';
import {get,isArray,map} from 'lodash';
import {  wrapFetcher } from '@brickd/utils';
import { useGetState } from './useGetState';

export function useService(key:string,api?:ApiType){
const state=useGetState(key);
	useEffect(()=>{
		const fetchData= async()=>{
			const fetcher=get(LEGO_BRIDGE,'config.fetcher');
			if(fetcher&&api){
				let newState;
				if(isArray(api)){
					const stateArr=await Promise.allSettled(map(api,(param)=>{
						return 	wrapFetcher(fetcher)(param,state);
					}));
					newState= stateArr.reduce((a,b)=>({...a,...b}));
				}else{
					newState= await wrapFetcher(fetcher)(api,state);
				}
				setState({[key]:newState});
			}
		};
		fetchData();
	},[state,api]);
}

import { useEffect, useRef } from 'react';
import { setState, LEGO_BRIDGE, } from '@brickd/core';
import {get,isEmpty} from 'lodash';
import { ApiType, fetchData } from '@brickd/utils';
import { useGetState } from './useGetState';
import { defaultFetcher } from '../utils';

const getFetchData= async(prevApi:ApiType|undefined,nextApi:ApiType|undefined, prevData: any, nextData: any, key: string, isFirst?: boolean, options?: object)=>{
	const fetcher=get(LEGO_BRIDGE,'config.fetcher')||defaultFetcher;
	if(!nextApi) return;
	const result= await fetchData(fetcher,prevApi,nextApi,prevData,nextData,key,isFirst,options);
	console.log('result>>>>>>>',result);
	if(!isEmpty(result)){
		setState(result);
	}
};
export function useService(key:string,api?:ApiType, options?: object){
const state=useGetState(key);
const prevState=useRef(state);
const prevApi=useRef(api);
	useEffect(()=>{
		getFetchData(undefined,api,undefined,state,key,true,options);
	},[]);

	useEffect(()=>{
		if(prevState.current){
			getFetchData(prevApi.current,api,prevState.current,state,key,false,options);
		}
	},[prevApi,api,prevState,state]);
}

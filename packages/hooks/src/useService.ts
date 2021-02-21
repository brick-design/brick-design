import { useEffect, useRef } from 'react';
import {isEmpty} from 'lodash';
import { ApiType, fetchData, FetcherType } from '@brickd/utils';
import { SetStateType } from './types';

const getFetchData= async(prevApi:ApiType|undefined,nextApi:ApiType|undefined, prevData: any, nextData: any, key: string,setState:SetStateType, isFirst?: boolean, options?: object,fetcher?:FetcherType)=>{
	if(!nextApi) return;
	const result= await fetchData(fetcher,prevApi,nextApi,prevData,nextData,key,isFirst,options);
	if(!isEmpty(result)){
		setState(result);
	}
};
export function useService(key:string,state:any,setState:any,api?:ApiType, options?: object){
const prevState=useRef(state);
const prevApi=useRef(api);
	useEffect(()=>{
		getFetchData(undefined,api,undefined,state,key,setState,true,options);
	},[]);

	useEffect(()=>{
		if(prevState.current){
			getFetchData(prevApi.current,api,prevState.current,state,key,setState,false,options);
		}
	},[prevApi,api,prevState,state]);
}

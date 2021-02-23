import {  useContext, useMemo} from 'react';
import { useBrickdState } from './useBrickdState';
import { BrickdContext } from '../components/BrickdContext';
import { FunParamContext } from '../components/FunParamContext';
import { StaticContext } from '../components/StaticContext';


export function useGetState(propsState:any){
const {state}=useBrickdState(propsState);

const brickdState=useContext(BrickdContext);
const {props}=useContext(StaticContext);
const funParams=useContext(FunParamContext);

	return useMemo(()=>new Proxy({...brickdState,...state,funParams,props},{
		get: function (target, propKey, receiver) {
			return Reflect.get(target, propKey, receiver);
		},
		set: function (target, propKey, value, receiver) {
			if(propKey in brickdState){
				brickdState.setPageState({[propKey]:value});
			}else {
				state.setState({[propKey]:value});
			}
			return Reflect.set(target, propKey, value, receiver);
		}
	}),[state,brickdState,funParams,props]);
}

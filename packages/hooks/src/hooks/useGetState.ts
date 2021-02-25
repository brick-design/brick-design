import {  useContext, useMemo} from 'react';
import { useBrickdState } from './useBrickdState';
import { useBrickSelector } from './useBrickSelector';
import { FunParamContext } from '../components/FunParamContext';
import { StaticContext } from '../components/StaticContext';


export function useGetState(propsState:any,selector:string[]){
const {state}=useBrickdState(propsState);
const brickdState =useBrickSelector<any,string>(selector);

const {props}=useContext(StaticContext);
const funParams=useContext(FunParamContext);
	return useMemo(()=>new Proxy({...brickdState,...state,funParams,props},{
		get: function (target, propKey, receiver) {
			return Reflect.get(target, propKey, receiver);
		},
		set: function (target, propKey, value, receiver) {
			console.log('parmam>>>>>>>>',propKey,value);
			if(propKey in brickdState){
				brickdState.setPageState({[propKey]:value});
			}else {
				state.setState({[propKey]:value});
			}
			return Reflect.set(target, propKey, value, receiver);
		}
	}),[state,brickdState,funParams,props]);
}

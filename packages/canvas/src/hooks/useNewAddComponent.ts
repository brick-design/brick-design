import { useEffect } from 'react';
import { useBrickObserver, useForceRender } from '@brickd/hooks';
import {getDragKey} from '../utils';

export function useNewAddComponent(key:string){
	const forceRender=useForceRender();
	const {addSubject,cleanSubject,executeSubject}=useBrickObserver();
	useEffect(()=>{
		const dragKey=getDragKey();
		if(dragKey===key){
			addSubject({[key]:forceRender});
		}
		return ()=>{
			if(dragKey===key){
				cleanSubject();
			}
		};

	},[]);
	return executeSubject;
}

import React, { createContext,  } from 'react';
import { BrickObserver } from '../../utils/BrickOberver';

let BRICK_OBSERVER:BrickObserver|null=null;
export const setBrickObserver=(brickObserver:BrickObserver|null)=>BRICK_OBSERVER=brickObserver;
export const BrickObserverContext=createContext<BrickObserver>(null);


export const BrickObserverProvider=(props:any)=>{
	if(!BRICK_OBSERVER){
		BRICK_OBSERVER=new BrickObserver();
	}
	return <BrickObserverContext.Provider value={BRICK_OBSERVER} {...props}/>;
};

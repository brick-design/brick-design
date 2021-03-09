import {each} from 'lodash';

type ListenerType=() => void

export class BrickStore<T>{
	constructor(propState?:T) {
		this.state=propState?propState:{};
	}
	isPageStore=true;
	state;
	listeners=[];
	getPageState=<T>():T=>this.state;
	setPageState=<T>(newState:T,isReplace?:boolean)=>{
		if(isReplace){
			this.state=newState;
		}else {
			this.state={...this.state,...newState};
		}
		each(this.listeners,(listener)=>listener());
	};

	subscribe=(listener: ListenerType)=> {
		let isSubscribed = true;
		this.listeners.push(listener);
		return ()=> {
			if (!isSubscribed) {
				return;
			}
			isSubscribed = false;
			const index = this.listeners.indexOf(listener);
			this.listeners.splice(index, 1);
		};
	};
}

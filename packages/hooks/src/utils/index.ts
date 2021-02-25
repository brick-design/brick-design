import {each} from 'lodash';

type ListenerType=() => void

export class BrickStore{
	constructor(propState:any) {
		this.state=propState?propState:{};
	}
	isPageStore=true;
	state={};
	listeners=[];
	getPageState=()=>this.state;
	setPageState=(newState,isReplace?:boolean)=>{
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

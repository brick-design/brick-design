import { each } from 'lodash';

type ListenerType = () => void;

export class BrickStore<T> {
  constructor(propState?:T) {
    this.state = propState||{} as T;
  }
  isPageStore = true;
  state:T;
  listeners = [];
  listenerMap={};
  getPageState = (): T => this.state;
  setPageState = (newState: T, isReplace?: boolean,executeKey?:string) => {
    if (isReplace) {
      this.state = newState;
    } else {
      this.state = { ...this.state, ...newState };
    }
    each(this.listeners, (listener) => listener());

    if(executeKey&&this.listenerMap[executeKey]){
      this.listenerMap[executeKey]();
    }
  };

  subscribe = (listener: ListenerType,key?:string) => {
    let isSubscribed = true;
    if(!key){
      this.listeners.push(listener);
    }else {
      this.listenerMap[key]=listener;
    }
    return () => {
      if (!isSubscribed) {
        return;
      }
      isSubscribed = false;
      if(!key){
        const index = this.listeners.indexOf(listener);
        this.listeners.splice(index, 1);
      }else {
        delete this.listenerMap[key];
      }

    };
  };
}

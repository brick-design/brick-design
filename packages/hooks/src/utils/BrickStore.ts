import { each } from 'lodash';

type ListenerType = () => void;

const unListener=(listeners:ListenerType[],listener:ListenerType)=>{
  const index = listeners.indexOf(listener);
  listeners.splice(index, 1);
};

const executeListener=(listeners:ListenerType[])=>{
  each(listeners, (listener) => listener());
};
export class BrickStore<T> {
  constructor(propState?: T) {
    this.state = propState || ({} as T);
  }
  isPageStore = true;
  state: T;
  listeners: ListenerType[] = [];
  listenerMap: { [key: string]: ListenerType[] } = {};
  getPageState = (): T => this.state;
  setPageState = (newState: T, isReplace?: boolean, executeKey?: string) => {
    if (isReplace) {
      this.state = newState;
    } else {
      this.state = { ...this.state, ...newState };
    }
    executeListener(this.listeners);

    if (executeKey && this.listenerMap[executeKey]) {
      executeListener(this.listenerMap[executeKey]);
    }
  };

  subscribe = (listener: ListenerType, key?: string) => {
    let isSubscribed = true;
    if (!key) {
      this.listeners.push(listener);
    } else {
      if(this.listenerMap[key]){
        (this.listenerMap[key]).push(listener);
      }else {
        this.listenerMap[key]=[listener];
      }
    }
    return () => {
      if (!isSubscribed) {
        return;
      }
      isSubscribed = false;
      if (!key) {
        unListener(this.listeners,listener);
      } else {
        unListener(this.listenerMap[key],listener);
        if(!this.listenerMap[key].length){
          delete this.listenerMap[key];
        }
      }
    };
  };

  executeKeyListener = (selectedKey?: string) => {
    if(selectedKey){
      executeListener(this.listenerMap[selectedKey]);
    }else {
      each(this.listenerMap, (listeners) => {
        executeListener(listeners);
      });
    }

  };
}

import React, { useEffect, useRef,memo } from 'react'
import SortableJS from 'sortablejs';

interface StoreType {
  nextSibling: any,
  activeComponent:any
}

const store: StoreType = {
  nextSibling: null,
  activeComponent: null,
};


function Sortable(props:any) {
  const {options={},onChange,...rest}=props
  const sortRef=useRef()

  useEffect(()=>{
    [
      'onChoose',
      'onAdd',
      'onUpdate',
    ].forEach((name) => {
      const eventHandler = options[name];
      options[name] = (...params: any) => {
        const [evt] = params;
        if (name === 'onChoose') {
          store.nextSibling = evt.item.nextElementSibling;
          store.activeComponent = sortRef.current;
        } else if ((name === 'onAdd'||name==='onUpdate') && onChange) {
          const items = sortable.toArray();
          const referenceNode = (store.nextSibling && store.nextSibling.parentNode !== null) ? store.nextSibling : null;
          evt.from.insertBefore(evt.item, referenceNode);
          onChange && onChange(items, evt);
        }
        if (evt.type === 'move') {
          const [evt, originalEvent] = params;
          return eventHandler ? eventHandler(evt, originalEvent) : true;
        }

        setTimeout(() => {
          eventHandler && eventHandler(evt);
        }, 0);
      };
    });
    const sortable = SortableJS.create(sortRef.current, options);

    return ()=>{
      sortable.destroy()
    }
  },[sortRef.current])
  return <div {...rest} ref={sortRef}/>
}

export default memo(Sortable);

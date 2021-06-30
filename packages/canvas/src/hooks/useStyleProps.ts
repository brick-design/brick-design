import { useCallback, useEffect, useRef } from 'react';
import { getComponentConfig, PROPS_TYPES, selectComponent, SelectedInfoBaseType } from '@brickd/core';
import {each} from 'lodash';
import { useOperate } from './useOperate';
import {  getNodeFromClassName } from '../utils';

export function useStyleProps(componentName:string,specialProps:SelectedInfoBaseType,className:string){
	const {key}=specialProps;
	const {propsConfig}=getComponentConfig(componentName);
	const {setOperateState}=useOperate();
	const stylePropsNodeRef=useRef<any>({});
	const styleProps:any={};
	each(propsConfig,(config,propName)=>{
		const {type}=config;

		if(type===PROPS_TYPES.cssClass){
				styleProps[propName]=key+propName;
		}
	});

	const onHover=useCallback((event:MouseEvent)=>{
		event.stopPropagation();
		setOperateState({hoverNode:event.target as HTMLElement});
	},[]);

	const onDoubleClick=useCallback((event:MouseEvent,propName:string)=>{
		event.stopPropagation();
		selectComponent({ ...specialProps,selectedStyleProp:propName });
		setOperateState({
			selectedNode: event.target as HTMLElement,
			operateSelectedKey: key,
			// index,
		});
	},[]);

	useEffect(()=>{
		const stylePropsListeners:any = {};
		each(styleProps,(className,propName)=>{
			if(propName!=='className'&&!stylePropsNodeRef.current[propName]){
				stylePropsNodeRef.current[propName]=getNodeFromClassName(className);
			}
		});
		each(stylePropsNodeRef.current,(node,propName)=>{
			stylePropsListeners[propName]={
				onDoubleClick:(event:MouseEvent)=>onDoubleClick(event,propName)
			};
			node.addEventListener('hover',onHover);
			node.addEventListener('doubleClick',stylePropsListeners[propName].onDoubleClick);

		});
		return()=>{
			each(stylePropsNodeRef.current,(node,propName)=>{
				node.removeEventListener('hover',onHover);
				node.removeEventListener('doubleClick',stylePropsListeners[propName].onDoubleClick);

			});
		};
	});

	styleProps.className=key+'className'+' '+className;
	return styleProps;
}

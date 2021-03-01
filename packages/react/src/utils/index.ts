import { useEffect, useRef } from 'react';
import {
	each,
	get,
} from 'lodash';
import {
	PageConfigType,
	getComponentConfig, getBrickdConfig, ChildNodesType,
} from '@brickd/core';

import { selectClassTarget } from '../common/constants';

export const SPECIAL_STRING_CONSTANTS: any = {
	null: null,
};

export function usePrevious<T>(value: any) {
	const ref = useRef<T>();
	useEffect(() => {
		ref.current = value;
	});
	return ref.current;
}

export const iframeSrcDoc = `<!DOCTYPE html>
<html lang="en">
<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=0.5, maximum-scale=2.0, user-scalable=yes" />
<body>
<div id="dnd-container" style="width: 100%;height: 100%"></div>
</body>
</html>
`;

export const isEqualKey = (key: string, selectKey?: string | null) => {
	if (!selectKey) return false;
	return selectKey.includes(key) && parseInt(selectKey) === parseInt(key);
};

export const getIframe = (): HTMLIFrameElement => {
	return document.getElementById('dnd-iframe') as HTMLIFrameElement;
};

export const getComponent = (componentName: string) =>
	get(getBrickdConfig().componentsMap, componentName, componentName);

export function formatUnit(target: string | null) {
	if (target) {
		const result = target.match(/\d+/);
		if (result) {
			return Number.parseInt(result[0]);
		}
	}

	return null;
}

export const getSelectedNode = (
	key?: string | null,
	iframe?: HTMLIFrameElement,
): HTMLElement | undefined => {
	if (iframe && key) {
		const { contentDocument } = iframe;
		return contentDocument!.getElementsByClassName(
			selectClassTarget + parseInt(key),
		)[0] as HTMLElement;
	}
};

export function generateCSS(
	left: number,
	top: number,
	width?: number,
	height?: number,
) {
	return `
    ${width ? `width:${width}px;` : ''}
    ${height ? `height:${height}px;` : ''}
    display:flex;
    left:${left}px;
    top:${top}px;
  `;
}

export function getElementInfo(
	element: any,
	iframe: HTMLIFrameElement,
	isModal?: boolean,
) {
	const { contentWindow } = iframe;
	const { scrollX, scrollY } = contentWindow;
	const { width, height, left, top } = element.getBoundingClientRect();
	let newLeft = left;
	let newTop = top;
	if (!isModal) {
		newLeft += scrollX;
		newTop += scrollY;
	}
	return {
		width,
		height,
		left: newLeft,
		top: newTop,
		bottom: newTop + height,
		right: newLeft + width,
	};
}

export function getIsModalChild(
	pageConfig: PageConfigType,
	domTreeKeys?: string[],
) {
	if (domTreeKeys) {
		for (const key of domTreeKeys) {
			const { mirrorModalField } =
				getComponentConfig(get(pageConfig, [key, 'componentName'])) || {};
			if (mirrorModalField) return true;
		}
	}
	return false;
}

export function setPosition(nodes: any[], isModal?: boolean) {
	if (isModal) {
		each(nodes, (node) => (node.style.position = 'fixed'));
	} else {
		each(nodes, (node) => (node.style.position = 'absolute'));
	}
}



export function generateRequiredProps(componentName: string) {
	const { propsConfig } = getComponentConfig(componentName);
	const requiredProps: any = {};
	each(propsConfig, (config, propName) => {
		const { isRequired, defaultValue } = config;
		if (isRequired) requiredProps[propName] = defaultValue;
	});

	return requiredProps;
}

export function getChildRects(childNodes:string[],iframe:any){
	return childNodes.map((nodeKey)=>{
		const node=getSelectedNode(nodeKey,iframe);
		return node&&node.getBoundingClientRect()||nodeKey;
	});
}

export function isHorizontal(childRects:any[],parentRect){
	const {top:parentTop}=parentRect;
	let tempHeight=0;
	let tempTop=0;
	for (const rect of childRects){
		if(typeof rect!=='string'){
			const {bottom,height}=rect;
			tempHeight+=height;
			tempTop=parentTop-bottom;
		}
	}
	if(tempTop>=tempHeight) return false;

	return true;
}


export const cloneChildNodes=(childNodes?:ChildNodesType)=>{
	if(!childNodes) return undefined;
	if(Array.isArray(childNodes)) return [...childNodes];
	const propNames=Object.keys(childNodes);
	return propNames.reduce((a,b)=>a[b]=[...childNodes[b]],{});

};

export const dragSort=(compareChildren:string[],
											 dragKey:string,
											 childRects:DOMRect|string[],
											 parentRect:DOMRect,
											 dragOffset:DragEvent,
											 isHorizontal?:boolean)=>{
	const {left:parentLeft,top:parentTop,width:parentWidth,height:parentHeight}=parentRect;
	const {offsetX,offsetY}=dragOffset;
	const newChildren=[];
	for(let index=0;index<compareChildren.length;index++){
		const compareKey=compareChildren[index];
		if(compareKey===dragKey) continue;
		if(typeof childRects[index]!=='string'){
			const {left,top,width,height}=childRects[index];
			const offsetLeft=offsetX-(left-parentLeft);
			const offsetTop=offsetY-(parentTop-top);
		const offsetW =	parentWidth-width;
		const offsetH = parentHeight-height;
		if(isHorizontal){
			if(offsetW>=5){
				if(offsetLeft>0){
					if(offsetLeft<=width*0.5){
						newChildren.push(dragKey,...compareChildren.slice(index));
						break;
					}else if(offsetLeft<width){
						newChildren.push(compareKey,dragKey,...compareChildren.slice(index+1));
						break;
					}else {
						newChildren.push(compareKey);
					}
				}else {
					newChildren.push(dragKey,...compareChildren.slice(index));
				}
			}else {
				if(offsetTop>0){
					if(offsetTop<height*0.5){
						newChildren.push(dragKey,...compareChildren.slice(index));
					}else if(offsetTop<height){
						newChildren.push(compareKey,dragKey,...compareChildren.slice(index+1));
						break;
					}else{
						newChildren.push(compareKey);
					}
				}else {
					newChildren.push(dragKey,...compareChildren.slice(index));
				}
			}
		}else {
			if(offsetH>=5){
				if(offsetTop>0){
					if(offsetTop<=height*0.5){
						newChildren.push(dragKey,...compareChildren.slice(index));
						break;
					}else if(offsetTop<height){
						newChildren.push(compareKey,dragKey,...compareChildren.slice(index+1));
						break;
					}else {
						newChildren.push(compareKey);
					}
				}else {
					newChildren.push(dragKey,...compareChildren.slice(index));
				}
			}else {
				if(offsetLeft>0){
					if(offsetLeft<width*0.5){
						newChildren.push(dragKey,...compareChildren.slice(index));
					}else if(offsetLeft<width){
						newChildren.push(compareKey,dragKey,...compareChildren.slice(index+1));
						break;
					}else{
						newChildren.push(compareKey);
					}
				}else {
					newChildren.push(dragKey,...compareChildren.slice(index));
				}
			}
		}

		}
	}
	if(!newChildren.includes(dragKey)){
		newChildren.push(dragKey);
	}
	return [...new Set(newChildren)];
};


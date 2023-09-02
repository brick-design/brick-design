import React, { useRef } from 'react';
import { useActiveParent } from '../PanelActive';

interface ButtonWrapper {
	panelKeys:string[]
	className:string
	children:any
}
export default function ButtonWrapper(props:ButtonWrapper){
	const {panelKeys,...rest}=props;
	const parentRef=useRef<HTMLDivElement>();
	useActiveParent(panelKeys,parentRef);
	return <div ref={parentRef} {...rest}/>;
}

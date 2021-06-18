import React, {memo, useEffect, useRef, useCallback, useImperativeHandle, forwardRef, Ref} from 'react';
import {css} from "@brickd/react";
import styles from './index.less';
import {ANIMATION_YES} from "../../utils";

interface ResizeableProps extends React.AllHTMLAttributes<any>{
    left?:boolean
    right?:boolean
    top?:boolean
    bottom?:boolean
    topLeft?:boolean
    topRight?:boolean
    bottomLeft?:boolean
    bottomRight?:boolean
    minWidth?:number,
    minHeight?:number,
    maxWidth?:number,
    maxHeight?:number,
    defaultHeight?:number,
    defaultWidth?:number
}

type OriginSizeType = {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    isResize:boolean
};

export type ChangeFoldParam={isHeight?:boolean,isWidth?:boolean,heightTarget?:number,widthTarget?:number}

export interface ResizeableRefType{
    changeFold:(params:ChangeFoldParam)=>void
}
function Resizeable(props:ResizeableProps,ref:Ref<ResizeableRefType>){
    const {children,left,right,top,bottom,topLeft,topRight,bottomLeft,bottomRight,
        minWidth,minHeight,maxWidth,maxHeight, className,defaultHeight,defaultWidth,...rest}=props;
    const originSizeRef = useRef<OriginSizeType>({isResize:false,width:defaultWidth,height:defaultHeight});
    const resizeDivRef=useRef<HTMLDivElement>();

    const changeFold=useCallback((params:ChangeFoldParam)=>{
        console.log('changeFold>>>>>>>>',params);
        const {isHeight,isWidth,widthTarget,heightTarget}=params;
        const {height,width}=originSizeRef.current;
        if(isHeight||heightTarget!==undefined){
            resizeDivRef.current.style.height=`${heightTarget!==undefined?heightTarget:height}px`;
        }
        if(isWidth||widthTarget!==undefined){
            resizeDivRef.current.style.width=`${widthTarget!==undefined?widthTarget:width}px`;

        }
        resizeDivRef.current.style.transition=ANIMATION_YES;


    },[]);

    const onMouseUp = useCallback(() => {
        originSizeRef.current.isResize=false;
    }, []);

    const onMouseMove = useCallback((event: MouseEvent) => {
        event.stopPropagation();
        if(!originSizeRef.current.isResize) return;
            const { clientX, clientY } = event;
            const { x, y, height, width } = originSizeRef.current;
            let offsetY = 0;
            let offsetX = 0;
            if(left){
                offsetX = x - clientX;
            }else if(right){
                offsetX = clientX - x;
            }else if(top){
                offsetY = y - clientY;
            }else if(bottom){
                offsetY = clientY - y;
            }else if(topLeft){
                offsetY = y - clientY;
                offsetX = x - clientX;
            }else if(topRight){
                offsetY = y - clientY;
                offsetX = clientX - x;
            }else if(bottomLeft){
                offsetX = x - clientX;
                offsetY = clientY - y;
            }else if(bottomRight){
                offsetY = clientY - y;
                offsetX = clientX - x;
            }
            const heightResult = height + offsetY;
            const widthResult = width + offsetX;

            if (
                offsetX !== 0 &&
                ((!minWidth&&!maxWidth)||
                (minWidth&&!maxWidth&&widthResult >= minWidth) ||
                (!minWidth&&maxWidth&&widthResult <= maxWidth)||
                (widthResult >= minWidth&&widthResult <= maxWidth))

            ) {
                originSizeRef.current.width=widthResult;
                originSizeRef.current.x=clientX;
                resizeDivRef.current.style.width = `${widthResult}px`;
            }

            if (
                offsetY !== 0 &&
                ((!minHeight&&!maxHeight)||
                (minHeight&&!maxHeight&&heightResult >= minHeight) ||
                (!minHeight&&maxHeight&&heightResult <= maxHeight)||
                (heightResult >= minHeight&&heightResult <= maxHeight))
            ) {
                originSizeRef.current.height=heightResult;
                originSizeRef.current.y=clientY;
                resizeDivRef.current.style.height = `${heightResult}px`;
            }
        resizeDivRef.current.style.transition='none';
    }, []);

    const onResizeStart = useCallback(function (event: React.MouseEvent) {
              event.stopPropagation();
                const {width, height} = css(resizeDivRef.current);
                originSizeRef.current = {
                    x: event.clientX,
                    y: event.clientY,
                    width: Number.parseInt(width),
                    height: Number.parseInt(height),
                    isResize:true
                };
        }, []);

    useImperativeHandle<ResizeableRefType,ResizeableRefType>(ref, () => ({changeFold}));

    useEffect(()=>{
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('mousemove', onMouseMove);
        if(defaultHeight)
        resizeDivRef.current.style.height=defaultHeight+'px';
        if(defaultWidth)
        resizeDivRef.current.style.width=defaultWidth+'px';

        return ()=>{
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('mousemove', onMouseMove);
        };
    },[]);

    return <div ref={resizeDivRef}  className={`${styles['container']} ${className}`} {...rest} >
        {children}
        {left&&<div className={styles['resize-left']} onMouseDown={onResizeStart}/>}
        {right&&<div className={styles['resize-right']} onMouseDown={onResizeStart}/>}
        {top&&<div className={styles['resize-top']} onMouseDown={onResizeStart}/>}
        {bottom&&<div className={styles['resize-bottom']} onMouseDown={onResizeStart}/>}
        {topLeft&&<div className={styles['resize-topLeft']} onMouseDown={onResizeStart}/>}
        {topRight&&<div className={styles['resize-topRight']} onMouseDown={onResizeStart}/>}
        {bottomLeft&&<div className={styles['resize-bottomLeft']} onMouseDown={onResizeStart}/>}
        {bottomRight&&<div className={styles['resize-bottomRight']} onMouseDown={onResizeStart}/>}
    </div>;
}

export default memo(forwardRef(Resizeable));

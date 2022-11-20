import React, {
  memo,
  useRef,
  useEffect,
  RefObject,
  useImperativeHandle,
  Ref,
  useCallback,
  forwardRef, useState,
} from 'react';
import { merge,isEmpty } from 'lodash';
import { DragAndResizeRefType } from '../DragAndResize';
import styles from '../../global.less';


type OriginPositionType = {
  width?: string;
  height?: string;
  top?: string;
  left?: string;
  targetLeft?: string;
  targetTop?: string;
  targetWidth?: string;
  targetHeight?: string;
};

export interface BarButtonProps{
  icon: string;
  dragResizeRef: RefObject<DragAndResizeRefType>;
  children: any;
  defaultShow?: boolean;
  checkboxClass?:string;
  iconClass?:string;
  uncheckedIcon?: string;
  checkedIcon?: string;
  defaultPosition?:{width:number,height:number,top:number,left:number}
  onCheckChange?:(checked:boolean)=>void
}

export type BarButtonRefType = {
  closePanel: (event:React.MouseEvent) => void;
};
function BarButton(props: BarButtonProps, ref: Ref<BarButtonRefType>) {
  const { icon, dragResizeRef,onCheckChange, children,defaultShow=true,checkboxClass,defaultPosition,checkedIcon=icon,uncheckedIcon=icon,iconClass } = props;
  const originPositionRef = useRef<OriginPositionType>({});
  const iconRef = useRef<HTMLDivElement>();
  const [isChecked,setIsChecked]=useState(defaultShow);
  useImperativeHandle(ref, () => ({ closePanel:onChangeMax}));

  const getOriginPosition = useCallback(() => {
    const {
      left,
      top,
      width,
      height,
    } = iconRef.current.getBoundingClientRect();

    originPositionRef.current.targetLeft = left + 'px';
    originPositionRef.current.targetTop = top + 'px';
    originPositionRef.current.targetWidth = width + 'px';
    originPositionRef.current.targetHeight = height + 'px';
  }, []);

  useEffect(() => {
    if(!defaultShow){
      dragResizeRef.current.target.style.visibility='hidden';
    }
    if(!isEmpty(defaultPosition)){
        const {top,left,width,height}=defaultPosition;
      originPositionRef.current.targetLeft = left + 'px';
      originPositionRef.current.targetTop = top + 'px';
      originPositionRef.current.targetWidth = width + 'px';
      originPositionRef.current.targetHeight = height + 'px';
        return;
    }
    getOriginPosition();
    addEventListener('resize', getOriginPosition);
    return () => {
      removeEventListener('resize', getOriginPosition);
    };
  }, [defaultShow,defaultPosition,originPositionRef]);

  const closePanel = useCallback(() => {
    const { target } = dragResizeRef.current;
    const { top, left, width, height } = getComputedStyle(target);
    const {
      targetTop,
      targetLeft,
      targetHeight,
      targetWidth,
    } = originPositionRef.current;

    merge(originPositionRef.current, { top, left, width, height });
    target.style.cssText = `top:${targetTop};left:${targetLeft};width:${targetWidth};height:${targetHeight};transition:all 500ms;`;
    target.style.visibility = 'hidden';
  }, []);

  const onChangeMax = useCallback((event?: React.MouseEvent) => {
    event.stopPropagation&&event.stopPropagation();
    setIsChecked(!isChecked);
    onCheckChange&&onCheckChange(!isChecked);
    const target = dragResizeRef.current.target;
    if (isChecked) {
      closePanel();
    } else {
      const { top, left, width,height } = originPositionRef.current;
      target.style.visibility = 'visible';
      target.style.cssText = `top:${top};left:${left};width:${width};height:${height};transition:all 500ms;`;
    }
  }, [setIsChecked,isChecked]);



  return (
    <>
      <div
        ref={iconRef}
        onClick={onChangeMax}
        className={`${styles['icon-Menu']} ${checkboxClass}`}
      >
        <img
          src={isChecked ?uncheckedIcon: checkedIcon }
          className={`${styles['icon-class']} ${iconClass}`}
        />
      </div>
      {children}
    </>
  );
}

export default memo(forwardRef(BarButton));

import React, { memo, useCallback, useEffect, useRef } from 'react';
import styles from './index.less';
import { useOperate } from '../../hooks/useOperate';
import { changeElPositionAndSize } from '../../utils';

function BoxModel() {
  const topRef = useRef<HTMLDivElement>();
  const leftRef = useRef<HTMLDivElement>();
  const topDistanceRef = useRef<HTMLDivElement>();
  const leftDistanceRef = useRef<HTMLDivElement>();
  const { setOperateState,getOperateState } = useOperate();

  const changeBoxDisplay = useCallback((display: string) => {
    topRef.current.style.display = display;
    topDistanceRef.current.style.display = display;
    leftRef.current.style.display = display;
    leftDistanceRef.current.style.display = display;
  }, []);

  const boxChange = useCallback(
    (
      width: number,
      height: number,
      top: number,
      left: number,
      positions:any
    ) => {
      const {lockedMarginLeft,lockedMarginTop}=getOperateState();
      const {marginLeft,marginRight,marginTop,marginBottom}=positions;
      changeBoxDisplay('flex');
      let topResult = top - marginTop;
       const leftResult = left - marginLeft;
      if(!lockedMarginLeft){
        changeElPositionAndSize(leftDistanceRef.current,{left:leftResult,top:top + height / 2,width:Math.abs(marginLeft)});
        leftDistanceRef.current.dataset.distance = 'marginLeft:' + marginLeft;
        if(!lockedMarginTop){
           changeElPositionAndSize(topRef.current,{left:leftResult,top:topResult,width:width+marginLeft});
          changeElPositionAndSize(topDistanceRef.current,{left:width / 2 + left,top:marginTop>0?topResult:top,height:Math.abs(marginTop)});
          topDistanceRef.current.dataset.distance = 'marginTop:' + marginTop;
          changeElPositionAndSize(leftRef.current,{left:leftResult,top:topResult,height:marginTop+height});
        }else {
          topResult=top+height+marginBottom;
          changeElPositionAndSize(topRef.current,{left:leftResult,top:topResult,width:width+marginLeft});
          changeElPositionAndSize(topDistanceRef.current,{left:width / 2 + left,top:top+height,height:marginBottom});
          topDistanceRef.current.dataset.distance = 'marginBottom:' + marginBottom;
          changeElPositionAndSize(leftRef.current,{left:leftResult,top,height:marginBottom+height});
        }
      }else{
        changeElPositionAndSize(leftDistanceRef.current,{left:left+width,top:top + height / 2,width:Math.abs(marginRight)});
        leftDistanceRef.current.dataset.distance = 'marginRight:' + marginRight;
        if(!lockedMarginTop){
          changeElPositionAndSize(topRef.current,{left,top:topResult,width:width+marginRight});
          changeElPositionAndSize(topDistanceRef.current,{left:width / 2 + left,top:topResult,height:Math.abs(marginTop)});
          topDistanceRef.current.dataset.distance = 'marginTop:' + marginTop;
          changeElPositionAndSize(leftRef.current,{left:left+width+marginRight,top:topResult,height:marginTop+height});
        }else {
          topResult=top+height+marginBottom;
          changeElPositionAndSize(topRef.current,{left,top:topResult,width:width+marginRight});
          changeElPositionAndSize( topDistanceRef.current,{left:width / 2 + left,top:topResult,height:Math.abs(marginBottom)});
          topDistanceRef.current.dataset.distance = 'marginBottom:' + marginBottom;
          changeElPositionAndSize( leftRef.current,{left:left+width+marginRight,top:topResult,height:marginBottom+height});
        }

      }
    },
    [],
  );

  useEffect(() => {
    setOperateState({ boxChange, changeBoxDisplay });
  }, []);

  return (
    <>
      <div
        className={styles['box-top']}
        ref={topRef}
      />
      <div
        className={styles['box-left']}
        ref={leftRef}
      />
      <div
        className={styles['distances-v']}
        style={{ transition: 'none' }}
        ref={topDistanceRef}
      />
      <div
        className={styles['distances-h']}
        style={{ transition: 'none' }}
        ref={leftDistanceRef}
      />
    </>
  );
}

export default memo(BoxModel);

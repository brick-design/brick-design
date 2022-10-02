import React, { memo, useCallback, useEffect, useRef } from 'react';
import {isEmpty} from 'lodash';
import styles from './index.less';
import {
  css,
  generateCSS,
  getElementInfo, placeholderBridgeStore, PlaceholderPositionType, PlaceholderRect, setCss,
  setPosition,
} from '../../utils';
import { useOperate } from '../../hooks/useOperate';
import { useZoom } from '../../hooks/useZoom';


const getGuideNodeCss=(rect:PlaceholderRect,size:number)=>{
  if(isEmpty(rect)) return 'display:none;';
  const {width=size,height=size,isEmptyChild}=rect;
 let style= `width:${width}px;height:${height}px;display:block;`;
 if(isEmptyChild){
   style+='opacity:0.5;';
 }
  return style;
};

function GuidePlaceholder() {
  const hoverNodeRef = useRef<HTMLDivElement>();
  const guideNodeRef1=useRef<HTMLDivElement>();
  const guideNodeRef2=useRef<HTMLDivElement>();
  const guideNodeRef3=useRef<HTMLDivElement>();

  const { getOperateState, setSubscribe, setOperateState } = useOperate(false);
  const {getZoomState}=useZoom();

  const hideGuideNode=()=>{
    guideNodeRef1.current.style.display='none';
    guideNodeRef2.current.style.display='none';
    guideNodeRef3.current.style.display='none';
  };

  useEffect(() => {
    const renderGuidePlaceholder = () => {
      const { hoverNode, dropNode,selectedNode, isModal, isDropAble } = getOperateState();
      const node = dropNode || hoverNode;
      if (node&&node!==selectedNode) {
        const { left, top, width, height } = getElementInfo(node, isModal);
       const {display,flexDirection,alignItems,justifyContent}=css(node);
        // hoverNodeRef.current.style=css(node);
        hoverNodeRef.current.style.cssText = generateCSS(
          left,
          top,
          width,
          height,
        );
        setCss(hoverNodeRef.current,{zIndex:1000,display,flexDirection,alignItems,justifyContent});

        if (dropNode) {
          const css:any={};
          if (isDropAble) {
            css.borderColor = 'springgreen';
            css.backgroundColor = 'rgba(0, 256, 0, 0.1)';
          } else {
            hideGuideNode();
            css.borderColor = 'red';
            css.backgroundColor = 'rgba(256, 0, 0, 0.1)';
          }
          setCss(hoverNodeRef.current,css);
        }
        setPosition([hoverNodeRef.current], isModal);
      }else {

        hideGuideNode();
        hoverNodeRef.current.style.display='none';

      }
    };

    placeholderBridgeStore.renderPlaceholder=(rects:PlaceholderPositionType)=>{
      const {scale}=getZoomState();
      const {node1,node2,node3}=rects;
      let  size=2;
      if(scale<1){
          size=2/scale;
      }
      guideNodeRef1.current.style.cssText=getGuideNodeCss(node1,size);
      guideNodeRef2.current.style.cssText=getGuideNodeCss(node2,size);
      guideNodeRef3.current.style.cssText=getGuideNodeCss(node3,size);
    };

    return setSubscribe(renderGuidePlaceholder);
  }, []);

  const onTransitionEnd = useCallback(() => {
    setOperateState({ isLock: false });
  }, []);

  return (<div
      onTransitionEnd={onTransitionEnd}
      ref={hoverNodeRef}
      className={styles['hover-node']}
    >
    <div  ref={guideNodeRef1} />
    <div className={styles['guide-node']} ref={guideNodeRef2} />
    <div  ref={guideNodeRef3} />

  </div>);
}

export default memo(GuidePlaceholder);

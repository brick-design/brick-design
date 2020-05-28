import { createElement, forwardRef, memo, useEffect, useState } from 'react';
import get from 'lodash/get';
import merge from 'lodash/merge';
import { formatSpecialProps } from '../utils';
import { DragSourceType, LEGO_BRIDGE, useSelector } from 'brickd-core';

import {
  CommonPropsType,
  handleChildNodes,
  handleEvents,
  handleModalTypeContainer,
  handlePropsClassName,
  propAreEqual,
} from '../common/handleFuns';
import { useCommon } from '../hooks/useCommon';
import { getDropTargetInfo } from '..';


interface DragSourceState {
  dragSource:DragSourceType
}
/**
 * 所有的容器组件名称
 */
function Container(allProps: CommonPropsType, ref: any) {
  const {
    specialProps,
    specialProps: {
      key,
      domTreeKeys,
    },
    ...rest
  } = allProps;
  const {
    props,
    addPropsConfig,
    childNodes,
    componentName,
    mirrorModalField,
    propsConfig,
    isHovered,
    isSelected,
    componentConfigs,
    SelectedDomKeys
  } = useCommon(allProps);

  useEffect(()=>{
    setChildren(childNodes)
  },[childNodes])

  const [children,setChildren]=useState(childNodes)
  const {dragSource}=useSelector<DragSourceState>(['dragSource'])
const onDragEnter=(e:Event)=>{
    e.stopPropagation()
  getDropTargetInfo(e,domTreeKeys, key)
  const {dragKey}=dragSource
  if(dragKey&&dragKey!==key){
    if(Array.isArray(childNodes)){
      setChildren([...childNodes,dragKey])
    }else {

    }
  }
}
const onDragLeave=(e:Event)=>{
  e.stopPropagation()
  setChildren(childNodes)
}
  if(!componentName) return null

  let modalProps: any = {};
  if (mirrorModalField) {
    const { displayPropName, mountedProps } = handleModalTypeContainer(mirrorModalField, 'dnd-iframe');
    const isVisible = isSelected || SelectedDomKeys&&SelectedDomKeys.includes(key);
    modalProps = { [displayPropName]: isVisible, ...mountedProps };
  }

  const { className, animateClass,...restProps } = props;
  return (
    createElement(get(LEGO_BRIDGE.config!.OriginalComponents, componentName, componentName), {
      ...restProps,
      className: handlePropsClassName(isSelected, isHovered, className, animateClass),
      ...handleEvents(specialProps, isSelected, childNodes),
      onDragEnter,
      onDragLeave,
      ...handleChildNodes(domTreeKeys, key, componentConfigs,children!),
      ...formatSpecialProps(props, merge({}, propsConfig, addPropsConfig)),
      draggable: true,
      /**
       * 设置组件id方便抓取图片
       */
      id: isSelected ? 'select-img' : undefined,
      ref,
      ...rest,
      ...modalProps,
    })
  );
}

export default memo<CommonPropsType>(forwardRef(Container), propAreEqual);



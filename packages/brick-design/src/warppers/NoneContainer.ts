import { createElement, forwardRef, memo } from 'react';
import get from 'lodash/get';
import { getAddPropsConfig, LEGO_BRIDGE, produce } from 'brickd-core';
import {
  CommonPropsType,
  handleEvents,
  handlePropsClassName,
  propAreEqual,
} from '../common/handleFuns';
import { formatSpecialProps } from '../utils';
import merge from 'lodash/merge';
import { useCommon } from '../hooks/useCommon';
import { getDropTargetInfo } from '..';
import { useHover } from '../hooks/useHover';
import { useSelect } from '../hooks/useSelect';

function NoneContainer(allProps: CommonPropsType, ref: any) {
  const {
    specialProps,
    ...rest
  } = allProps;
  const {
    props,
    componentName,
    propsConfig,
    propsConfigSheet,
  } = useCommon(allProps);
  const { key } = specialProps;
  const isHovered = useHover(key);
  const {isSelected}=useSelect(specialProps)
  if (!componentName) return null;

  const onDragEnter = (e: Event) => {
    e.stopPropagation();
    getDropTargetInfo(e, undefined, key);
  };


  const { className, animateClass, ...restProps } = props || {};
  return (
    createElement(get(LEGO_BRIDGE.config!.OriginalComponents, componentName, componentName), {
      ...restProps,
      className: handlePropsClassName(isSelected, isHovered, className, animateClass, true),
      ...handleEvents(specialProps, isSelected),
      onDragEnter,
      ...formatSpecialProps(props, produce(propsConfig, oldPropsConfig => {
        merge(oldPropsConfig, getAddPropsConfig(propsConfigSheet, specialProps.key));
      })),
      draggable: true,
      /**
       * 设置组件id方便抓取图片
       */
      id: isSelected ? 'select-img' : undefined,
      ref,
      ...rest,
    })
  );

}

export default memo<CommonPropsType>(forwardRef(NoneContainer), propAreEqual);

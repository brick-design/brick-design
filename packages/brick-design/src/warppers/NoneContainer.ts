import { createElement, forwardRef, memo } from 'react';
import get from 'lodash/get';
import { LEGO_BRIDGE } from 'brickd-core';
import { CommonPropsType, handleEvents, handlePropsClassName, propAreEqual } from '../common/handleFuns';
import { formatSpecialProps } from '../utils';
import merge from 'lodash/merge';
import { useCommon } from '../hooks/useCommon';

function NoneContainer(allProps: CommonPropsType, ref: any){
    const {
        specialProps,
        ...rest
    } = allProps;
    const {
        props, addPropsConfig,
        componentName,
        propsConfig,
        isHovered, isSelected
    } = useCommon(allProps)
  if(!componentName) return null

  const {className, animateClass,...restProps} = props
    return (
        createElement(get(LEGO_BRIDGE.config!.OriginalComponents, componentName, componentName), {
            ...restProps,
            className: handlePropsClassName(isSelected, isHovered, className, animateClass),
            ...handleEvents(specialProps, isSelected),
            ...formatSpecialProps(props, merge({}, propsConfig, addPropsConfig)),
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

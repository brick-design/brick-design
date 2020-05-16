import { createElement, forwardRef, memo } from 'react';
import get from 'lodash/get';
import { LEGO_BRIDGE } from 'brickd-core';
import { CommonContainerPropsType, handleEvents, handlePropsClassName, propAreEqual } from '../common/handleFuns';
import { formatSpecialProps } from '../utils';
import merge from 'lodash/merge';
import { useCommon } from '../hooks/useCommon';

function NoneContainer(allProps: CommonContainerPropsType, ref: any){
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
    const {className, animateClass} = props
    return (
        createElement(get(LEGO_BRIDGE.config!.OriginalComponents, componentName, componentName), {
            ...props,
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

export default memo(forwardRef(NoneContainer), propAreEqual);

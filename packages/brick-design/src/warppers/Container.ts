import { createElement, forwardRef, memo } from 'react';
import get from 'lodash/get';
import merge from 'lodash/merge';
import { formatSpecialProps } from '../utils';
import { LEGO_BRIDGE } from 'brickd-core';

import {
  CommonContainerPropsType,
  handleChildNodes,
  handleEvents,
  handleModalTypeContainer,
  handlePropsClassName,
  propAreEqual,
} from '../common/handleFuns';
import { useCommon } from '../hooks/useCommon';


/**
 * 所有的容器组件名称
 */
function Container(allProps: CommonContainerPropsType, ref: any) {
    const {
        specialProps,
        specialProps: {
            key,
            domTreeKeys,
        },
        ...rest
    } = allProps;
    const {
        props, addPropsConfig, childNodes, componentName,
        mirrorModalField, propsConfig,
        isHovered, isSelected, componentConfigs
    } = useCommon(allProps)
    let modalProps: any = {}
    if (mirrorModalField) {
        const {displayPropName, mountedProps} = handleModalTypeContainer(mirrorModalField, 'dnd-iframe')
        const isVisible = isSelected || domTreeKeys;
        modalProps = {[displayPropName]: isVisible, ...mountedProps};
    }

    const {className, animateClass} = props
    return (
        createElement(get(LEGO_BRIDGE.config!.OriginalComponents, componentName, componentName), {
            ...props,
            className: handlePropsClassName(isSelected, isHovered, className, animateClass),
            ...handleEvents(specialProps, isSelected, childNodes),
            ...handleChildNodes(domTreeKeys, key, componentConfigs),
            ...formatSpecialProps(props, merge({}, propsConfig, addPropsConfig)),
            draggable: true,
            /**
             * 设置组件id方便抓取图片
             */
            id: isSelected ? 'select-img' : undefined,
            ref,
            ...rest,
            ...modalProps
        })
    );
}

export default memo(forwardRef(Container), propAreEqual);



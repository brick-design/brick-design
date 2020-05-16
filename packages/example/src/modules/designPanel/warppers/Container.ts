import {createElement, forwardRef, useEffect, useMemo} from 'react';
import get from 'lodash/get';
import merge from 'lodash/merge';
import config from '@/configs';
import {formatSpecialProps} from '@/utils';
import {useSelector} from '@/store';

import {
    CommonContainerPropsType,
    controlUpdate,
    handleChildNodes,
    handleEvents,
    handleModalTypeContainer,
    handlePropsClassName,
    handleSelectedStatus,
    HookState,
    selectedStatus
} from "@/modules/designPanel/commom/handleFuns";
import {stateSelector} from "@/modules/designPanel/commom/constants";


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
    const {selectedInfo, hoverKey,componentConfigs} = useSelector<HookState>(stateSelector,
        (prevState, nextState) => controlUpdate(prevState, nextState, key))

    const {selectedKey} = selectedInfo || {};

    const {isHovered, isSelected} = selectedStatus(key, hoverKey, selectedKey);

    /**
     * 当组件跨容器拖拽嵌套时,触发
     */
    const {props,addPropsConfig,childNodes,componentName}=componentConfigs[key]

    useEffect(() => {
        /**
         * 如果组件为选中状态那就更新selectedInfo
         */
        if (isSelected) {
            handleSelectedStatus(null, isSelected, specialProps,undefined);
        }
    }, []);

    const {mirrorModalField,propsConfig} = useMemo(()=>get(config.AllComponentConfigs, componentName),[]);

    let modalProps:any={}
    if (mirrorModalField) {
        const {displayPropName, mountedProps} = handleModalTypeContainer(mirrorModalField, 'dnd-iframe')
        const isVisible =isSelected || domTreeKeys;
        modalProps= {[displayPropName]:isVisible,...mountedProps};
    }

    console.log('hahhaha>>>>>>>',handleChildNodes(domTreeKeys,key,componentConfigs))
    const {className, animateClass} = props
    return (
        createElement(get(config.OriginalComponents, componentName, componentName), {
            ...props,
            className: handlePropsClassName(isSelected, isHovered, className, animateClass),
            ...handleEvents(specialProps, isSelected, childNodes),
            ...handleChildNodes(domTreeKeys,key,componentConfigs),
            ...formatSpecialProps(props, merge({}, propsConfig, addPropsConfig)),
            draggable: true,
            /**
             * 设置组件id方便抓取图片
             */
            id: isSelected ?'select-img':undefined,
            ref,
            ...rest,
            ...modalProps
        })
    );
}

export default forwardRef(Container);



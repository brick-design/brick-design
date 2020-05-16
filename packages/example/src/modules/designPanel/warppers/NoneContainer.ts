import {createElement, forwardRef, memo, useMemo} from 'react';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import config from '@/configs';
import {useSelector} from "@/store";
import {
    CommonContainerPropsType,
    controlUpdate,
    handleChildNodes,
    handleEvents,
    handlePropsClassName,
    HookState,
    selectedStatus
} from "@/modules/designPanel/commom/handleFuns";
import {formatSpecialProps} from "@/utils";
import merge from "lodash/merge";
import {stateSelector} from "@/modules/designPanel/commom/constants";

const NoneContainer = (allProps: CommonContainerPropsType,ref:any) => {
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
console.log('selectedKey',selectedKey)
    const {isHovered, isSelected} = selectedStatus(key, hoverKey, selectedKey);
    const {propsConfig} = useMemo(()=>get(config.AllComponentConfigs, componentName),[]);

    /**
     * 当组件跨容器拖拽嵌套时,触发
     */
    const {props,addPropsConfig,componentName}=componentConfigs[key]

    const {className, animateClass} = props
    return (
        createElement(get(config.OriginalComponents, componentName, componentName), {
            ...props,
            className: handlePropsClassName(isSelected, isHovered, className, animateClass),
            ...handleEvents(specialProps, isSelected),
            ...formatSpecialProps(props, merge({}, propsConfig, addPropsConfig)),
            draggable: true,
            /**
             * 设置组件id方便抓取图片
             */
            id: isSelected ?'select-img':undefined,
            ref,
            ...rest,
        })
    );

};

export default memo(forwardRef(NoneContainer),(prevProps,nextProps)=>isEqual(prevProps,nextProps));

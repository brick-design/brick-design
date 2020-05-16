import React from 'react'
import classNames from "classnames";
import styles from '../style.less';
import {
    ChildNodesType,
    clearSelectedStatus,
    ComponentConfigsType,
    getDragSource,
    getDropTarget,
    overTarget,
    PropsNodeType,
    selectComponent,
    SelectedInfoType
} from "@/store";
import map from "lodash/map";
import each from "lodash/each";
import {MirrorModalFieldType} from "@/types/ComponentConfigType";
import {PROPS_TYPES} from "@/types/ConfigTypes";
import {containers} from "@/modules/designPanel/commom/constants";
import Container from "@/modules/designPanel/warppers/Container";
import NoneContainer from "@/modules/designPanel/warppers/NoneContainer";
import {homedir} from "os";

/**
 * 处理样式
 * @param isSelected
 * @param isHovered
 * @param className
 * @param animateClass
 */
export function handlePropsClassName(isSelected: boolean, isHovered: boolean, className: any, animateClass: string) {
    return classNames(isSelected ? styles['container-select-border'] : isHovered && styles['container-hover-border'], className, animateClass);
}

/**
 * 渲染组件的子节点
 * @param childNodes
 * @param domTreeKeys
 * @param parentKey
 * @param componentConfigs
 * @param parentPropName
 */
function renderNodes(childNodes: string[], domTreeKeys: string[], parentKey: string, componentConfigs: ComponentConfigsType, parentPropName?: string) {
    const resultChildNodes = map(childNodes, (key) => {
        const {componentName} = componentConfigs[key];
        /** 根据组件类型处理属性 */
        const props = {
            componentName,
            specialProps:{
                key,
                domTreeKeys: [...domTreeKeys, key],
                parentKey,
                parentPropName
            }
        }
        return containers.includes(componentName)?<Container {...props} key={key} />:<NoneContainer {...props} key={key}/>;
    });

    /** 如果该组件子节点或者属性子节点要求为单组件返回子组件的第一组件*/
    //todo
    // if (false) return resultChildNodes[0];

    return resultChildNodes;
}

export function handleChildNodes(domTreeKeys: string[], parentKey: string, componentConfigs: ComponentConfigsType) {
    const {childNodes} = componentConfigs[parentKey]
    let nodeProps: any = {}
    if (Array.isArray(childNodes)) {
        nodeProps.children = renderNodes(childNodes, domTreeKeys, parentKey, componentConfigs)
    }else {
        each(childNodes, (nodes: string[], propName: string) => {
            nodeProps[propName] = renderNodes(
                nodes,
                [...domTreeKeys, `${parentKey}${propName}`],
                parentKey,
                componentConfigs,
                propName
            )
        })
    }
    return nodeProps
}

/**
 * 处理弹窗类容器
 * @param mirrorModalField
 * @param iframeId
 */
export function handleModalTypeContainer(mirrorModalField: MirrorModalFieldType, iframeId: string) {
    const mountedProps: any = {};
    const {displayPropName, mounted} = mirrorModalField;
    if (mounted) {
        const {propName, type} = mounted;
        const iframe: any = document.getElementById(iframeId);
        const mountedNode = iframe.contentDocument.body;
        mountedProps[propName] = type === PROPS_TYPES.function ? () => mountedNode : mountedNode;
    }

    return {displayPropName, mountedProps};
}

/**
 * 控制渲染
 * @param prevState
 * @param nextState
 * @param key
 */
export type HookState = {
    selectedInfo: SelectedInfoType,
    hoverKey: string,
    componentConfigs: ComponentConfigsType
}

export function controlUpdate(prevState: HookState, nextState: HookState, key: string) {

    if (prevState.componentConfigs[key] === nextState.componentConfigs[key]) {
        const {selectedKey: prevSelectedKey,propName:prevPropName} = prevState.selectedInfo || {}
        const {selectedKey,propName} = nextState.selectedInfo || {}
        if(selectedKey===prevSelectedKey){
            if(propName===prevPropName) return  false
        }else if (selectedKey!==key&&prevPropName!==key) {
            return false
        }

        if(prevState.hoverKey===nextState.hoverKey){
            return  false
        }else if(nextState.hoverKey!==key&&prevState.hoverKey!==key){
            return  false
        }
        return  true
    }
    return true
}

/**
 * 改变选中状态
 */
export interface SpecialPropsType {
    domTreeKeys: string[],
    key: string,
    parentKey?: string,
    parentPropName?: string,
}

export function handleSelectedStatus(
    event: Event | null,
    isSelected: boolean,
    specialProps: SpecialPropsType
    , propName: string | undefined) {
    event && event.stopPropagation()

    // selectedProp = requiredProp || selectedProp
    if (isSelected) {
        console.log('清除')
        clearSelectedStatus()
    } else {
        console.log('选中')
        selectComponent({...specialProps, propName})
    }

}


/**
 * hover组件上触发
 * @param event
 * @param key
 */
export function onMouseOver(event: Event, key: string) {
    event.stopPropagation();
    overTarget({
        hoverKey: key,
    })
}

/**
 * 获取要放入组件的容器信息
 * @param event
 * @param selectedKey
 * @param propName
 */
export function getDropTargetInfo(event: Event, selectedKey?: string, propName?: string) {
    event.stopPropagation();

    getDropTarget({
        propName,
        selectedKey,
    })

}


/**
 * 拖拽当前组件时获取当前组件的信息
 * @param event
 * @param dragKey
 * @param parentKey
 * @param parentPropName
 */
function onDragStart(event: Event, dragKey: string, parentKey: string, parentPropName?: string) {
    event.stopPropagation();
    getDragSource({
        dragKey,
        parentKey,
        parentPropName
    })
}

/**
 * 处理容器组件属性
 * @returns {*|{onMouseOver: (function(*=): void), onClick: (function(*=): *), onDragStart: (function(*=): void), onDragEnter: (function(*=): *)}}
 */
export function handleEvents(specialProps: SpecialPropsType, isSelected: boolean, childNodes?: ChildNodesType) {
    const {
        key,
        parentKey,
        parentPropName
    } = specialProps;
    let propName: string | undefined
    if (childNodes && !Array.isArray(childNodes)) {
        propName = Object.keys(childNodes as PropsNodeType).pop()
    }
    return {
        onClick: (e: Event) => handleSelectedStatus(e, isSelected, specialProps, propName),
        onMouseOver: (e: any) => onMouseOver(e, key),
        onDragEnter: (e: any) => getDropTargetInfo(e, key, propName),
        onDragStart: (e: any) => onDragStart(e, key, parentKey!, parentPropName),
    };
}


/**
 * 获取组件选中状态
 * @param key
 * @param hoverKey
 * @param selectedKey
 */
export function selectedStatus(key: string, hoverKey: string | null, selectedKey?: string) {
    const isSelected = !!selectedKey && selectedKey.includes(key);
    /** 是否hover到当前组件 */
    const isHovered = !!hoverKey && hoverKey.includes(key);
    return {isHovered, isSelected};
}


export interface CommonContainerPropsType {
    specialProps: SpecialPropsType,
    [propsName: string]: any

}

import React, { AllHTMLAttributes } from 'react';
import styles from './style.less';
import {
  ChildNodesType,
  ComponentConfigsType,
  getComponentConfig,
  isContainer,
  MirrorModalFieldType,
  PROPS_TYPES,
  PropsConfigSheetType,
  PropsNodeType,
  SelectedInfoBaseType,
  STATE_PROPS,
} from 'brickd-core';
import { handleSelectedStatus, onDragStart, onMouseOver } from './events';
import map from 'lodash/map';
import each from 'lodash/each';
import Container from '../warppers/Container';
import NoneContainer from '../warppers/NoneContainer';
import isEqual from 'lodash/isEqual';

/**
 * 处理样式
 * @param isSelected
 * @param isHovered
 * @param isHidden
 * @param isDragTarget
 * @param className
 * @param animateClass
 */
export function handlePropsClassName(isSelected: boolean, isHovered: boolean, isHidden: boolean,isDragTarget:boolean, className: any, animateClass: string) {
  let classNameCollection = `${className} ${animateClass} ${isDragTarget?styles['forbid-event']:styles['allow-event']} `;
  if (isHidden) {
    return styles['hidden-component'];
  }
  if (isSelected) {
    classNameCollection += `${styles['container-select-outline']}`;
  } else if (isHovered) {
    classNameCollection += `${styles['hover-outline']}`;
  }
  return classNameCollection;
}


export type DragAddStatusType={
  dragKey?:string,
  isDragAdd?:boolean,
  isDragAddChild?:boolean
}

/**
 * 渲染组件的子节点
 * @param childNodes
 * @param specialProps
 * @param componentConfigs
 * @param dragAddStatus
 * @param parentPropName
 * @param isOnlyNode
 * @param isRequired
 */
function renderNodes(childNodes: string[],specialProps:SelectedInfoBaseType, componentConfigs: ComponentConfigsType,dragAddStatus:DragAddStatusType, parentPropName?: string, isOnlyNode?: boolean, isRequired?: boolean) {
  const {dragKey,isDragAdd,isDragAddChild}=dragAddStatus
  // eslint-disable-next-line prefer-const
  let {domTreeKeys,key:parentKey}=specialProps
  if(parentPropName){
    domTreeKeys= [...domTreeKeys, `${parentKey}${parentPropName}`]
  }
  const resultChildNodes = map(childNodes, (key) => {
    const { componentName } = componentConfigs[key] || {};
    if (!componentName) return null;
    /** 根据组件类型处理属性 */
    const props = {
      specialProps: {
        key,
        domTreeKeys: [...domTreeKeys, key],
        parentKey,
        parentPropName,
      },
    };
    return isContainer(componentName) ? <Container {...props} isDragAddChild={isDragAddChild||dragKey===key&&isDragAdd}  key={key}/> :
      <NoneContainer {...props} isDragAddChild={isDragAddChild} key={key}/>;
  });

  /** 如果该组件子节点或者属性子节点要求为单组件返回子组件的第一组件*/
  if (isOnlyNode) {
    return resultChildNodes[0] || isRequired && <div/>;
  }

  return resultChildNodes;
}

export function handleChildNodes(specialProps:SelectedInfoBaseType, componentConfigs: ComponentConfigsType, children?: ChildNodesType,dragKey?:string,isDragAdd?:boolean,isDragAddChild?:boolean) {
  const nodeProps: any = {};
  if(!children) return nodeProps
  const {key:parentKey}=specialProps
  const dragAddStatus:DragAddStatusType={isDragAdd,dragKey,isDragAddChild}
  const { componentName } = componentConfigs[parentKey];
  const { nodePropsConfig,isRequired,isOnlyNode } = getComponentConfig(componentName);
    if (Array.isArray(children)) {
      nodeProps.children = renderNodes(children, specialProps, componentConfigs,dragAddStatus,undefined,isOnlyNode,isRequired);
    } else {
      each(children, (nodes, propName: string) => {
        if(!nodes) return null
        const { isOnlyNode, isRequired } = nodePropsConfig![propName];
        nodeProps[propName] = renderNodes(
          nodes,
          specialProps,
          componentConfigs,
          dragAddStatus,
          propName,
          isOnlyNode,
          isRequired,
        );
      });
    }

  return nodeProps;
}

/**
 * 处理弹窗类容器
 * @param mirrorModalField
 * @param iframeId
 */
export function handleModalTypeContainer(mirrorModalField: MirrorModalFieldType, iframeId: string) {
  const mountedProps: any = {};
  const { displayPropName, mounted } = mirrorModalField;
  if (mounted) {
    const { propName, type } = mounted;
    const iframe: any = document.getElementById(iframeId);
    const mountedNode = iframe.contentDocument.body;
    mountedProps[propName] = type === PROPS_TYPES.function ? () => mountedNode : mountedNode;
  }

  return { displayPropName, mountedProps };
}


/**
 * 处理容器组件属性
 * @returns {*|{onMouseOver: (function(*=): void), onClick: (function(*=): *), onDragStart: (function(*=): void), onDragEnter: (function(*=): *)}}
 */
export function handleEvents(specialProps: SelectedInfoBaseType, isSelected: boolean, childNodes?: ChildNodesType) {
  const {
    key,
    parentKey,
    parentPropName,
  } = specialProps;
  let propName: string | undefined;
  if (childNodes && !Array.isArray(childNodes)) {
    propName = Object.keys(childNodes as PropsNodeType)[0];
  }
  return {
    onClick: (e: Event) => handleSelectedStatus(e, isSelected, specialProps, propName),
    onMouseOver: (e: Event) => onMouseOver(e, key),
    onDragStart: (e: Event) => onDragStart(e, key, parentKey!, parentPropName),
  };
}

export type HookState = {
  componentConfigs: ComponentConfigsType,
  propsConfigSheet: PropsConfigSheetType

}

export const stateSelector: STATE_PROPS[] = ['componentConfigs', 'propsConfigSheet'];

export function controlUpdate(prevState: HookState, nextState: HookState, key: string) {
  return prevState.componentConfigs[key] !== nextState.componentConfigs[key];
}

export interface CommonPropsType extends AllHTMLAttributes<any> {
  specialProps: SelectedInfoBaseType,
  isDragAddChild?:boolean,

  [propsName: string]: any

}

export function propAreEqual(prevProps: CommonPropsType, nextProps: CommonPropsType): boolean {
  return isEqual(prevProps.specialProps, nextProps.specialProps)&&prevProps.isDragAddChild===nextProps.isDragAddChild;
}

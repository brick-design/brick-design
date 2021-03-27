import React, { AllHTMLAttributes, createElement } from 'react';
import {
  ChildNodesType,
  PageConfigType,
  getComponentConfig,
  isContainer,
  MirrorModalFieldType,
  PROPS_TYPES,
  SelectedInfoBaseType,
  STATE_PROPS,
} from '@brickd/core';
import { each, isEmpty, isEqual, map } from 'lodash';
import { FunParamContextProvider } from '@brickd/hooks';

import { resolveMapping, isPureVariable } from '@brickd/utils';
import styles from './style.less';
import { selectClassTarget } from './constants';

import { generateRequiredProps, getComponent, getIframe, } from '../utils';
import StateDomainWrapper from '../wrappers/StateDomainWrapper';
import MapNodesRenderWrapper from '../wrappers/MapNodesRenderWrapper';
import ContainerDiffWrapper from '../wrappers/ContainerDiffWrapper';

export function handlePropsClassName(
  key: string,
  isLockTarget: boolean,
  className: any,
  animateClass: string,
  isAllowAdd?:boolean
) {
  return `${selectClassTarget + key} ${className} ${animateClass}  
  ${isLockTarget ? styles['forbid-event'] : styles['allow-event']}
  ${!isLockTarget&&isAllowAdd?styles['allow-add']:''}`;
}

/**
 * 渲染组件的子节点
 * @param childNodes
 * @param specialProps
 * @param pageConfig
 * @param parentPropName
 * @param isOnlyNode
 */
function renderNodes(
  childNodes: string[],
  specialProps: SelectedInfoBaseType,
  pageConfig: PageConfigType,
  allState: any,
  parentPropName?: string,
  isOnlyNode?: boolean,
) {
  let { domTreeKeys } = specialProps;
  const parentKey = specialProps.key;
  if (parentPropName) {
    domTreeKeys = [...domTreeKeys, `${parentKey}${parentPropName}`];
  }

  const resultChildNodes = map(childNodes, (key) => {
    const { componentName, isStateDomain, loop } = pageConfig[key] || {};
    if (!componentName) return null;
    /** 根据组件类型处理属性 */
    const specialProps = {
      key,
      domTreeKeys: [...domTreeKeys, key],
      parentKey,
      parentPropName,
    };
    if (isStateDomain)
      return <StateDomainWrapper key={key} specialProps={specialProps} />;

    const isCon = isContainer(componentName);
    if (
      (typeof loop === 'string' && isPureVariable(loop)) ||
      Array.isArray(loop)
    ) {
      return map(
        Array.isArray(loop) ? loop : resolveMapping(loop, allState),
        (item, index) => {
          return (
            <MapNodesRenderWrapper
              isContainer={isCon}
              index={index}
              specialProps={specialProps}
              key={`${item.key || item.id||index}${key}`}
              item={item}
            />
          );
        },
      );
    }
    return (
      <ContainerDiffWrapper
        isContainer={isCon}
        key={key}
        specialProps={specialProps}
      />
    );
  });
  /** 如果该组件子节点或者属性子节点要求为单组件返回子组件的第一组件*/
  if (isOnlyNode) {
    return resultChildNodes[0];
  }

  return resultChildNodes;
}

function renderRequiredChildNodes(childNodesRule?: string[]) {
  if (childNodesRule) {
    const componentName = childNodesRule[0];
    return createElement(
      getComponent(componentName),
      generateRequiredProps(componentName),
    );
  } else {
    return <div />;
  }
}

function handleRequiredChildNodes(componentName: string) {
  const { isRequired, nodePropsConfig, childNodesRule } = getComponentConfig(
    componentName,
  );
  const nodeProps: any = {};
  if (isRequired) {
    nodeProps.children = renderRequiredChildNodes(childNodesRule);
  } else if (nodePropsConfig) {
    each(nodePropsConfig, (propConfig, key) => {
      const { isRequired, childNodesRule } = propConfig;
      if (isRequired) {
        nodeProps[key] = renderRequiredChildNodes(childNodesRule);
      }
    });
  }
  return nodeProps;
}

export function handleChildNodes(
  specialProps: SelectedInfoBaseType,
  pageConfig: PageConfigType,
  allState: any,
  children?: ChildNodesType,
) {
  const nodeProps: any = {};
  const { key: parentKey } = specialProps;
  const { componentName } = pageConfig[parentKey];
  if (isEmpty(children)) {
    return handleRequiredChildNodes(componentName);
  }
  const { nodePropsConfig, isOnlyNode } = getComponentConfig(componentName);

  if (!nodePropsConfig) {
    nodeProps.children = renderNodes(
      children as string[],
      specialProps,
      pageConfig,
      allState,
      undefined,
      isOnlyNode,
    );
  } else {
    each(children, (nodes: string[], propName: string) => {
      const { isOnlyNode, isRequired, childNodesRule } = nodePropsConfig![
        propName
      ];
      if (isEmpty(nodes)) {
        return (
          isRequired &&
          (nodeProps[propName] = renderRequiredChildNodes(childNodesRule))
        );
      }

      if (propName.includes('#')) {
        const realPropName = propName.substring(1);
        // eslint-disable-next-line react/display-name
        nodeProps[realPropName] = (...funParams) => {
          return (
            <FunParamContextProvider value={funParams}>
              {renderNodes(
                nodes,
                specialProps,
                pageConfig,
                allState,
                propName,
                isOnlyNode,
              )}
            </FunParamContextProvider>
          );
        };
      } else {
        nodeProps[propName] = renderNodes(
          nodes,
          specialProps,
          pageConfig,
          allState,
          propName,
          isOnlyNode,
        );
      }
    });
  }

  return nodeProps;
}

/**
 * 处理弹窗类容器
 * @param mirrorModalField
 * @param iframeId
 */
export function handleModalTypeContainer(
  mirrorModalField: MirrorModalFieldType,
) {
  const mountedProps: any = {};
  const { displayPropName, mounted } = mirrorModalField;
  if (mounted) {
    const { propName, type } = mounted;
    const iframe: any = getIframe();
    const mountedNode = iframe.contentWindow;
    mountedProps[propName] =
      type === PROPS_TYPES.function ? () => mountedNode : mountedNode;
  }

  return { displayPropName, mountedProps };
}

export type HookState = {
  pageConfig: PageConfigType;
};

export const stateSelector: STATE_PROPS[] = ['pageConfig'];

export function controlUpdate(
  prevState: HookState,
  nextState: HookState,
  key: string,
) {
  return prevState.pageConfig[key] !== nextState.pageConfig[key];
}

export interface CommonPropsType extends AllHTMLAttributes<any> {
  specialProps: SelectedInfoBaseType;
  [propsName: string]: any;
}

export function propAreEqual(
  prevProps: CommonPropsType,
  nextProps: CommonPropsType,
): boolean {
  const { specialProps: prevSpecialProps, ...prevRest } = prevProps;
  const { specialProps, ...rest } = nextProps;
  return isEqual(prevRest, rest) && isEqual(prevSpecialProps, specialProps);
}

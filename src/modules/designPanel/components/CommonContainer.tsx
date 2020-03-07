import React, { createElement, useEffect } from 'react';
import map from 'lodash/map';
import get from 'lodash/get';
import each from 'lodash/each';
import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';
import classNames from 'classnames';
import config from '@/configs';
import isArray from 'lodash/isArray';
import { diffProps, filterProps, formatSpecialProps, getPath, reduxConnect } from '@/utils';
import { ACTION_TYPES } from '@/models';
import styles from '../style.less';
import { SelectedComponentInfoType, VirtualDOMType } from '@/types/ModelType';
import { Dispatch } from 'redux';
import { MirrorModalFieldType } from '@/types/ComponentConfigType';
import { PROPS_TYPES } from '@/types/ConfigTypes';
import { ALL_CONTAINER_COMPONENT_NAMES, oAllComponents } from '@/modules/designPanel/confg';

interface CommonContainerPropsType {
  dispatch: Dispatch,
  selectedComponentInfo: SelectedComponentInfoType,
  hoverKey: string | null,
  componentConfig: VirtualDOMType,
  domTreeKeys: string[],
  containerName: string,
  index: string | number,
  parentPath: string,
  path: string

}

/**
 * 所有的容器组件名称
 */


function CommonContainer(props: CommonContainerPropsType) {
  const {
    componentConfig,
    domTreeKeys,
    path,
    parentPath,
    containerName,
    dispatch,
    selectedComponentInfo,
    hoverKey,
    ...rest
  } = props;

  const { key, childNodes, componentName, addPropsConfig } = componentConfig;

  let requiredProp: string | undefined;
  const { isHovered, isSelected } = selectedStatus(key);
  useEffect(() => {
    if (!isSelected && requiredProp) {
      changeSelectedStatus(null, componentConfig, domTreeKeys, path, parentPath, requiredProp);
    }
  }, [requiredProp, key, componentConfig, isSelected, domTreeKeys, path, parentPath]);

  /**
   * 发送action
   * @param path
   * @param parentPath
   * @param event
   * @param componentConfig
   * @param domTreeKeys
   */
  function changeSelectedStatus(event: Event | null, componentConfig: VirtualDOMType, domTreeKeys: string[], path?: string, parentPath?: string, selectedProp?: string) {
    event && event.stopPropagation && event.stopPropagation();
    let propPath = null;
    const { key, childNodes } = componentConfig;
    const { isSelected } = selectedStatus(key);
    if (!isArray(childNodes) && selectedProp) {
      propPath = `${getPath({ path, isContainer: true })}.${selectedProp}`;
    }
    dispatch({
      type: isSelected ? ACTION_TYPES.clearSelectedStatus : ACTION_TYPES.selectComponent,
      payload: {
        propPath,
        propName: selectedProp,
        path,
        parentPath,
        componentConfig,
        domTreeKeys,
        isRequiredHasChild: !!requiredProp,
      },

    });
  };

  /**
   * 获取要放入组件的容器信息
   * @param event
   * @param path
   * @param componentConfig
   * @param selectedProp
   */
  function getDropTargetInfo(event: Event, path: string, componentConfig: VirtualDOMType, selectedProp: string) {
    event && event.stopPropagation && event.stopPropagation();
    if (!isEmpty(selectedComponentInfo)) return;
    let propPath = null;
    if (selectedProp) {
      propPath = `${getPath({ path, isContainer: true })}.${selectedProp}`;
    }
    dispatch({
      type: ACTION_TYPES.getDropTargetInfo,
      payload: {
        propPath,
        propName: selectedProp,
        path,
        componentConfig,
      },

    });
  }

  /**
   * 拖拽当前组件时获取当前组件的信息
   * @param event
   * @param path
   * @param node
   * @param parentPath
   */
  function onDragStart(event: Event, path: string, node: VirtualDOMType, parentPath?: string) {
    event && event.stopPropagation && event.stopPropagation();
    dispatch({
      type: ACTION_TYPES.getDragData,
      payload: {
        dragData: {
          dragPath: path,
          dragParentPath: parentPath,
          templateData: node,
        },
      },

    });
  }

  /**
   * hover组件上触发
   * @param e
   * @param key
   */
  function onMouseOver(event: Event, key: string) {
    event && event.stopPropagation && event.stopPropagation();
    isEmpty(selectedComponentInfo) && dispatch({
      type: ACTION_TYPES.overTarget,
      payload: {
        hoverKey: key,
      },
    });
  };

  /**
   * 渲染组件的子节点
   * @param childNodes
   * @param path
   * @param propName
   * @returns {Array}
   */
  function renderNodes(childNodes: VirtualDOMType[], path: string, propName?: string, isOnlyNode?: boolean) {
    const parentKey = key;
    const resultChildNodes = map(childNodes, (node, index) => {
      const { componentName, props, key } = node;
      const { propsConfig } = get(config.AllComponentConfigs, componentName);
      const resultPath = getPath({ path, index });
      /** 获取当前子组件在页面配置信息中位置路径 */
      const parentPath = getPath({ path, isContainer: true });
      /**  获取当前子组件在页面配置信息中父组件位置路径 */
      const { isHovered, isSelected } = selectedStatus(key);
      /** 如果有动画类名，添加到className中去 */
      const { className = [], animateClass } = props;
      /** 收集当前子组件所属页面组件树分支中的位置顺序 目的是与页面结构模块关联，精准展开并定位到选中的节点 */
      const resultDomTreeKeys = [...domTreeKeys, parentKey];
      /** 收集所属属性节点的key*/
      propName && resultDomTreeKeys.push(`${parentKey}${propName}`);
      /**收集当前节点的key*/
      resultDomTreeKeys.push(key);

      const handleProps = filterProps(props) || {};
      /** 根据组件类型处理属性 */
      const propsResult = ALL_CONTAINER_COMPONENT_NAMES.includes(componentName) ? {
        key,
        path: resultPath,
        parentPath,
        draggable: true,
        componentConfig: node,
        index,
        domTreeKeys: resultDomTreeKeys,
        selectedComponentInfo,
        dispatch,
        hoverKey,
        ...handleProps,  //必须在使用否则类似tabsPanel的tab属性不起作用
      } : {
        key,
        ...handleProps,
        className: handlePropsClassName(isSelected, isHovered, className, animateClass),
        draggable: true,
        onClick: (e: Event) => changeSelectedStatus(e, node, resultDomTreeKeys, resultPath, parentPath),
        onMouseOver: (e: Event) => onMouseOver(e, key),
        onDragEnter: getDropTargetInfo,
        onDragStart: (e: Event) => onDragStart(e, path, node, parentPath),
      };

      return createElement(get(oAllComponents, componentName) || get(config.OriginalComponents, componentName, componentName), formatSpecialProps(propsResult, propsConfig));
    });

    /** 如果该组件子节点或者属性子节点要求为单组件返回子组件的第一组件*/
    if (isOnlyNode) return resultChildNodes[0];

    return resultChildNodes;
  };

  /**
   * 获取组件选中状态
   * @param key
   * @returns {{isHovered: boolean, isSelected: (boolean|*)}}
   */
  function selectedStatus(key: string) {
    const { selectedKey } = selectedComponentInfo!;
    const isSelected = !!selectedKey && selectedKey.includes(key);
    /** 是否hover到当前组件 */
    const isHovered = hoverKey === key;
    return { isHovered, isSelected };
  }

  /**
   * 处理样式
   * @param isSelected
   * @param isHovered
   * @param className
   * @param animateClass
   */
  const handlePropsClassName = (isSelected: boolean, isHovered: boolean, className: any, animateClass: string) =>
    classNames(isSelected ? styles['container-select-border'] : isHovered && styles['container-hover-border'], className, animateClass);

  /**
   * 处理弹窗类容器
   * @param props
   * @param mirrorModalField
   * @param isSelected
   */
  const handleModalTypeContainer = (props: any, mirrorModalField: MirrorModalFieldType, isSelected: boolean, key: string) => {
    const { domTreeKeys = [] } = selectedComponentInfo;
    const { displayPropName, mounted, style } = mirrorModalField;
    if (mounted) {
      const { propName, type } = mounted;
      const mountedNode:any = document.getElementById('dnd-iframe');
      props[propName] = type === PROPS_TYPES.function ? () => mountedNode.contentDocument.body : mountedNode.contentDocument.body;
    }

    /**
     * 选中组件是否为弹窗类容器组件的子孙节点
     */
    const isVisible = domTreeKeys.includes(key);
    props[displayPropName] = isSelected || isVisible;
    // props.style = props.style ? merge(props.style, style) : { ...style };
  };

  /**
   * 处理容器组件属性
   * @returns {*|{onMouseOver: (function(*=): void), onClick: (function(*=): *), onDragStart: (function(*=): void), onDragEnter: (function(*=): *)}}
   */
  function handleProps() {
    const { props } = componentConfig;
    const propsResult = diffProps(rest, cloneDeep(props));
    const { animateClass, className } = propsResult;
    const { mirrorModalField, nodePropsConfig, propsConfig } = get(config.AllComponentConfigs, componentName);
    /** 收集当前子组件所属页面组件树分支中的位置顺序 目的是与页面结构模块关联，精准展开并定位到选中的节点 */
    propsResult.className = handlePropsClassName(isSelected, isHovered, className, animateClass);

    /**默认选中的属性节点的属性名*/
    let defaultSelectedProp: string;
    /**
     * 处理组件的子组件
     */
    if (!isEmpty(childNodes)) {
      /**
       * 多属性子组件处理
       */
      if (nodePropsConfig) {
        /**
         * 属性节点是否大于1个
         * @type {boolean}
         */
        let isMultiProps = Object.keys(nodePropsConfig).length > 1;
        each(nodePropsConfig, (nodePropConfig, propName) => {
          const { isOnlyNode, type, isRequired, childNodesRule } = nodePropConfig;
          const childNodesPath = getPath({ path: propName, isContainer: true }) || '';
          let analysisChildNodes = get(childNodes, childNodesPath, childNodes);
          let analysisPath = path;
          let analysisPropName: string | undefined;
          defaultSelectedProp = propName;
          if (isEmpty(analysisChildNodes)) {
            if (isRequired) {
              propsResult[propName] = createElement(get(config.OriginalComponents, get(childNodesRule, 0, ''), 'div'));
              return requiredProp = propName;
            }
            return;
          }
          /**
           * 多属性节点处理
           */
          if (isMultiProps) {
            analysisPath = `${getPath({ path, isContainer: true })}.${propName}`;
            analysisPropName = propName;
          }
          const reactNodes = renderNodes(analysisChildNodes, analysisPath, analysisPropName, isOnlyNode);
          propsResult[propName] = type === PROPS_TYPES.functionReactNode ? () => reactNodes : reactNodes;
        });
      } else {
        propsResult.children = renderNodes(childNodes as VirtualDOMType[], path);
      }

    }

    /** 对于弹窗类组件做特殊处理使其被选中时可展示 */
    if (mirrorModalField) {
      handleModalTypeContainer(propsResult, mirrorModalField, isSelected, key);
    }
    /** 为组件添加选中时的效果样式 */
    /** 为选中组件添加id使图片生产工具可以找到要生成图片的节点 */
    isSelected && (propsResult.id = 'select-img');
    requiredProp && (defaultSelectedProp = requiredProp);

    return {
      ...formatSpecialProps(propsResult, merge({}, propsConfig, addPropsConfig)),
      onClick: (e: Event) => changeSelectedStatus(e, componentConfig, domTreeKeys, path, parentPath, defaultSelectedProp),
      onMouseOver: (e: Event) => onMouseOver(e, key),
      onDragEnter: (e: Event) => getDropTargetInfo(e, path, componentConfig, defaultSelectedProp),
      onDragStart: (e: Event) => onDragStart(e, path, componentConfig, parentPath),
      onDragOver:(e:Event)=>e.preventDefault(),
      onDrop:(e:Event)=>{
        e.stopPropagation()
        dispatch({type:ACTION_TYPES.addComponent})
      }
    };
  }

  return (
    createElement(get(config.OriginalComponents, containerName, containerName), handleProps())
  );
}

export default CommonContainer;



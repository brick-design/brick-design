import React, { createElement, useCallback, useEffect, useMemo } from 'react';
import map from 'lodash/map';
import get from 'lodash/get';
import each from 'lodash/each';
import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';
import classNames from 'classnames';
import config from '@/configs';
import isArray from 'lodash/isArray';
import { diffProps, filterProps, formatSpecialProps, getPath, handleModalTypeContainer, reduxConnect } from '@/utils';
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
  const { selectedKey,domTreeKeys:selectedDomTreeKeys=[] } = selectedComponentInfo!;


  let requiredProp: string | undefined;
  /**
   * 获取组件选中状态
   * @param key
   * @returns {{isHovered: boolean, isSelected: (boolean|*)}}
   */
  const selectedStatus=useCallback((key: string,hoverKey:string|null,selectedKey?:string)=> {
    const isSelected = !!selectedKey && selectedKey.includes(key);
    /** 是否hover到当前组件 */
    const isHovered = hoverKey === key;
    return { isHovered, isSelected };
  },[])

  const { isHovered, isSelected } = selectedStatus(key,hoverKey,selectedKey);

  const changeSelectedStatus=useCallback((event: Event | null, componentConfig: VirtualDOMType,
                                          domTreeKeys: string[], path?: string, parentPath?: string, selectedProp?: string)=> {
    event && event.stopPropagation && event.stopPropagation();
    let propPath = null;
    const { key, childNodes } = componentConfig;
    const { isSelected } = selectedStatus(key,hoverKey,selectedKey);
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
  },[hoverKey,selectedKey,requiredProp]);
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

  /**
   * 获取要放入组件的容器信息
   * @param event
   * @param path
   * @param componentConfig
   * @param selectedProp
   */
  const getDropTargetInfo=useCallback((event: Event, path: string, componentConfig: VirtualDOMType, selectedProp: string)=> {
     event.stopPropagation();
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
  },[selectedComponentInfo])

  /**
   * 拖拽当前组件时获取当前组件的信息
   * @param event
   * @param path
   * @param node
   * @param parentPath
   */
  const onDragStart=useCallback((event: Event, path: string, node: VirtualDOMType, parentPath?: string)=>{
     event.stopPropagation();
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
  },[])

  /**
   * hover组件上触发
   * @param e
   * @param key
   */
  const onMouseOver=useCallback((event: Event, key: string)=> {
     event.stopPropagation();
    isEmpty(selectedComponentInfo) && dispatch({
      type: ACTION_TYPES.overTarget,
      payload: {
        hoverKey: key,
      },
    });
  },[selectedComponentInfo])

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
      const { isHovered, isSelected } = selectedStatus(key,hoverKey,selectedKey);
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
  }



  /**
   * 处理样式
   * @param isSelected
   * @param isHovered
   * @param className
   * @param animateClass
   */
  const handlePropsClassName = useCallback((isSelected: boolean, isHovered: boolean, className: any, animateClass: string) =>
    classNames(isSelected ? styles['container-select-border'] : isHovered && styles['container-hover-border'], className, animateClass),[])


  /**
   * 处理容器组件属性
   * @returns {*|{onMouseOver: (function(*=): void), onClick: (function(*=): *), onDragStart: (function(*=): void), onDragEnter: (function(*=): *)}}
   */
  function handleProps() {
    const { props } = componentConfig;
    const propsResult = useMemo(()=>diffProps(rest, cloneDeep(props)),[rest,props]);
    const { animateClass, className } = propsResult;
    const { mirrorModalField, nodePropsConfig, propsConfig } = useMemo(()=>get(config.AllComponentConfigs, componentName),[]);
    /** 收集当前子组件所属页面组件树分支中的位置顺序 目的是与页面结构模块关联，精准展开并定位到选中的节点 */
    propsResult.className = useMemo(()=>handlePropsClassName(isSelected, isHovered, className, animateClass),[isSelected, isHovered, className, animateClass]);

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
        let isMultiProps = useMemo(()=>Object.keys(nodePropsConfig).length,[] )> 1;
        each(nodePropsConfig, (nodePropConfig, propName) => {
          const { isOnlyNode, type, isRequired, childNodesRule } = nodePropConfig;
          const childNodesPath = useMemo(()=>getPath({ path: propName, isContainer: true }),[]) || '';
          let analysisChildNodes = useMemo(()=>get(childNodes, childNodesPath, childNodes),[childNodes]);
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
     const {displayPropName,mountedProps}=useMemo(()=>handleModalTypeContainer(mirrorModalField,'dnd-iframe'),[]);
      const isVisible = selectedDomTreeKeys.includes(key);
      propsResult[displayPropName]=isSelected||isVisible
      merge(propsResult,mountedProps)
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
      onDragOver:useCallback((e:Event)=>e.preventDefault(),[]),
      onDrop:useCallback((e:Event)=>{
        e.stopPropagation()
        dispatch({type:ACTION_TYPES.addComponent})
      },[])
    };
  }

  return (
    createElement(get(config.OriginalComponents, containerName, containerName), handleProps())
  );
}

export default CommonContainer;



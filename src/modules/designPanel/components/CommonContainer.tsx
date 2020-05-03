import React, { createElement, forwardRef, useEffect, useMemo, useRef } from 'react';
import map from 'lodash/map';
import get from 'lodash/get';
import each from 'lodash/each';
import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';
import classNames from 'classnames';
import config from '@/configs';
import isArray from 'lodash/isArray';
import { diffProps, filterProps, formatSpecialProps, getPath, handleModalTypeContainer, usePrevious } from '@/utils';
import { ACTION_TYPES } from '@/models';
import styles from '../style.less';
import { SelectedComponentInfoType, VirtualDOMType } from '@/types/ModelType';
import { Dispatch } from 'redux';
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

let dispatch: Dispatch;

/**
 * 获取组件选中状态
 * @param key
 * @returns {{isHovered: boolean, isSelected: (boolean|*)}}
 */
function selectedStatus(key: string, hoverKey: string | null, selectedKey?: string) {
  const isSelected = !!selectedKey && selectedKey.includes(key);
  /** 是否hover到当前组件 */
  const isHovered = hoverKey === key;
  return { isHovered, isSelected };
}

/**
 * 改变选中状态
 */

function changeSelectedStatus(event: any,
                              componentConfig: VirtualDOMType,
                              domTreeKeys: string[],
                              hoverKey:string|null,
                              selectedKey?:string,
                              requiredProp?:string,
                              path?: string,
                              parentPath?: string,
                              selectedProp?: string) {
  event && event.stopPropagation && event.stopPropagation();
  let propPath = null;
  const { key, childNodes } = componentConfig;
  const { isSelected } = selectedStatus(key, hoverKey, selectedKey);
  selectedProp=requiredProp||selectedProp
  if (!isArray(childNodes) && selectedProp) {
    propPath = `${getPath({ path, isContainer: true })}.${selectedProp}`;
  }
  dispatch({
    type: isSelected && event ? ACTION_TYPES.clearSelectedStatus : ACTION_TYPES.selectComponent,
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
}



/**
 * 获取要放入组件的容器信息
 * @param event
 * @param path
 * @param componentConfig
 * @param selectedProp
 */
export function getDropTargetInfo (event: Event, path?: string, componentConfig?: VirtualDOMType, selectedProp?: string,noHasSelectedInfo?:boolean) {
  event.stopPropagation();
  /**
   * 如果当前有选择组件那么设计面板拖拽嵌套被禁用
   */
  if(noHasSelectedInfo!==undefined&&!noHasSelectedInfo) return
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
function onDragStart (event: Event, path: string, node: VirtualDOMType, parentPath?: string){
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
}

/**
 * hover组件上触发
 * @param e
 * @param key
 */
function onMouseOver(event: Event, key: string,noHasSelectedInfo:boolean) {
  event.stopPropagation();
  if(noHasSelectedInfo){
    dispatch({
      type: ACTION_TYPES.overTarget,
      payload: {
        hoverKey: key,
      },
    });
  }

}

/**
 * 渲染组件的子节点
 * @param childNodes
 * @param path
 * @param propName
 * @returns {Array}
 */
function renderNodes(childNodes: VirtualDOMType[], path: string,parentProps:CommonContainerPropsType, propName?: string, isOnlyNode?: boolean) {
  const {hoverKey,domTreeKeys,selectedComponentInfo,componentConfig:{key:parentKey}}=parentProps

  const {selectedKey}=selectedComponentInfo
  const resultChildNodes = map(childNodes, (node, index) => {
    const { componentName, props, key } = node;
    const { propsConfig } = get(config.AllComponentConfigs, componentName);
    const resultPath = getPath({ path, index });
    /** 获取当前子组件在页面配置信息中位置路径 */
    const parentPath = getPath({ path, isContainer: true });
    /**  获取当前子组件在页面配置信息中父组件位置路径 */
    const { isHovered, isSelected } = selectedStatus(key, hoverKey, selectedKey);
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
      isSelected,
      ...handleProps,
      className: handlePropsClassName(isSelected, isHovered, className, animateClass),
      draggable: true,
      onClick: (e: Event) => changeSelectedStatus(e, node, resultDomTreeKeys,hoverKey, selectedKey,undefined, resultPath, parentPath),
      onMouseOver: (e: Event) => onMouseOver(e, key,isEmpty(selectedComponentInfo)),
      onDragEnter: getDropTargetInfo,
      onDragStart: (e: Event) => onDragStart(e, path, node, parentPath),
    };

    return createElement(get(oAllComponents, componentName), formatSpecialProps(propsResult, propsConfig));
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
function handlePropsClassName (isSelected: boolean, isHovered: boolean, className: any, animateClass: string) {
  return   classNames(isSelected ? styles['container-select-border'] : isHovered && styles['container-hover-border'], className, animateClass);
}



/**
 * 处理容器组件属性
 * @returns {*|{onMouseOver: (function(*=): void), onClick: (function(*=): *), onDragStart: (function(*=): void), onDragEnter: (function(*=): *)}}
 */
function handleProps(parentProps:any,isSelected:boolean, isHovered:boolean,requiredProp:any) {
  const {
    componentConfig,
    containerName,
    parentPath,
    path,
    index,
    domTreeKeys = [],
    dispatch,
    hoverKey,
    selectedComponentInfo,
    selectedComponentInfo: {selectedKey,  domTreeKeys:selectedDomTreeKeys=[] },
    ...rest
  } = parentProps;
  requiredProp.current=undefined
  const  { key, componentName, props, childNodes,addPropsConfig }=componentConfig
  const propsResult = useMemo(()=>diffProps(rest, cloneDeep(props)),[rest, props]);
  const { animateClass, className } = propsResult;
  const { mirrorModalField, nodePropsConfig, propsConfig } = useMemo(() => get(config.AllComponentConfigs, componentName), []);
  /** 收集当前子组件所属页面组件树分支中的位置顺序 目的是与页面结构模块关联，精准展开并定位到选中的节点 */
  propsResult.className = useMemo(() => handlePropsClassName(isSelected, isHovered, className, animateClass), [isSelected, isHovered, className, animateClass]);
  /**
   * 是否有选中的组件
   */
  const noHasSelectedInfo= isEmpty(selectedComponentInfo)
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
      let isMultiProps =  Object.keys(nodePropsConfig).length > 1;
      each(nodePropsConfig, (nodePropConfig, propName) => {
        const { isOnlyNode, type, isRequired, childNodesRule } = nodePropConfig;
        const childNodesPath = getPath({ path: propName, isContainer: true })|| '';
        let analysisChildNodes =  get(childNodes, childNodesPath, childNodes)
        let analysisPath = path;
        let analysisPropName: string | undefined;
        defaultSelectedProp = propName;
        if (isEmpty(analysisChildNodes)) {
          if (isRequired) {
            propsResult[propName] = createElement(get(config.OriginalComponents, get(childNodesRule, 0, ''), 'div'));
            return requiredProp.current = propName;
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
        const reactNodes = renderNodes(analysisChildNodes, analysisPath,parentProps, analysisPropName, isOnlyNode);
        propsResult[propName] = type === PROPS_TYPES.functionReactNode ? () => reactNodes : reactNodes;
      });
    } else {
      propsResult.children = renderNodes(childNodes as VirtualDOMType[], path,parentProps);
    }

  }

  /** 对于弹窗类组件做特殊处理使其被选中时可展示 */
  if (mirrorModalField) {
    const { displayPropName, mountedProps } = useMemo(()=>handleModalTypeContainer(mirrorModalField, 'dnd-iframe'),[])
    const isVisible = selectedDomTreeKeys.includes(key);
    propsResult[displayPropName] = isSelected || isVisible;
    merge(propsResult, mountedProps);
  }
  /** 为组件添加选中时的效果样式 */
  /** 为选中组件添加id使图片生产工具可以找到要生成图片的节点 */
  isSelected && (propsResult.id = 'select-img');
  requiredProp.current && (defaultSelectedProp = requiredProp.current);

  return {
    ...formatSpecialProps(propsResult, merge({}, propsConfig, addPropsConfig)),
    onClick: (e: any) => changeSelectedStatus(e, componentConfig, domTreeKeys,hoverKey,
    selectedKey,requiredProp.current, path, parentPath, defaultSelectedProp),
    onMouseOver: (e: any) => onMouseOver(e, key,noHasSelectedInfo),
    onDragEnter: (e: any) => getDropTargetInfo(e, path, componentConfig, defaultSelectedProp,noHasSelectedInfo),
    onDragStart: (e: any) => onDragStart(e, path, componentConfig, parentPath),
  };
}

/**
 * 所有的容器组件名称
 */


function CommonContainer(props: CommonContainerPropsType,ref:any) {
  const {
    componentConfig,
    domTreeKeys,
    path,
    parentPath,
    containerName,
    selectedComponentInfo,
    hoverKey,
  } = props;

  dispatch=props.dispatch
  const { key} = componentConfig;
  const { selectedKey,propName} = selectedComponentInfo!;

  let requiredProp=useRef<string|undefined>();
  const prevPath:any=usePrevious(path)

  const { isHovered, isSelected } = selectedStatus(key, hoverKey, selectedKey);

  useEffect(() => {
    if (isSelected) {
      changeSelectedStatus(null, componentConfig, domTreeKeys,hoverKey, selectedKey, requiredProp.current, path, parentPath, propName);
    }
  }, []);

  useEffect(() => {

    if (!isSelected && requiredProp.current||isSelected&&prevPath&&path!==prevPath) {

      changeSelectedStatus(null, componentConfig, domTreeKeys,hoverKey, selectedKey, requiredProp.current, path, parentPath, propName);
    }
  }, [requiredProp.current,propName, key, componentConfig, isSelected,hoverKey, selectedKey, domTreeKeys, path,prevPath, parentPath]);


  return (
    createElement(get(config.OriginalComponents, containerName, containerName), {...handleProps(props,isSelected,isHovered,requiredProp),ref})
  );
}

export default forwardRef(CommonContainer);



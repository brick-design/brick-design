import React, { createElement, Component } from 'react';
import map from 'lodash/map';
import get from 'lodash/get';
import each from 'lodash/each';
import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';
import classNames from 'classnames';
import {
  ALL_CONTAINER_COMPONENT_NAMES,
  AllComponentConfigs,
  oAllComponents,
  OriginalComponents,
} from '@/configs';
import {message} from 'antd'
import { formatSpecialProps, getPath, reduxConnect } from '@/utils';
import {ACTION_TYPES} from '@/models'
import styles from '../style.less';
import { SelectedComponentInfoType, VirtualDOMType } from '@/types/ModelType';
import {Dispatch} from 'redux'
import { MirrorModalFieldType } from '@/types/ComponentConfigType';
import { PROPS_TYPES } from '@/types/ConfigTypes';

interface CommonContainerPropsType {
  dispatch:Dispatch,
  selectedComponentInfo:SelectedComponentInfoType,
  hoverKey:string|null,
  componentConfig:VirtualDOMType,
  domTreeKeys:string[],
  containerName:string,
  index:string|number,
  parentPath:string,
  path:string

}

@reduxConnect(['selectedComponentInfo', 'hoverKey'])
class CommonContainer extends Component<CommonContainerPropsType,any> {
  private requiredProp?:string
  /**
   * 发送action
   * @param path
   * @param parentPath
   * @param event
   * @param componentConfig
   * @param domTreeKeys
   */
  changeSelectedStatus = (event:Event, componentConfig:VirtualDOMType, domTreeKeys:string[], path?:string, parentPath?:string,selectedProp?:string) => {
    event && event.stopPropagation && event.stopPropagation();
    let propPath = null;
    const { dispatch } = this.props;
    const { key } = componentConfig;
    const {isSelected } =this.selectedStatus(key)
    if(isSelected&&this.requiredProp) return message.warning('当前选中组件必须拥有有子节点')
    if (selectedProp) {
      propPath = `${getPath({ path, isContainer: true })}.${selectedProp}`;
    }
    dispatch({
      type: isSelected ? ACTION_TYPES.clearSelectedStatus : ACTION_TYPES.selectComponent,
      payload:{
        propPath,
        propName: selectedProp,
        path,
        parentPath,
        componentConfig,
        domTreeKeys,
        isRequiredHasChild:!!this.requiredProp
      }

    });
  };

  /**
   * 获取要放入组件的容器信息
   * @param event
   * @param path
   * @param componentConfig
   * @param selectedProp
   */
  getDropTargetInfo=(event:Event,path:string, componentConfig:VirtualDOMType,selectedProp:string)=>{
    event&& event.stopPropagation && event.stopPropagation();
    const {selectedComponentInfo}=this.props
    if(!isEmpty(selectedComponentInfo)) return
    let propPath = null;
    const { dispatch} = this.props;
    if (selectedProp) {
      propPath = `${getPath({ path, isContainer: true })}.${selectedProp}`;
    }
    dispatch({
      type:ACTION_TYPES.getDropTargetInfo,
      payload:{
        propPath,
        propName: selectedProp,
        path,
        componentConfig,
      }

    })
  }

  /**
   * 拖拽当前组件时获取当前组件的信息
   * @param event
   * @param path
   * @param node
   * @param parentPath
   */
  onDragStart=(event:Event,path:string,node:VirtualDOMType,parentPath?:string)=>{
    event&& event.stopPropagation && event.stopPropagation();
    const {dispatch}=this.props
    dispatch({
      type:ACTION_TYPES.getDragData,
      payload:{
        dragData:{
          dragPath:path,
          dragParentPath:parentPath,
          templateData:node
        }
      }

    })
}
  /**
   * hover组件上触发
   * @param e
   * @param key
   */
  onMouseOver = (event:Event, key:string) => {
    event && event.stopPropagation && event.stopPropagation();
    const { dispatch, selectedComponentInfo } = this.props;
    isEmpty(selectedComponentInfo) && dispatch({
      type: ACTION_TYPES.overTarget,
      payload:{
        hoverKey: key
      }
    });
  };

  /**
   * 渲染组件的子节点
   * @param childNodes
   * @param path
   * @param propName
   * @returns {Array}
   */
  renderNodes = (childNodes:VirtualDOMType[], path:string, propName?:string, isOnlyNode?:boolean) => {
    const {
      componentConfig: { key: parentKey },
      domTreeKeys = [] } = this.props;
    const resultChildNodes = map(childNodes, (node, index) => {
      const { componentName, props, key } = node;
      const { propsConfig } = get(AllComponentConfigs, componentName, {});
      const resultPath = getPath({ path, index });
      /** 获取当前子组件在页面配置信息中位置路径 */
      const parentPath = getPath({ path, isContainer: true });
      /**  获取当前子组件在页面配置信息中父组件位置路径 */
      const {isHovered,isSelected}=this.selectedStatus(key)
      /** 如果有动画类名，添加到className中去 */
      const { className = [], animateClass } = props;
      /** 收集当前子组件所属页面组件树分支中的位置顺序 目的是与页面结构模块关联，精准展开并定位到选中的节点 */
      const resultDomTreeKeys = [...domTreeKeys, parentKey];
      /** 收集所属属性节点的key*/
      propName && resultDomTreeKeys.push(`${parentKey}${propName}`);
      /**收集当前节点的key*/
      resultDomTreeKeys.push(key);

      /** 根据组件类型处理属性 */
      const propsResult = ALL_CONTAINER_COMPONENT_NAMES.includes(componentName) ? {
        key,
        path: resultPath,
        parentPath,
        componentConfig: node,
        index,
        domTreeKeys: resultDomTreeKeys,
        ...props  //必须在使用否则类似tabsPanel的tab属性不起作用
      } : {
        key,
        ...props,
        className:this.handlePropsClassName(isSelected,isHovered,className,animateClass),
        draggable:true,
        onClick:(e:Event) => this.changeSelectedStatus( e, node, resultDomTreeKeys,resultPath, parentPath),
        onMouseOver: (e:Event) => this.onMouseOver(e, key),
        onDragEnter:this.getDropTargetInfo,
        onDragStart:(e:Event)=>this.onDragStart(e,path,node,parentPath)
      };

      return createElement(get(oAllComponents, componentName,componentName), formatSpecialProps(propsResult, propsConfig));
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
  selectedStatus=(key:string)=>{
    const {selectedComponentInfo:{selectedKey},hoverKey}=this.props
    const isSelected = !!selectedKey && selectedKey.includes(key);
    /** 是否hover到当前组件 */
    const isHovered = hoverKey === key && !selectedKey;
    return {isHovered,isSelected}
  }

  /**
   * 处理样式
   * @param isSelected
   * @param isHovered
   * @param className
   * @param animateClass
   */
  handlePropsClassName=(isSelected:boolean,isHovered:boolean,className:any, animateClass:string)=>classNames(isSelected ? styles['container-select-border'] : (isHovered && styles['container-hover-border']), className, animateClass);

  /**
   * 处理弹窗类容器
   * @param props
   * @param mirrorModalField
   * @param isSelected
   */
  handleModalTypeContainer=(props:any,mirrorModalField:MirrorModalFieldType,isSelected:boolean,key:string)=>{
    const {
      selectedComponentInfo: {  domTreeKeys=[] },
    }=this.props
    const { displayPropName, mounted, style } = mirrorModalField;
    if(mounted){
      const{ propName, type }=mounted
      const mountedNode = document.getElementById('dnd-container');
      props[propName] = type === PROPS_TYPES.function ? () => mountedNode : mountedNode;
    }

    /**
     * 选中组件是否为弹窗类容器组件的子孙节点
     */
    const isVisible = domTreeKeys.includes(key);
    props[displayPropName] = isSelected || isVisible;
    props.style=props.style?merge(props.style,style):{...style}
  }
  /**
   * 处理容器组件属性
   * @returns {*|{onMouseOver: (function(*=): void), onClick: (function(*=): *), onDragStart: (function(*=): void), onDragEnter: (function(*=): *)}}
   */
  handleProps=()=>{
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
      ...rest
    } = this.props;
    const  { key, componentName, props, childNodes,addPropsConfig }=componentConfig
    this.requiredProp=undefined;
    const propsResult = cloneDeep(props);
    const { animateClass, className } = propsResult;
    const { mirrorModalField, nodePropsConfig, propsConfig} = get(AllComponentConfigs, componentName, {});
    /** 收集当前子组件所属页面组件树分支中的位置顺序 目的是与页面结构模块关联，精准展开并定位到选中的节点 */
    const{isHovered,isSelected}=this.selectedStatus(key)
    propsResult.className =this.handlePropsClassName(isSelected,isHovered,className,animateClass)

      /**默认选中的属性节点的属性名*/
    let defaultSelectedProp:string;
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
        let isMultiProps=  Object.keys(nodePropsConfig).length>1
        each(nodePropsConfig, (nodePropConfig, propName) => {
          const { isOnlyNode, type,isRequired } = nodePropConfig;
          const childNodesPath=getPath({ path: propName, isContainer: true })||''
          let analysisChildNodes = get(childNodes,childNodesPath ,childNodes);
          let analysisPath = path;
          let analysisPropName:string|undefined;
          defaultSelectedProp = propName;
          if (isEmpty(analysisChildNodes)) {
            if(isRequired){
              return  this.requiredProp=propName
            }
            return
          }
          /**
           * 多属性节点处理
           */
          if (isMultiProps) {
            analysisPath = `${getPath({ path, isContainer: true })}.${propName}`;
            analysisPropName = propName;
          }
          const reactNodes = this.renderNodes(analysisChildNodes, analysisPath, analysisPropName, isOnlyNode);
          propsResult[propName] =type === PROPS_TYPES.functionReactNode? () => reactNodes:reactNodes;
        });
      } else {
        propsResult.children = this.renderNodes(childNodes as VirtualDOMType[], path);
      }

    }

    /** 对于弹窗类组件做特殊处理使其被选中时可展示 */
    if (mirrorModalField) {
      this.handleModalTypeContainer(propsResult,mirrorModalField,isSelected,key)
    }
    /** 为组件添加选中时的效果样式 */
    /** 为选中组件添加id使图片生产工具可以找到要生成图片的节点 */
    isSelected && (propsResult.id = 'select-img');
    this.requiredProp&&(defaultSelectedProp=this.requiredProp)
    return{
      draggable:true,
      ...formatSpecialProps(propsResult, merge({},propsConfig,addPropsConfig)),
      onClick: (e:Event) => this.changeSelectedStatus(e, componentConfig, domTreeKeys,path, parentPath,  defaultSelectedProp),
      onMouseOver: (e:Event) => this.onMouseOver(e, key),
      onDragEnter:(e:Event) => this.getDropTargetInfo(e,path, componentConfig,defaultSelectedProp),
      onDragStart:(e:Event)=>this.onDragStart(e,path,componentConfig,parentPath),
      ...rest  //必须放在最后边
    }
  }

  render() {
    const {containerName}=this.props
    return (
      createElement(get(OriginalComponents, containerName, containerName), this.handleProps())
    );
  }
}

export default CommonContainer

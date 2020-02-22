import each from 'lodash/each';
import update from 'lodash/update';
import get from 'lodash/get';
import cloneDeep from 'lodash/cloneDeep';
import filter from 'lodash/filter';
import isEmpty from 'lodash/isEmpty';
import keys from 'lodash/keys';
import merge from 'lodash/merge';
import { message } from 'antd';
import uuid from 'uuid';
import {
  copyConfig,
  generateNewKey,
  getFieldInPropsPath,
  getNewSortChildNodes,
  getPath, handleRequiredHasChild,
} from '@/utils';
import { ALL_CONTAINER_COMPONENT_NAMES, AllComponentConfigs } from '@/configs';

import { generatePageCode } from '@/modules/previewAndCode/utils';
import { addTemplates, deleteTemplate, getTemplates, searchTemplate } from '@/service';
import {
  ModelType,
  PropsNodeType,
  PropsSettingType,
  SelectedComponentInfoType,
  VirtualDOMType,
} from '@/types/ModelType';

const handleComponentInfo=(payload:any)=> {
  const { propName, componentConfig } = payload;
  const { parentName, childNodes } = componentConfig;
  let { componentName} = componentConfig;
  componentName = parentName || componentName;
  const isContainer = !!childNodes
  let { childNodesRule, nodePropsConfig} = get(AllComponentConfigs, componentName, {});
  if(nodePropsConfig){
    if(propName){
      childNodesRule = get(nodePropsConfig, `${propName}.childNodesRule`)
    }else {
      each(nodePropsConfig,(config)=>{
        const{childNodesRule:propsChildNodesRule}=config
        propsChildNodesRule&&(childNodesRule=propsChildNodesRule)

      })
    }

  }
  const isOnlyNode:boolean=get(nodePropsConfig,`${propName}.isOnlyNode`)
  return {
    isContainer,
    isOnlyNode,
    childNodesRule,
    componentName
  }
}

/**
 * 初始默认组件
 * @type {{childNodes: Array, componentName: string, key: string, props: {style: {height: string}}}}
 */
const DEFAULT_LAYOUT :VirtualDOMType = {
  key: `n${Date.now()}`,
  componentName: 'Layout',
  props: { style: {height:'100%'} },
  childNodes: [],
};
/**
 * 命名空间
 * @type {string}
 */
export const namespace='BLOCK_NAME_CAMEL_CASE'

/**
 * actions
 */
export const ACTION_TYPES:{[propName: string]: string}={
  submitConfigs:`${namespace}/submitConfigs`,
  searchTemplate:`${namespace}/searchTemplate`,
  getTemplateList:`${namespace}/getTemplateList`,
  outputFiles:`${namespace}/outputFiles`,
  addTemplateInfo:`${namespace}/addTemplateInfo`,
  deleteTemplate:`${namespace}/deleteTemplate`,
  saveTemplateInfos:`${namespace}/saveTemplateInfos`,
  addComponent:`${namespace}/addComponent`,
  copyComponent:`${namespace}/copyComponent`,
  onLayoutSortChange:`${namespace}/onLayoutSortChange`,
  clearSelectedStatus:`${namespace}/clearSelectedStatus`,
  selectComponent:`${namespace}/selectComponent`,
  clearChildNodes:`${namespace}/clearChildNodes`,
  deleteComponent:`${namespace}/deleteComponent`,
  addPropsConfig:`${namespace}/addPropsConfig`,
  deletePropsConfig:`${namespace}/deletePropsConfig`,
  changeStyles:`${namespace}/changeStyles`,
  submitProps:`${namespace}/submitProps`,
  overTarget:`${namespace}/overTarget`,
  clearHovered:`${namespace}/clearHovered`,
  undo:`${namespace}/undo`,
  redo:`${namespace}/redo`,
  getDragData:`${namespace}/getDragData`,
  getDropTargetInfo:`${namespace}/getDropTargetInfo`
}
const Model:ModelType= {
  namespace,
  state: {
    componentConfigs: [DEFAULT_LAYOUT], // 所有组件信息
    selectedComponentInfo: {}, // 选中组件的信息
    propsSetting: {},  // 属性设置暂存属性数据
    styleSetting: {},
    undo: [],
    redo: [],
    templateInfos: [], // 复合组件
    newAddKey: null,
    hoverKey: null,
    dragData:null,
    dropTargetInfo:null
  },
  effects: {
    * submitConfigs({ payload }, { select }) {
      const componentConfigs = yield select(state => get(state, `${namespace}.componentConfigs`));

      const { pageCodes, styleSheetCodes } = generatePageCode(componentConfigs);

      // if(res&&res.id){
      //   message.success('页面配置更新成功！！');
      // } else {
      //   message.error('配置信息更新失败!')
      // }
    },
    * searchTemplate({payload},{put}){
      const templateInfo=yield new Promise(function(resolve) {
        searchTemplate(payload.searchValue,resolve)
      })
      yield put({
        type: 'saveTemplateInfos',
        templateInfos:templateInfo?[templateInfo]:[],
      })
    },
    * getTemplateList(_, { put }) {
      const templateInfos = yield new Promise(function(resolve) {
        getTemplates(resolve);
      });
      yield put({
        type: 'saveTemplateInfos',
        payload:{
          templateInfos
        }
      });
    },
    * addTemplateInfo({ payload }, { put }) {
      yield new Promise(function(resolve) {
        addTemplates(payload, resolve);
      });
      yield put({
        type: 'getTemplateList',
      });

    },
    * deleteTemplate({ payload }, { put }) {
      const { id } = payload;
      yield new Promise(function(resolve) {
        deleteTemplate(id, resolve);
      });
      yield put({
        type: 'getTemplateList',
      });
    },
  },
  reducers: {

    saveTemplateInfos(state, {payload}) {
      return {
        ...state,
        ...payload,
      };
    },
    /**
     * 往画板或者容器组件添加组件
     * @param state
     * @returns {{componentConfigs: *}}
     */
    addComponent(state) {
      const {
        undo, redo,
        componentConfigs: prevComponentConfigs,
        selectedComponentInfo,
        dragData,
        dropTargetInfo
      } = state;
      const { defaultProps = {}, componentName, templateData,dragPath,dragParentPath }=dragData!
      const { propPath, path, isOnlyNode,isContainer, childNodesRule, componentName: selectedComponentName, propName }=dropTargetInfo!||selectedComponentInfo;
      // 找到新添加组件所要放置的路径位置
      const parentPath = getPath({ path: propPath || path, isContainer: true });
      /**
       * 如果在有跟节点的情况下选中组件为非容器组件，
       * 或者拖拽组件的父节点路径与当前选中组件的子节点路径相同表明拖拽组件没有拖出它所在的容器，
       * 或者拖拽组件的路径与当前选中组件的路径相同表明为它自己
       */
      if(!isContainer&&!isEmpty(prevComponentConfigs)||dragParentPath&&parentPath===dragParentPath ||dragPath&&dragPath===path){
        return  state
      }

      const componentConfigs = cloneDeep(prevComponentConfigs);
      const isTemplate = !isEmpty(templateData);
      let newAddKey:any=null,info:VirtualDOMType;
      if(dragParentPath){
        info=templateData!
      }else if(isTemplate){
        info= generateNewKey(templateData!)
      }else {
        info = {
          key: uuid(),
          componentName:componentName!,
          props: defaultProps, // 最终输出当前组件的属性树
        };
      }

      /**
       * 获取当前拖拽组件的父组件规则，以及属性节点配置信息
       */
      const { nodePropsConfig, parentNodesRule } = get(AllComponentConfigs, info.componentName, {});
      /**
       * 父组件规则限制，减少不必要的组件错误嵌套
       */
      if (parentNodesRule && !parentNodesRule.includes(propName ? `${selectedComponentName}.${propName}` : selectedComponentName)) {
        message.warning(`${info.componentName}:只允许放入${parentNodesRule.toString()}组件或者属性中`);
        return state;
      }
      /**
       * 子组件规则限制，减少不必要的组件错误嵌套
       */
      if (childNodesRule && !childNodesRule.includes(info.componentName)) {
        message.warning(`${propName || selectedComponentName}:只允许拖拽${childNodesRule.toString()}组件`);
        return state;
      }
      if (!isTemplate) {
        const isContainer = ALL_CONTAINER_COMPONENT_NAMES.includes(componentName!);
        if (isContainer) {
          const childNodes:VirtualDOMType[]|PropsNodeType={};
          // 获取该组件节点属性映射字段信息
            let  requiredProps= null;
            const isMultiPropsNode= keys(nodePropsConfig).length > 1

            each(nodePropsConfig, (nodePropConfig, propName) => {
              const {isRequired}=nodePropConfig
              isRequired&&(requiredProps=propName);
              isMultiPropsNode&&(childNodes[propName] = { childNodes: []});
            });
            // 更改新添加组件的key为最后一个属性节点key此key目的为默认选中最后一个属性节点
          if(isMultiPropsNode&&requiredProps){
            newAddKey = `${info.key}${requiredProps}`;

          }else if(requiredProps) {
            newAddKey = info.key;
          }
          info.childNodes = isEmpty(childNodes) ? [] : childNodes;
        }
      }
      if (parentPath) {
        update(componentConfigs, parentPath, childNodes => {
          if (isOnlyNode) return [info];
          return [...childNodes, info];
        });

        if(dragParentPath){
          update(componentConfigs,dragParentPath,(childNodes)=>childNodes.filter((node:VirtualDOMType)=>node.key!==info.key))
        }
      } else {
        componentConfigs.push(info);
      }

      undo.push({ componentConfigs: prevComponentConfigs });
      redo.length = 0;
      return {
        ...state,
        componentConfigs,
        dragData:null,
        dropTargetInfo:null,
        undo,
        redo,
        newAddKey:newAddKey,
      };
    },

    /**
     * 复制组件
     * @param state
     * @returns {{componentConfigs: *}}
     */
    copyComponent(state) {
      const { undo, redo, componentConfigs: prevComponentConfigs, selectedComponentInfo } = state;
      const { selectedKey,parentPath }=selectedComponentInfo as SelectedComponentInfoType;
      const componentConfigs = cloneDeep(prevComponentConfigs);
      if (parentPath) {
        update(componentConfigs, parentPath, childNodes => copyConfig(childNodes, selectedKey));
      } else {
        message.warning('禁止复制根节点或者OnlyNode节点');
        return state;
      }
      undo.push({ componentConfigs: prevComponentConfigs });
      redo.length = 0;
      return {
        ...state,
        componentConfigs,
        undo,
        redo,
      };
    },
    /**
     * 当domTree中拖拽节点调整顺序时触发
     * @param state
     * @param action
     * @returns {{componentConfigs: *}}
     */
    onLayoutSortChange(state, {payload}) {
      const { sortKeys, path, dragNode } = payload;
      const { undo, redo, componentConfigs: prevComponentConfigs } = state;
      let componentConfigs = cloneDeep(prevComponentConfigs);
      update(componentConfigs, path, childNodes => getNewSortChildNodes(sortKeys, childNodes, dragNode),
      );
      undo.push({ componentConfigs: prevComponentConfigs });
      redo.length = 0;
      return {
        ...state,
        componentConfigs,
        undo,
        redo,
      };
    },
    /**
     * 清除选中状态
     * @param state
     * @returns {{undo: *, propsSetting: {}, redo: *, selectedComponentInfo: {}}}
     */
    clearSelectedStatus(state) {
      const { selectedComponentInfo, propsSetting, undo, redo, styleSetting,componentConfigs } = state;
      if(handleRequiredHasChild(selectedComponentInfo as SelectedComponentInfoType,componentConfigs)){
        return state
      }
      undo.push({ selectedComponentInfo, propsSetting, styleSetting });
      redo.length = 0;
      return {
        ...state,
        selectedComponentInfo: {},
        propsSetting: {},
        styleSetting: {},
        undo,
        redo,
      };
    },

    /**
     * 选中组件
     * @param state
     * @param action
     * @returns {{newAddKey: null, undo: *, propsSetting: {propsConfig, mergePropsConfig, addPropsConfig: *, props: *}, redo: *, selectedComponentInfo: {selectedKey: *, path: *, domTreeKeys: *[], parentPath: *, isContainer: boolean, style: *, componentName: *, nodePropsConfig}}}
     */
    selectComponent(state, {payload}) {
      const { undo, redo, selectedComponentInfo, propsSetting,componentConfigs } = state;
      if(handleRequiredHasChild(selectedComponentInfo as SelectedComponentInfoType,componentConfigs)){
        return state
      }
      const {propPath, path, propName, componentConfig, parentPath, domTreeKeys,isRequiredHasChild } = payload;
      const { props, addPropsConfig={},key } = componentConfig;
      const {isContainer, isOnlyNode, childNodesRule, componentName}=handleComponentInfo(payload)
      let { propsConfig} = get(AllComponentConfigs, componentName, {});
      const mergePropsConfig = merge({}, propsConfig, addPropsConfig);
      undo.push({ selectedComponentInfo, propsSetting });
      let selectedKey = key;
      if (propName && !key.includes(propName)) {
        selectedKey = `${key}${propName}`;
        domTreeKeys.push(selectedKey);
      }
      redo.length = 0;
      return {
        ...state,
        dropTargetInfo:null,
        selectedComponentInfo: {
          selectedKey,
          style: props.style||{},
          parentPath,
          componentName,
          propName,
          propPath,
          path,
          isContainer,
          isOnlyNode,
          childNodesRule,
          domTreeKeys,
          isRequiredHasChild
        },
        propsSetting: { propsConfig, mergePropsConfig, addPropsConfig, props },
        undo,
        redo,
        styleSetting: props.style,
        newAddKey: null,

      };
    },

    /**
     * 清除所有子节点
     * @param state
     * @returns {{undo: *, componentConfigs, redo: *}}
     */

    clearChildNodes(state) {
      const { componentConfigs: prevComponentConfigs, selectedComponentInfo, undo, redo } = state;
      const componentConfigs = cloneDeep(prevComponentConfigs);
      const { path,propPath} = selectedComponentInfo as SelectedComponentInfoType;
      const updatePath=getPath({ path:propPath||path, isContainer: true })
      update(componentConfigs,updatePath!, () => []);
      undo.push({ componentConfigs: prevComponentConfigs });
      redo.length = 0;
      return {
        ...state,
        componentConfigs,
        undo,
        redo,
      };
    },
    /**
     * 删除组件
     * @param state
     * @returns {{propsSetting: *, componentConfigs: *, selectedComponentInfo: *}}
     */
    deleteComponent(state) {
      const { undo, redo, componentConfigs: prevComponentConfigs, selectedComponentInfo, propsSetting } = state;
      let componentConfigs = cloneDeep(prevComponentConfigs);
      const { selectedKey, parentPath } = selectedComponentInfo as SelectedComponentInfoType;
      if (parentPath) {
        update(componentConfigs, parentPath, childNodes =>
          filter(childNodes, componentConfig => !selectedKey.includes(componentConfig.key)),
        );
      } else {
        componentConfigs = [];
      }
      undo.push({ componentConfigs: prevComponentConfigs, propsSetting, selectedComponentInfo });
      redo.length = 0;
      return {
        ...state,
        componentConfigs,
        propsSetting: {},
        selectedComponentInfo: {},
        undo,
        redo,
      };
    },
    /**
     * 添加属性配置
     * @param state
     * @param action
     * @returns {{propsSetting: *}}
     */
    addPropsConfig(state, {payload}) {
      const { newPropField, parentFieldPath, childPropsConfig, propType } = payload;
      const { propsSetting: prevPropsSetting, undo, redo } = state;
      const propsSetting = cloneDeep(prevPropsSetting);
      const { addPropsConfig, propsConfig } = propsSetting as PropsSettingType;
      let isAdd = true;
      update(addPropsConfig, parentFieldPath, (propsContent:any) => {
        // 对象数组 添加一个对象时的逻辑
        if (childPropsConfig) return childPropsConfig;
        if (!propsContent) propsContent = {};
        if (propsContent[newPropField]) {
          isAdd = false;
          message.warning(`${newPropField}属性已存在`);
        } else {
          propsContent[newPropField] = {
            label: newPropField,
            type: propType,
            isAdd: true
          };
        }
        return propsContent;
      });
      if (!isAdd) return state;
     const mergePropsConfig = (merge({}, propsConfig, addPropsConfig));
      undo.push({ propsSetting: prevPropsSetting });
      redo.length = 0;
      return {
        ...state,
        propsSetting:{
          ...propsSetting,
          mergePropsConfig
        },
        undo,
        redo,
      };
    },

    /**
     * 删除属性配置
     * @param state
     * @param action
     * @returns {{propsSetting: *}}
     */
    deletePropsConfig(state, {payload}) {
      const { propsSetting: prevPropsSetting, undo, redo } = state;
      const propsSetting = cloneDeep(prevPropsSetting);
      const { parentFieldPath, field } = payload;
      const { addPropsConfig, propsConfig,props } = propsSetting as PropsSettingType;
      const fieldInPropsPath= getFieldInPropsPath(parentFieldPath)
      update(addPropsConfig, parentFieldPath, prevPropsConfig => {
        delete prevPropsConfig[field];
        return prevPropsConfig;
      });

      update(props,fieldInPropsPath,prevProps=>{
        if(typeof prevProps ==='object'){
          delete prevProps[field]
        }
        return prevProps
      })

      const mergePropsConfig = merge({}, propsConfig, addPropsConfig);
      undo.push({ propsSetting: prevPropsSetting });
      redo.length = 0;
      return {
        ...state,
        propsSetting:{
          ...propsSetting,
          mergePropsConfig
        },
        undo,
        redo,
      };
    },


    /**
     * 样式改变时调用
     * @param state
     * @param action
     * @returns {{propsSetting: *, componentConfigs: *}|*}
     */
    changeStyles(state, {payload}) {
      const { style } = payload;
      const { undo, redo, selectedComponentInfo, componentConfigs: prevComponentConfigs, styleSetting: prevStyleSetting } = state;
      const { path } = selectedComponentInfo as SelectedComponentInfoType;
      if (isEmpty(selectedComponentInfo)) return state;
      const componentConfigs = cloneDeep(prevComponentConfigs);
      let styleSetting = style;
      update(componentConfigs, path, componentConfig => {
        componentConfig.props.style = style;
        return componentConfig;
      });
      undo.push({ componentConfigs: prevComponentConfigs, styleSetting: prevStyleSetting });
      redo.length = 0;

      return {
        ...state,
        componentConfigs,
        styleSetting,
        undo,
        redo,
      };

    },

    /**
     * 提交属性
     * @param state
     * @param action
     * @returns {{propsSetting: *, componentConfigs: *}}
     */
    submitProps(state, {payload}) {
      const { props } = payload;
      const { propsSetting: prevPropsSetting, componentConfigs: prevComponentConfigs, selectedComponentInfo, undo, redo } = state;
      const propsSetting = cloneDeep(prevPropsSetting);
      const componentConfigs = cloneDeep(prevComponentConfigs);
      const { path } = selectedComponentInfo as SelectedComponentInfoType;
      update(componentConfigs, path, (componentConfig) => {
        const { addPropsConfig } = propsSetting as PropsSettingType;
        const { props: { style } } = componentConfig;
        return ({
          ...componentConfig,
          props: { ...props, style },
        ...(isEmpty(addPropsConfig)?{}:{addPropsConfig}),
        });
      });
      undo.push({ componentConfigs: prevComponentConfigs, propsSetting: prevPropsSetting });
      redo.length = 0;
      message.success('属性配置提交成功！！');
      return {
        ...state,
        propsSetting:{
          ...propsSetting,
          props
        },
        componentConfigs,
        undo,
        redo,
      };

    },

    /**
     * hover 目标组件
     * @param state
     * @param action
     * @returns {{hoverKey: *}}
     */
    overTarget(state, {payload}) {
      const { hoverKey } = payload;
      return {
        ...state,
        hoverKey,
      };
    },
    /**
     * 清除hover状态
     * @param state
     * @returns {{hoverKey: null}}
     */
    clearHovered(state) {
      return {
        ...state,
        hoverKey: null,
      };
    },

    /**
     * 获取拖拽组件数据
     * @param state
     * @param action
     * @returns {{dragData: *}}
     */
    getDragData(state,{payload}){
      const {dragData}=payload
      return{
        ...state,
        dragData
      }
    },

    getDropTargetInfo(state,{payload}){
      /**
       * 如果path为undefined说明当前组件不是容器组件
       */
      if(!payload.path) return {
        ...state,
        dropTargetInfo:null,
        hoverKey:null
      }
      const {path, propName, propPath,componentConfig:{key}}=payload
      const {isOnlyNode,isContainer, childNodesRule, componentName}=handleComponentInfo(payload)
      return{
        ...state,
        dropTargetInfo:{
          isContainer,
          propPath,
          path,
          isOnlyNode,
          childNodesRule,
          componentName,
          propName
        },
        hoverKey:key
      }
    },
    /**
     * 撤销
     * @param state
     * @returns {(*&void&{undo: *, redo: *})|(*&T&{undo: *, redo: *})}
     */
    undo(state) {
      const { undo, redo } = state;
      const nextState = undo.pop();
      const prevState:any = {};
      each(nextState, (_, key) => prevState[key] = get(state,key));
      redo.push(prevState);
      return {
        ...state,
        ...nextState,
        undo,
        redo,
      };
    },
    /**
     * 重做
     * @param state
     * @returns {(*&void&{undo: *, redo: *})|(*&T&{undo: *, redo: *})}
     */
    redo(state) {
      const { undo, redo } = state;
      const nextState = redo.pop();
      const prevState:any = {};
      each(nextState, (_, key) => prevState[key] = get(state,key));
      undo.push(prevState);
      return {
        ...state,
        ...nextState,
        undo,
        redo,
      };
    },
  },

};

export default Model;

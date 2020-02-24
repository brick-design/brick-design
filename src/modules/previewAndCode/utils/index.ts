import map from 'lodash/map';
import isEmpty from 'lodash/isEmpty';
import isArray from 'lodash/isArray';
import get from 'lodash/get';
import each from 'lodash/each';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import isUndefined from 'lodash/isUndefined';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import keys from 'lodash/keys';
import merge from 'lodash/merge';
import config from '@/configs';
import { PropsConfigType } from '@/types/ComponentConfigType';
import { VirtualDOMType } from '@/types/ModelType';
import { PROPS_TYPES } from '@/types/ConfigTypes';


/**
 * 处理对象数组中的方法名
 * @param arrValue
 * @param objectArrayConfig
 * @param functionMap
 */
const handleObjectArrayFunction = (arrValue:any[], objectArrayConfig:PropsConfigType[], functionMap:any) => {
  each(arrValue, (obj, index) => {
    handleObjectFunction(obj, get(objectArrayConfig, index), functionMap);
  });
};

/**
 * 处理对象中的方法名
 * @param objValue
 * @param objectConfig
 * @param functionMap
 */
const handleObjectFunction = (objValue:any, objectConfig:any, functionMap:any) => {

  each(objValue, (v, k) => {
    const childPropsConfig = get(objectConfig, `${k}.childPropsConfig`);
    if (isString(v) && v.includes('this.')) {
      const funName = v.split('.')[1];
      let funBody = get(objectConfig, `${k}.placeholder`, '()=>{}');
      if (!functionMap[funName]) {
        functionMap[funName] = funBody;
      }
    }else if(!isEmpty(childPropsConfig)){
      if (isArray(v) && isArray(childPropsConfig) && v.length === childPropsConfig.length) {
        handleObjectArrayFunction(v, childPropsConfig, functionMap);
      } else if (isObject(v) && isEqual(keys(v),keys(childPropsConfig))) {
        handleObjectFunction(v, childPropsConfig, functionMap);
      }
    }
  });
};

/**
 * 处理属性的所有值生成属性代码和相应的方法代码
 * @param props
 * @param propsConfig
 * @param functionMap
 * @returns {string}
 */
const handleProps = (props:any, propsConfig:PropsConfigType, functionMap:any) => {
  let propsCodes = '';
  each(props, (value, prop) => {
    /**
     * 处理值为 undefined 空字符串 空对象 空数组
     */
    if (isUndefined(value) || value === '' || isObject(value) && isEmpty(value)) return;
    let resultValue = '';
    /**
     * 如果value是字符串并且其中包含this.说明这是一个定义方法，
     * 拆分出方法名，在属性配置中拿到默认方法体(如果没有默认添加空方法体)整合放入 functionCodes中
     */
    if (isString(value) && value.includes('this.')) {
      resultValue = value;
      const funName = value.split('.')[1];
      if (!functionMap[funName])
        functionMap[funName] = propsConfig[prop].placeholder || '()=>{}';
    } else if (isObject(value)) {
      /**
       * 处理 value 为object 或者objectArray中的方法
       */
      const childPropsConfig = get(propsConfig, `${prop}.childPropsConfig`);
      if (!isEmpty(childPropsConfig)) {
        if (isArray(value) && isArray(childPropsConfig) && value.length === childPropsConfig.length) {
          handleObjectArrayFunction(value, childPropsConfig, functionMap);
        } else if (isObject(value)&&isEqual(keys(value),keys(childPropsConfig))) {
          handleObjectFunction(value, childPropsConfig, functionMap);
        }
      }
      resultValue = JSON.stringify(value);
    } else if(isString(value)) {
      resultValue = `'${value}'`;
    }else {
      resultValue=value
    }
    propsCodes += `${prop}={${resultValue}} `;
  });

  return propsCodes;
};

/**
 * 解析节点生成相应的子节点jsx代码和属性代码与方法
 * @param node
 * @param componentNames
 * @param functionMap
 * @param styleSheet
 * @returns {string}
 */
const analysisProps = (node:VirtualDOMType, componentNames:Set<any>, functionMap:any, styleSheet:any) => {
  const { props, addPropsConfig, componentName } = node;
  const { propsConfig } = get(config.AllComponentConfigs, componentName);
  let propsCodes = '';

  const { style={}, className = [], animateClass } = props;
  /**
   * 处理动画样式类
   */
  if (animateClass) {
    className.push(animateClass);
    delete props.animateClass;
  }
  /**
   * 处理style 样式,如果设置了自己的类名导入此类名,否则作为内联样式处理
   */
  const { classNameSelf, ...restStyle } = style;
  if (classNameSelf && !isEmpty(restStyle)) {
    className.push(`style['${classNameSelf}']`);
    styleSheet[classNameSelf] = restStyle;
    delete props.style;
  }
  /**
   * 使用classNames库集中处理className
   */
  if (!isEmpty(className)) {
    propsCodes += `className={classNames(${className.map((item:string) => item.includes('style') ? item : `'${item}'`)})}`;
    delete props.className
  }

  /**
   * 集中处理所有属性生成属性代码
   */
  propsCodes += handleProps(props, merge({}, propsConfig, addPropsConfig), functionMap);

  return propsCodes;

};


/**
 * 处理ant form.Item子组件
 * @param componentName
 * @param childrenNodesJSX
 * @param props
 * @returns {string}
 */
const handleAntForm=(componentName:string,childrenNodesJSX:string,props:any,indent:string)=>{
  if(componentName==='Form.Item'){
    childrenNodesJSX=`\n${indent}{getFieldDecorator(${props.filed})(${childrenNodesJSX})}`
  }
  return childrenNodesJSX
}
/**
 * 生成render方法中的代码
 * @param childNodesArr
 * @param indent
 * @param componentNames
 * @param functionMap
 * @param styleSheet
 * @returns {{styleSheet: (*|{}), jsx: string, componentNames: (*|Set<any>), functionMap: (*|{})}}
 */
function renderElementToJSX(childNodesArr:VirtualDOMType[], indent = '', componentNames:Set<string>=new Set(), functionMap?:any, styleSheet?:any,isPropNode?:boolean) {
  functionMap = functionMap || {};
  styleSheet = styleSheet || {};
  let resultJSX = '';
  const resultIndent = `\n${indent}`;
  /** 属性值解析生成代码 */

  each(childNodesArr, (node,index) => {
    const { componentName, childNodes,props } = node;
    const { nodePropsConfig } = get(config.AllComponentConfigs, componentName);
    let propsCodes = '', childrenNodes:VirtualDOMType[]=[], childrenNodesJSX = '';
    /**
     * 收集组件名称
     */
    componentNames.add(componentName);
    /**
     * 处理属性
     * @type {string}
     */
    propsCodes += analysisProps(node, componentNames, functionMap, styleSheet);
    const nodeIndent = resultIndent;

    let nodeJSX = `${nodeIndent}${isPropNode&&index>0?',':''}<${componentName} `;

    if (!isEmpty(childNodes)) {
      if (nodePropsConfig) {
        each(nodePropsConfig, (nodePropConfig, propName) => {
          const { type,params } = nodePropConfig;
          const propChildNodes = get(childNodes, `${propName}.childNodes`);
          if (propName === 'children') return childrenNodes = propChildNodes || childNodes;
          let analysisChildNodes:VirtualDOMType[] = childNodes as VirtualDOMType[];
          if (isEmpty(propChildNodes)) return;
          if (!isEmpty(propChildNodes)) analysisChildNodes = propChildNodes ;
          let { jsx } = renderElementToJSX(analysisChildNodes, '', componentNames, functionMap, styleSheet,true);

          const isReactNode = type === PROPS_TYPES.reactNode;
          /**
           * 处理属性节点个数大于1的情况
           */
          jsx=analysisChildNodes.length>1?`[${jsx}]`:jsx
          propsCodes += `${propName}={${isReactNode ? jsx : `(${params})=>${jsx}`}} `;
        });
      } else {
        childrenNodes = childNodes as VirtualDOMType[];
      }

      nodeJSX+=propsCodes.trimRight()

      if (childrenNodes) {
        const { jsx } = renderElementToJSX(childrenNodes, `${indent}  `, componentNames, functionMap, styleSheet);
        childrenNodesJSX = jsx;
      }

      /**
       * 处理antd form.Item 子组件
       * @type {string}
       */
      childrenNodesJSX=handleAntForm(componentName,childrenNodesJSX,props,`${indent}  `)

      nodeJSX +=isEmpty(childrenNodesJSX)?'/>': `>${childrenNodesJSX}${nodeIndent}</${componentName}>`;
    } else {
      nodeJSX += `${propsCodes.trimRight()}/>`;
    }
    resultJSX += nodeJSX;
  });


  return { jsx: resultJSX, componentNames, functionMap, styleSheet };
}

/**
 * 方法生成器
 * @param functionMap
 * @returns {string}
 */
export function generateFunctionCodes(functionMap:any) {
  let functionCodes = '';

  each(functionMap, (funBody, funName) => {
    functionCodes += `\n\n${funName}=${funBody}`;
  });

  return functionCodes;

}


/**
 * 样式生成器
 * @param styleSheet
 * @returns {string}
 */
export function generateStyleSheetCodes(styleSheet:any) {
  let styleSheetCodes = '';
  each(styleSheet, (style, className) => {
    styleSheetCodes += `.${className}{\n`;
    map(style, (styleValue, styleName) => {
      styleSheetCodes += `   ${styleName.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${styleValue};\n`;
    });
    styleSheetCodes += `}\n`;
  });
  return styleSheetCodes;
}

/**
 * 生成页面代码
 * @param childNodesArr
 * @returns {string}
 */

export function generatePageCode(childNodesArr:VirtualDOMType[]) {
  const { jsx, componentNames, functionMap, styleSheet } = renderElementToJSX(cloneDeep(childNodesArr), '         ');
  const styleSheetCodes = generateStyleSheetCodes(styleSheet);
  const functionCodes = generateFunctionCodes(functionMap);
  const importComponentNames=new Set(map([...componentNames],(componentName)=>{
    if(!componentName.includes('.')) return componentName
    return componentName.split('.')[0]
  }))
  const hasForm=componentNames.has('Form')
  const pageCodes = `
import React, { Component } from 'react';
import { ${[...importComponentNames]} } from 'antd';
import classNames from 'classnames';
${!isEmpty(styleSheet) ? `import style from './index.less';` : ''}
${hasForm ? `@Form.create()` : ''}
export default class Index extends Component {
  constructor () {
    super();
  }
    
  ${functionCodes}
    
  render(){
  ${hasForm?'const {form:{getFieldDecorator}}=this.props':''}
      return (${jsx}
      )
  }
}
  `;
  return { pageCodes, styleSheetCodes };
}


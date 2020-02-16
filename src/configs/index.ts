import { htmlContainers, htmlNonContainers } from './htmlCategory';
import { reactContainers, reactNonContainers } from './reactCategory';
import * as Ants from 'antd/es';
import { multiPropsNodeComponents, singlePropNodeComponents } from './childNodesNonemptyContainers';
import {
  flattenDeepArray,
  generalContainers,
  generateContainers,
  multiPropsNodeNonempty,
  singlePropNodeNonempty,
} from '@/utils';
export {default as AllComponentConfigs}from './componentConfigs/Ant';
export { default as componentsToImage } from './componentsToImage';
export { default as domTreeIcons } from './domTreeIcons';

/**
 * 原始组件集
 */
export const OriginalComponents = Ants;


/**
 * 所有容器组件名字
 * @type {string[]}
 */
export const ALL_CONTAINER_COMPONENT_NAMES = [...flattenDeepArray(reactContainers), ...flattenDeepArray(htmlContainers)];

/**
 * 所有非容器组件名字
 * @type {*[]}
 */
export const ALL_NON_CONTAINER_COMPONENT_NAMES = [...flattenDeepArray(reactNonContainers), ...flattenDeepArray(htmlNonContainers)];

/**
 * 容器组件分类
 */
export const CONTAINER_CATEGORY = { ...reactContainers, ...htmlContainers };
/**
 * 非容器组件分类
 * @type {{Input, InputNumber, Slider, Checkbox, Rate, Radio, Icon, Typography}}
 */
export const NON_CONTAINER_CATEGORY = { ...reactNonContainers };

/**
 * 设计面板可用的所有组件
 */
export const oAllComponents = {
  ...OriginalComponents,
  ...generateContainers(ALL_CONTAINER_COMPONENT_NAMES, generalContainers),
  ...generateContainers(singlePropNodeComponents, singlePropNodeNonempty),
  ...generateContainers(multiPropsNodeComponents, multiPropsNodeNonempty),
};

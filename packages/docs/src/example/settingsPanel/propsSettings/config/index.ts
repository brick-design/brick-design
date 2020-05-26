import Animate from '../Animate';
import {TYPES_TO_COMPONENT as COMPONENT} from 'bricks-web'
import { PROPS_TYPES } from 'brickd-core';

/**
 * 默认属性
 * @type {{className: {label: string, type: string}, animateClass: {label: string, type: string}}}
 */
export const DEFAULT_PROPS = {
  className: { label: '类名', type: PROPS_TYPES.stringArray },
  animateClass: { label: '动画', type: PROPS_TYPES.animate },
};

/**
 * 类型映射组件
 */
export const TYPES_TO_COMPONENT:any = {
...COMPONENT,
  [PROPS_TYPES.animate]: Animate,

};






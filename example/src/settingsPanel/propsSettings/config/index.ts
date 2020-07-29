import Animate from '../Animate'
import { TYPES_TO_COMPONENT as COMPONENT } from '@brickd/react-web'
import { PROPS_TYPES } from '@brickd/react'

/**
 * 默认属性
 * @type {{className: {label: string, type: string}, animateClass: {label: string, type: string}}}
 */
export const DEFAULT_PROPS = {
	className: { label: '类名', type: PROPS_TYPES.stringArray },
	animateClass: { label: '动画', type: 'animate' },
}

/**
 * 类型映射组件
 */
export const TYPES_TO_COMPONENT: any = {
	...COMPONENT,
	animate: Animate,
}

import { TYPES_TO_COMPONENT } from '@brickd/react-web'
import NumberComponent from '../NumberComponent'

/**
 * 样式类型定义
 */
export enum CSS_TYPE {
	string = 'string',
	enum = 'enum',
	number = 'number',
}

export const CSS_TYPE_TO_COMPONENT: any = {
	...TYPES_TO_COMPONENT,
	[CSS_TYPE.number]: NumberComponent,
}

import Avatar from './Avatar'
import Tag from './Tag'
import Breadcrumb from './Breadcrumb'
import {
	ComponentSchemaType,
	NODE_PROPS_TYPES,
	PROPS_TYPES,
} from '@brickd/react'

const PageHeader: ComponentSchemaType = {
	nodePropsConfig: {
		title: {
			type: NODE_PROPS_TYPES.reactNode,
		},
		subTitle: {
			type: NODE_PROPS_TYPES.reactNode,
		},
		backIcon: {
			type: NODE_PROPS_TYPES.reactNode,
		},
		extra: {
			type: NODE_PROPS_TYPES.reactNode,
		},
		footer: {
			type: NODE_PROPS_TYPES.reactNode,
		},
		children: {
			type: NODE_PROPS_TYPES.reactNode,
		},
	},
	propsConfig: {
		ghost: {
			label: 'pageHeader 的类型',
			tip: 'pageHeader 的类型，将会改变背景颜色',
			type: PROPS_TYPES.boolean,
		},
		avatar: {
			label: '标题栏旁的头像',
			type: PROPS_TYPES.object,
			childPropsConfig: Avatar.propsConfig,
		},
		tags: {
			label: 'title 旁的 tag 列表',
			type: PROPS_TYPES.objectArray,
			childPropsConfig: [Tag.propsConfig],
		},
		breadcrumb: {
			label: '面包屑的配置',
			type: PROPS_TYPES.object,
			childPropsConfig: Breadcrumb.Breadcrumb.propsConfig,
		},
		onBack: {
			label: '返回按钮的点击事件',
			type: PROPS_TYPES.function,
			placeholder: '()=>{}',
		},
	},
}
export default PageHeader

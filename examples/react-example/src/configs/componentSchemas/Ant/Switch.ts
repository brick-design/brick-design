import {
	ComponentSchemaType,
	NODE_PROPS_TYPES,
	PROPS_TYPES,
} from '@brickd/react'

const Switch: ComponentSchemaType = {
	nodePropsConfig: {
		checkedChildren: {
			type: NODE_PROPS_TYPES.reactNode,
		},
		unCheckedChildren: {
			type: NODE_PROPS_TYPES.reactNode,
		},
	},
	propsConfig: {
		autoFocus: {
			label: '自动获焦点',
			type: PROPS_TYPES.boolean,
		},
		checked: {
			label: '当前是否选中',
			type: PROPS_TYPES.boolean,
		},
		checkedChildren: {
			label: '选中的内容',
			type: PROPS_TYPES.string,
		},
		defaultChecked: {
			label: '初始是否选中',
			type: PROPS_TYPES.boolean,
		},
		disabled: {
			label: '是否禁用',
			type: PROPS_TYPES.boolean,
		},
		loading: {
			label: '加载动画',
			tip: '加载中的开关',
			type: PROPS_TYPES.boolean,
		},
		size: {
			label: '开关大小',
			tip: '开关大小，可选值：default small',
			type: PROPS_TYPES.enum,
			enumData: ['default', 'small'],
			defaultValue: 'default',
		},
		unCheckedChildren: {
			label: '未选时内容',
			type: PROPS_TYPES.string,
		},
		onChange: {
			label: '开关改变回调',
			type: PROPS_TYPES.function,
			placeholder: '(checked) => {}',
		},
		onClick: {
			label: '点击时回调函数',
			type: PROPS_TYPES.function,
			placeholder: '(checked, event)=>{}',
		},
	},
}

export default Switch

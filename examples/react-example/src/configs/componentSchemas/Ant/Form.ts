import {
	ComponentSchemaType,
	NODE_PROPS_TYPES,
	PROPS_TYPES,
} from '@brickd/react'

const Form: ComponentSchemaType = {
	propsConfig: {
		hideRequiredMark: {
			label: '隐藏所有表单项的必选标记',
			type: PROPS_TYPES.boolean,
			defaultValue: false,
		},
		labelAlign: {
			label: 'label 标签的文本对齐方式',
			type: PROPS_TYPES.enum,
			enumData: ['left', 'right'],
		},
		labelCol: {
			label: 'label 标签布局',
			tip:
				'（3.14.0 新增，之前的版本只能设置到 FormItem 上。）label 标签布局，同 <Col> 组件，设置 span offset 值，如 {span: 3, offset: 12} 或 sm: {span: 3, offset: 12}',
			type: PROPS_TYPES.object,
			childPropsConfig: {},
		},
		wrapperCol: {
			label: '输入控件设置布局样式',
			tip:
				'3.14.0 新增，之前的版本只能设置到 FormItem 上。）需要为输入控件设置布局样式时，使用该属性，用法同 labelCol',
			type: PROPS_TYPES.object,
			childPropsConfig: {},
		},
		colon: {
			label: '是否实现冒号',
			tip:
				'配置 Form.Item 的 colon 的默认值 (只有在属性 layout 为 horizontal 时有效)',
			type: PROPS_TYPES.boolean,
		},
		layout: {
			label: '表单布局',
			type: PROPS_TYPES.enum,
			enumData: ['horizontal', 'vertical', 'inline'],
			defaultValue: 'horizontal',
		},
		onSubmit: {
			label: '数据验证成功后回调事件，需要配合Button(type: submit)使用',
			type: PROPS_TYPES.function,
			placeholder: '(e)=>{}',
		},
	},
}

const Item: ComponentSchemaType = {
	nodePropsConfig: {
		extra: {
			type: NODE_PROPS_TYPES.reactNode,
		},
		help: {
			type: NODE_PROPS_TYPES.reactNode,
		},
		label: {
			type: NODE_PROPS_TYPES.reactNode,
		},
		children: {
			type: NODE_PROPS_TYPES.reactNode,
			isOnlyNode: true,
		},
	},
	propsConfig: {
		colon: {
			label: '是否显示 label 后面的冒号',
			type: PROPS_TYPES.boolean,
			defaultValue: true,
		},
		extra: {
			label: '额外的提示信息',
			tip:
				'额外的提示信息，和 help 类似，当需要错误信息和提示文案同时出现时，可以使用这个。',
			type: PROPS_TYPES.string,
		},
		help: {
			label: '提示信息',
			tip: '提示信息，如不设置，则会根据校验规则自动生成',
			type: PROPS_TYPES.string,
		},
		hasFeedback: {
			label: '展示校验状态图标',
			tip:
				'配合 validateStatus 属性使用，展示校验状态图标，建议只配合 Input 组件使用',
			type: PROPS_TYPES.boolean,
		},
		htmlFor: {
			label: '设置子元素 label htmlFor 属性',
			type: PROPS_TYPES.string,
		},
		label: {
			label: 'label 标签的文本',
			type: PROPS_TYPES.string,
		},
		labelCol: {
			label: 'label 标签布局，',
			tip:
				'label标签布局同 <Col> 组件设置span offset值，如{span: 3, offset: 12} 或 sm:{span: 3, offset: 12}。在 3.14.0 之后，你可以通过 Form 的 labelCol 进行统一设置。当和 Form 同时设置时，以 FormItem 为准。',
			type: PROPS_TYPES.object,
			childPropsConfig: {},
		},
		wrapperCol: {
			label: '输入控件设置布局样式',
			tip:
				'需要为输入控件设置布局样式时，使用该属性，用法同 labelCol。在 3.14.0 之后，你可以通过 Form 的 wrapperCol 进行统一设置。当和 Form 同时设置时，以 FormItem 为准。',
			type: PROPS_TYPES.object,
			childPropsConfig: {},
		},
		labelAlign: {
			label: 'label 标签的文本对齐方式',
			type: PROPS_TYPES.enum,
			enumData: ['left', 'right'],
		},
		required: {
			label: '是否必填',
			tip: '是否必填，如不设置，则会根据校验规则自动生成',
			type: PROPS_TYPES.boolean,
		},
		validateStatus: {
			label: '校验状态',
			type: PROPS_TYPES.enum,
			enumData: ['success', 'warning', 'error', 'validating'],
		},
	},
}
export default {
	Form,
	'Form.Item': Item,
}

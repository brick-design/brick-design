import { ComponentSchemaType, PROPS_TYPES } from '@brickd/react'

const Text: ComponentSchemaType = {
	isNonContainer:true,

	propsConfig: {
		children: {
			label: '内容',
			type: PROPS_TYPES.string,
		},
		copyable: {
			label: '是否可拷贝',
			tip: '是否可拷贝，为对象时可设置复制文本以回调函数',
			type: [PROPS_TYPES.boolean, PROPS_TYPES.object],
			childPropsConfig: {
				text: {
					label: 'text',
					type: PROPS_TYPES.string,
				},
				onCopy: {
					label: 'onCopy',
					type: PROPS_TYPES.function,
				},
			},
		},
		delete: {
			label: '添加删除线样式',
			type: PROPS_TYPES.boolean,
		},
		disabled: {
			label: '禁用文本',
			type: PROPS_TYPES.boolean,
		},
		editable: {
			label: '是否可编辑',
			tip: '是否可编辑，为对象时可对编辑进行控制',
			type: [PROPS_TYPES.boolean, PROPS_TYPES.object],
			childPropsConfig: {
				editing: {
					label: 'editing',
					type: PROPS_TYPES.boolean,
				},
				onStart: {
					label: 'onStart',
					type: PROPS_TYPES.function,
				},
				onChange: {
					label: 'onChange',
					type: PROPS_TYPES.boolean,
					placeholder: '(string)=>{}',
				},
			},
		},
		ellipsis: {
			label: '设置自动溢出省略',
			type: PROPS_TYPES.boolean,
		},
		mark: {
			label: '添加标记样式',
			type: PROPS_TYPES.boolean,
		},
		code: {
			label: '添加代码样式',
			type: PROPS_TYPES.boolean,
		},
		underline: {
			label: '添加下划线样式',
			type: PROPS_TYPES.boolean,
		},
		strong: {
			label: '是否加粗',
			type: PROPS_TYPES.boolean,
		},
		type: {
			label: '文本类型',
			type: PROPS_TYPES.enum,
			enumData: ['secondary', 'warning', 'danger'],
		},
	},
}
const Title: ComponentSchemaType = {
	isNonContainer:true,

	propsConfig: {
		children: {
			label: '内容',
			type: PROPS_TYPES.string,
		},
		copyable: {
			label: '是否可拷贝',
			tip: '是否可拷贝，为对象时可设置复制文本以回调函数',
			type: [PROPS_TYPES.boolean, PROPS_TYPES.object],
			childPropsConfig: {
				text: {
					label: 'text',
					type: PROPS_TYPES.string,
				},
				onCopy: {
					label: 'onCopy',
					type: PROPS_TYPES.function,
				},
			},
		},
		delete: {
			label: '添加删除线样式',
			type: PROPS_TYPES.boolean,
		},
		disabled: {
			label: '禁用文本',
			type: PROPS_TYPES.boolean,
		},
		editable: {
			label: '是否可编辑',
			tip: '是否可编辑，为对象时可对编辑进行控制',
			type: [PROPS_TYPES.boolean, PROPS_TYPES.object],
			childPropsConfig: {
				editing: {
					label: 'editing',
					type: PROPS_TYPES.boolean,
				},
				onStart: {
					label: 'onStart',
					type: PROPS_TYPES.function,
				},
				onChange: {
					label: 'onChange',
					type: PROPS_TYPES.boolean,
					placeholder: '(string)=>{}',
				},
			},
		},
		ellipsis: {
			label: '设置自动溢出省略',
			tip: '自动溢出省略，为对象时可设置省略行数与是否可展开等',
			type: [PROPS_TYPES.boolean, PROPS_TYPES.object],
			childPropsConfig: {
				rows: {
					label: 'rows',
					type: PROPS_TYPES.number,
				},
				expandable: {
					label: 'expandable',
					type: PROPS_TYPES.boolean,
				},
				onExpand: {
					label: 'onExpand',
					type: PROPS_TYPES.function,
				},
			},
		},
		level: {
			label: '重要程度',
			tip: '重要程度，相当于 h1、h2、h3、h4',
			type: PROPS_TYPES.number,
			max: 6,
		},
		mark: {
			label: '添加标记样式',
			type: PROPS_TYPES.boolean,
		},
		underline: {
			label: '添加下划线样式',
			type: PROPS_TYPES.boolean,
		},
		onChange: {
			label: '当用户提交编辑内容时触发',
			type: PROPS_TYPES.function,
			placeholder: '(string)=>{}',
		},
		type: {
			label: '文本类型',
			type: PROPS_TYPES.enum,
			enumData: ['secondary', 'warning', 'danger'],
		},
	},
}
const Paragraph: ComponentSchemaType = {
	isNonContainer:true,

	propsConfig: {
		children: {
			label: '内容',
			type: PROPS_TYPES.string,
		},
		copyable: {
			label: '是否可拷贝',
			tip: '是否可拷贝，为对象时可设置复制文本以回调函数',
			type: [PROPS_TYPES.boolean, PROPS_TYPES.object],
			childPropsConfig: {
				text: {
					label: 'text',
					type: PROPS_TYPES.string,
				},
			},
		},
		delete: {
			label: '添加删除线样式',
			type: PROPS_TYPES.boolean,
		},
		disabled: {
			label: '禁用文本',
			type: PROPS_TYPES.boolean,
		},
		editable: {
			label: '是否可编辑',
			tip: '是否可编辑，为对象时可对编辑进行控制',
			type: [PROPS_TYPES.boolean, PROPS_TYPES.object],
			childPropsConfig: {
				editing: {
					label: 'editing',
					type: PROPS_TYPES.boolean,
				},
				onStart: {
					label: 'onStart',
					type: PROPS_TYPES.function,
				},
				onChange: {
					label: 'onChange',
					type: PROPS_TYPES.boolean,
					placeholder: '(string)=>{}',
				},
			},
		},
		ellipsis: {
			label: '设置自动溢出省略',
			tip: '自动溢出省略，为对象时可设置省略行数与是否可展开等',
			type: [PROPS_TYPES.boolean, PROPS_TYPES.object],
			childPropsConfig: {
				rows: {
					label: 'rows',
					type: PROPS_TYPES.number,
				},
				expandable: {
					label: 'expandable',
					type: PROPS_TYPES.boolean,
				},
				onExpand: {
					label: 'onExpand',
					type: PROPS_TYPES.function,
				},
			},
		},
		level: {
			label: '重要程度',
			tip: '重要程度，相当于 h1、h2、h3、h4',
			type: PROPS_TYPES.number,
			max: 6,
		},
		mark: {
			label: '添加标记样式',
			type: PROPS_TYPES.boolean,
		},
		underline: {
			label: '添加下划线样式',
			type: PROPS_TYPES.boolean,
		},
		onChange: {
			label: '当用户提交编辑内容时触发',
			type: PROPS_TYPES.function,
			placeholder: '(string)=>{}',
		},
		strong: {
			label: '是否加粗',
			type: PROPS_TYPES.boolean,
		},
		type: {
			label: '文本类型',
			type: PROPS_TYPES.enum,
			enumData: ['secondary', 'warning', 'danger'],
		},
	},
}

export default {
	'Typography.Text': Text,
	'Typography.Title': Title,
	'Typography.Paragraph': Paragraph,
}

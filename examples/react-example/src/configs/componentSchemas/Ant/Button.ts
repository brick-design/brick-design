import { ComponentSchemaType, PROPS_TYPES } from '@brickd/react'

const Button: ComponentSchemaType = {
	propsConfig: {
		children: {
			label: '内容',
			type: PROPS_TYPES.string,
		},
		disabled: {
			label: '禁用',
			tip: '按钮失效状态',
			type: PROPS_TYPES.boolean,
		},
		ghost: {
			label: '幽灵模式',
			tip: '按钮背景透明',
			type: PROPS_TYPES.boolean,
		},
		href: {
			label: '跳转的地址',
			tip: '点击跳转的地址，指定此属性 button 的行为和 a 链接一致',
			type: PROPS_TYPES.string,
		},
		htmlType: {
			label: 'button类型',
			tip: '设置 button 原生的 type 值，可选值请参考 HTML 标准',
			type: PROPS_TYPES.string,
		},
		icon: {
			label: '图标类型',
			tip: '设置按钮的图标类型',
			type: PROPS_TYPES.string,
		},
		loading: {
			label: '载入状态',
			tip: '设置按钮载入状态',
			type: [PROPS_TYPES.boolean, PROPS_TYPES.object],
			childPropsConfig: {
				delay: {
					label: '时间',
					type: PROPS_TYPES.number,
				},
			},
		},
		shape: {
			label: '按钮形状',
			tip: '设置按钮形状，可选值为 circle、 round 或者不设',
			type: PROPS_TYPES.enum,
			enumData: ['default', 'circle', 'round'],
		},
		size: {
			label: '按钮大小',
			tip: '设置按钮大小',
			type: PROPS_TYPES.enum,
			enumData: ['default', 'small', 'large'],
		},
		target: {
			label: '链接target',
			tip: '相当于a链接的target属性, 设置跳转链接时有效',
			type: PROPS_TYPES.enum,
			enumData: ['_blank', '_self', '_father', '_top'],
		},
		type: {
			label: '按钮类型',
			tip: '设置按钮类型',
			type: PROPS_TYPES.enum,
			enumData: ['default', 'primary', 'dashed', 'danger', 'link'],
		},
		onClick: {
			label: '点击事件',
			tip: '点击事件回调',
			type: PROPS_TYPES.function,
			placeholder: '(event) => {}',
		},
		block: {
			label: '自适应宽度',
			tip: '将按钮宽度调整为其父宽度',
			type: PROPS_TYPES.boolean,
		},
	},
}
const Group: ComponentSchemaType = {
	propsConfig: {
	},
}
export default {
	Button,
	'Button.Group': Group,
}

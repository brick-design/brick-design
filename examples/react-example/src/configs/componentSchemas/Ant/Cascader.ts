import {
	ComponentSchemaType,
	NODE_PROPS_TYPES,
	PROPS_TYPES,
} from '@brickd/react'

const Option = {
	value: {
		label: 'value',
		type: PROPS_TYPES.string,
	},
	disabled: {
		label: '禁用',
		type: PROPS_TYPES.boolean,
	},
	children: {
		label: 'children',
		type: PROPS_TYPES.objectArray,
	},
}
const Cascader: ComponentSchemaType = {
	nodePropsConfig: {
		displayRender: {
			type: NODE_PROPS_TYPES.functionReactNode,
			params: ['label', 'selectedOptions'],
		},
		suffixIcon: {
			type: NODE_PROPS_TYPES.reactNode,
		},
	},

	propsConfig: {
		allowClear: {
			label: '是否支持清除',
			type: PROPS_TYPES.boolean,
		},
		autoFocus: {
			label: '自动获取焦点',
			type: PROPS_TYPES.boolean,
		},
		changeOnSelect: {
			label: '是否变化',
			tip: '当此项为 true 时，点选每级菜单选项值都会发生变化，具体见上面的演示',
			type: PROPS_TYPES.boolean,
		},
		defaultValue: {
			label: '默认选中项',
			type: PROPS_TYPES.stringArray,
		},
		disabled: {
			label: '是否禁用',
			type: PROPS_TYPES.boolean,
		},
		expandTrigger: {
			label: '菜单展现style',
			tip: "次级菜单的展开方式，可选 'click' 和 'hover'",
			type: PROPS_TYPES.enum,
			enumData: ['click', 'hover'],
			defaultValue: 'click',
		},
		fieldNames: {
			label: 'options中参数',
			tip:
				'自定义 options 中 label name children 的字段（注意，3.7.0 之前的版本为 filedNames）',
			type: PROPS_TYPES.object,
			childPropsConfig: {
				label: {
					label: '标签',
					type: PROPS_TYPES.string,
					unDelete: true,
				},
				name: {
					label: '名称',
					type: PROPS_TYPES.string,
					unDelete: true,
				},
				children: {
					label: '子名称',
					type: PROPS_TYPES.string,
					unDelete: true,
				},
			},
			defaultValue: {
				label: 'name',
				value: 'code',
				children: 'items',
			},
		},
		getPopupContainer: {
			label: '菜单渲染父节点',
			tip:
				'菜单渲染父节点。默认渲染到 body 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位',
			type: PROPS_TYPES.function,
			placeholder: '(triggerNode) => document.body',
		},
		loadData: {
			label: '动态加载',
			tip: '用于动态加载选项，无法与 showSearch 一起使用',
			type: PROPS_TYPES.function,
			placeholder: '(selectedOptions) => {}',
		},
		notFoundContent: {
			label: '空数据内容',
			tip: '当下拉列表为空时显示的内容',
			type: PROPS_TYPES.string,
			defaultValue: 'Not Found',
		},
		options: {
			label: '可选数据源',
			type: PROPS_TYPES.objectArray,
			childPropsConfig: [Option],
		},
		placeholder: {
			label: '输入框占位文本',
			type: PROPS_TYPES.string,
		},
		popupClassName: {
			label: '浮层类名',
			tip: '自定义浮层类名',
			type: PROPS_TYPES.string,
		},
		popupPlacement: {
			label: '浮层位置',
			tip: '浮层预设位置：bottomLeft bottomRight topLeft topRight',
			type: PROPS_TYPES.enum,
			enumData: ['bottomLeft', 'bottomRight', 'topLeft', 'topRight'],
			defaultValue: 'bottomLeft',
		},
		popupVisible: {
			label: '控制浮层显隐',
			type: PROPS_TYPES.boolean,
		},
		showSearch: {
			label: '显示搜索框',
			tip: '在选择框中显示搜索框',
			type: [PROPS_TYPES.boolean, PROPS_TYPES.object],
			childPropsConfig: {
				filter: {
					label: 'filter',
					tip:
						'接收 inputValue location 两个参数，当 location 符合筛选条件时，应返回 true，反之则返回 false。',
					type: PROPS_TYPES.function,
					placeholder: '(inputValue, location)=>true',
				},
				limit: {
					label: '搜索结果展示数量',
					type: [PROPS_TYPES.boolean, PROPS_TYPES.number],
				},
				matchInputWidth: {
					label: '搜索结果列表是否与输入框同宽',
					type: PROPS_TYPES.boolean,
				},
				render: {
					label: '用于渲染 filter 后的选项',
					type: PROPS_TYPES.function,
					placeholder: '(inputValue, location)=><div/>',
				},
				sort: {
					label: '用于排序 filter 后的选项',
					type: PROPS_TYPES.function,
					placeholder: '(a, b, inputValue)=>{}',
				},
			},
		},
		size: {
			label: '输入框大小',
			type: PROPS_TYPES.enum,
			tip: '输入框大小，可选 large default small',
			enumData: ['large', 'default', 'small'],
			defaultValue: 'default',
		},
		value: {
			label: '指定选中项',
			type: PROPS_TYPES.stringArray,
		},
		onChange: {
			label: '选择完成后的回调',
			type: PROPS_TYPES.function,
			placeholder: '(value, selectedOptions) => {}',
		},
		onPopupVisibleChange: {
			label: '显示/隐藏浮层的回调',
			type: PROPS_TYPES.function,
			placeholder: '(value) => {}',
		},
	},
}

export default Cascader

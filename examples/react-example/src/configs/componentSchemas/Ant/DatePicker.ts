import {
	ComponentSchemaType,
	NODE_PROPS_TYPES,
	NodePropsConfigType,
	PROPS_TYPES,
	PropsConfigType,
} from '@brickd/react'

const commonNodePropsConfig: NodePropsConfigType = {
	dateRender: {
		type: NODE_PROPS_TYPES.functionReactNode,
		params: ['currentDate', 'today'],
	},
	placeholder: {
		type: NODE_PROPS_TYPES.reactNode,
		childNodesRule: ['DatePicker.RangePicker'],
	},
	suffixIcon: {
		type: NODE_PROPS_TYPES.reactNode,
	},
}
const commonPropsConfig: PropsConfigType = {
	allowClear: {
		label: '是否显示清除按钮',
		type: PROPS_TYPES.boolean,
	},
	autoFocus: {
		label: '自动获取焦点',
		type: PROPS_TYPES.boolean,
	},
	disabled: {
		label: '是否禁用',
		type: PROPS_TYPES.boolean,
		defaultValue: false,
	},
	disabledDate: {
		label: '不可选择的日期',
		type: PROPS_TYPES.function,
		placeholder: '(currentDate) =>true ',
	},
	dropdownClassName: {
		label: '额外的弹出日历 className',
		type: PROPS_TYPES.string,
	},
	getCalendarContainer: {
		label: '定义浮层的容器',
		tip: '定义浮层的容器，默认为 body 上新建 div',
		type: PROPS_TYPES.function,
		placeholder: '(trigger)=>{}',
	},
	locale: {
		label: '国际化配置',
		type: PROPS_TYPES.object,
		childPropsConfig: {},
	},
	mode: {
		label: '日期面板的状态',
		type: PROPS_TYPES.enum,
		enumData: ['time', 'date', 'month', 'year'],
		defaultValue: 'date',
	},
	open: {
		label: '控制弹层是否展开',
		type: PROPS_TYPES.boolean,
	},
	placeholder: {
		label: '输入框提示文字',
		type: PROPS_TYPES.string,
	},
	popupStyle: {
		label: '额外的弹出日历样式',
		type: PROPS_TYPES.object,
		childPropsConfig: {},
	},
	size: {
		label: '输入框大小',
		type: PROPS_TYPES.enum,
		enumData: ['large', 'small', 'default'],
	},
	onPanelChange: {
		label: '日期面板变化时的回调',
		type: PROPS_TYPES.function,
		placeholder: '(value, mode) => {}',
	},
	onOpenChange: {
		label: '弹出日历和关闭日历的回调',
		type: PROPS_TYPES.function,
		placeholder: '(status)=>{}',
	},
}
const DatePicker: ComponentSchemaType = {
	nodePropsConfig: {
		renderExtraFooter: {
			type: NODE_PROPS_TYPES.functionReactNode,
			params: ['mode'],
		},
		...commonNodePropsConfig,
	},
	propsConfig: {
		...commonPropsConfig,
		disabledTime: {
			label: '不可选择的时间',
			type: PROPS_TYPES.function,
			placeholder: '(date) => {}',
		},
		format: {
			type: [PROPS_TYPES.string, PROPS_TYPES.stringArray],
			label: '展示的日期格式',
			placeholder: '默认 YYYY - MM - DD',
		},

		showTime: {
			label: '增加时间选择功能',
			type: [PROPS_TYPES.boolean, PROPS_TYPES.object],
			childPropsConfig: {},
		},
		showToday: {
			label: '是否展示“今天”按钮',
			type: PROPS_TYPES.boolean,
			defaultValue: true,
		},
		// value: {
		//   type: PROPS_TYPES.string,
		//   label: '日期',
		// },
		onChange: {
			type: PROPS_TYPES.function,
			label: '值改变时的回调',
			placeholder: '(date, dateString) => {}',
		},
		onOk: {
			label: '点击确定按钮的回调',
			type: PROPS_TYPES.function,
			placeholder: '() => {}',
		},
	},
}

const MonthPicker: ComponentSchemaType = {
	nodePropsConfig: {
		monthCellContentRender: {
			type: NODE_PROPS_TYPES.functionReactNode,
			params: ['date', 'locale'],
		},
		renderExtraFooter: {
			type: NODE_PROPS_TYPES.functionReactNode,
			params: ['mode'],
		},
		...commonNodePropsConfig,
	},
	propsConfig: {
		...commonPropsConfig,
		format: {
			type: PROPS_TYPES.string,
			label: '展示的日期格式',
			placeholder: '默认 YYYY - MM - DD',
		},
		onChange: {
			type: PROPS_TYPES.function,
			label: '值改变时的回调',
			placeholder: '(date, dateString) => {}',
		},
	},
}
const WeekPicker: ComponentSchemaType = {
	nodePropsConfig: {
		renderExtraFooter: {
			type: NODE_PROPS_TYPES.functionReactNode,
			params: ['mode'],
		},
		...commonNodePropsConfig,
	},
	propsConfig: {
		...commonPropsConfig,
		format: {
			type: PROPS_TYPES.string,
			label: '展示的日期格式',
			placeholder: '默认 YYYY - MM - DD',
		},
		onChange: {
			type: PROPS_TYPES.function,
			label: '值改变时的回调',
			placeholder: '(date, dateString) => {}',
		},
	},
}

const RangePicker: ComponentSchemaType = {
	nodePropsConfig: {
		renderExtraFooter: {
			type: NODE_PROPS_TYPES.functionReactNode,
			params: ['mode'],
		},
		...commonNodePropsConfig,
	},
	propsConfig: {
		...commonPropsConfig,
		disabledTime: {
			label: '不可选择的时间',
			type: PROPS_TYPES.function,
			placeholder: '(date) => {}',
		},
		format: {
			type: PROPS_TYPES.string,
			label: '展示的日期格式',
			placeholder: '默认 YYYY - MM - DD',
		},
		ranges: {
			label: '预设时间范围快捷选择',
			type: [PROPS_TYPES.object, PROPS_TYPES.function],
			childPropsConfig: {},
		},
		separator: {
			label: '设置分隔符',
			type: PROPS_TYPES.string,
		},
		showTime: {
			label: '增加时间选择功能',
			type: [PROPS_TYPES.boolean, PROPS_TYPES.object],
			childPropsConfig: {},
		},
		// value: {
		//   type: PROPS_TYPES.string,
		//   label: '日期',
		// }
		onCalendarChange: {
			label: '待选日期发生变化的回调',
			type: PROPS_TYPES.function,
			placeholder: '(dates, dateStrings)=>{}',
		},
		onChange: {
			type: PROPS_TYPES.function,
			label: '值改变时的回调',
			placeholder: '(date, dateString) => {}',
		},
		onOk: {
			label: '点击确定按钮的回调',
			type: PROPS_TYPES.function,
			placeholder: '(dates) => {}',
		},
	},
}

export default {
	DatePicker,
	'DatePicker.MonthPicker': MonthPicker,
	'DatePicker.WeekPicker': WeekPicker,
	'DatePicker.RangePicker': RangePicker,
}

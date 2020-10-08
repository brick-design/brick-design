import { ComponentSchemaType, PROPS_TYPES } from '@brickd/react'

const Calendar: ComponentSchemaType = {
	propsConfig: {
		dateCellRender: {
			label: '日期追加内容',
			tip: '自定义渲染日期单元格，返回内容会被追加到单元格',
			type: PROPS_TYPES.function,
			placeholder: '(date) => <div/>',
		},
		dateFullCellRender: {
			label: '日期覆盖',
			tip: '自定义渲染日期单元格，返回内容覆盖单元格',
			type: PROPS_TYPES.function,
			placeholder: '(date) => <div/>',
		},
		monthCellRender: {
			label: '月追加内容',
			tip: '自定义渲染月单元格，返回内容会被追加到单元格',
			type: PROPS_TYPES.function,
			placeholder: '(date) => <div/>',
		},
		monthFullCellRender: {
			label: '月覆盖内容',
			tip: '自定义渲染月单元格，返回内容覆盖单元格',
			type: PROPS_TYPES.function,
			placeholder: '(date) => <div/>',
		},
		disabledDate: {
			label: '不可选择的日期',
			type: PROPS_TYPES.function,
			placeholder: '(currentDate) => true',
		},
		fullscreen: {
			label: '是否全屏显示',
			type: PROPS_TYPES.boolean,
			defaultValue: true,
		},
		mode: {
			label: '初始模式',
			tip: '初始模式，month/year',
			type: PROPS_TYPES.enum,
			enumData: ['month', 'year'],
			defaultValue: 'month',
		},
		// value: {
		//   label: '展示日期',
		//   type: PROPS_TYPES.string,
		// },
		onPanelChange: {
			label: '日期面板变化',
			tip: '日期面板变化回调函数',
			type: PROPS_TYPES.function,
			placeholder: '(date, mode) => {}',
		},
		onSelect: {
			label: '点击选择日期',
			tip: '点击选择日期回调函数',
			type: PROPS_TYPES.function,
			placeholder: '(date) => {}',
		},
		onChange: {
			label: '日期变化',
			tip: '日期变化回调函数',
			type: PROPS_TYPES.function,
			placeholder: '(date) => {}',
		},
	},
}

export default Calendar

import { ComponentSchemaType, PROPS_TYPES } from '@brickd/react'

const TimePicker: ComponentSchemaType = {
	propsConfig: {
		allowEmpty: {
			label: '是否展示清除按钮',
			type: PROPS_TYPES.boolean,
			defaultValue: true,
		},
		autoFocus: {
			label: '自动获焦点',
			type: PROPS_TYPES.boolean,
			defaultValue: false,
		},
		clearText: {
			label: '清除按钮hover时的文案',
			type: PROPS_TYPES.string,
			defaultValue: 'clear',
		},
		disabled: {
			label: '禁用全部',
			type: PROPS_TYPES.boolean,
			defaultValue: false,
		},
		format: {
			label: '展示的时间格式',
			type: PROPS_TYPES.string,
			defaultValue: 'HH:mm:ss',
		},
		hourStep: {
			label: '小时选项间隔',
			type: PROPS_TYPES.number,
			defaultValue: 1,
			min: 1,
		},
		minuteStep: {
			label: '分钟选项间隔',
			type: PROPS_TYPES.number,
			defaultValue: 1,
			min: 1,
		},
		secondStep: {
			label: '秒选项间隔',
			type: PROPS_TYPES.number,
			defaultValue: 1,
			min: 1,
		},
		inputReadOnly: {
			label: '输入框只读',
			tip: '设置输入框为只读（避免在移动设备上打开虚拟键盘）',
			type: PROPS_TYPES.boolean,
			defaultValue: false,
		},
		placeholder: {
			label: '无值时内容',
			tip: '没有值的时候显示的内容',
			type: PROPS_TYPES.string,
		},
		use12Hours: {
			label: '12小时制',
			tip: '使用 12 小时制，为 true 时 format 默认为 h:mm:ss a',
			type: PROPS_TYPES.boolean,
			defaultValue: false,
		},
		onChange: {
			label: '值变化',
			tip: '时间发生变化的回调',
			type: PROPS_TYPES.function,
			placeholder: '(time, timeString) => {}',
		},
	},
}

export default TimePicker

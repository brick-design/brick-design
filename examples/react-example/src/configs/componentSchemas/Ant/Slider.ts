import { ComponentSchemaType, PROPS_TYPES } from '@brickd/react'

const Slider: ComponentSchemaType = {
	isNonContainer:true,

	propsConfig: {
		allowClear: {
			label: '支持清除',
			tip: '支持清除, 单选模式有效',
			type: PROPS_TYPES.boolean,
		},
		defaultValue: {
			label: '初始取值',
			tip:
				'设置初始取值。当 range 为 false 时，使用 number，否则用 [number, number]',
			type: [PROPS_TYPES.number, PROPS_TYPES.numberArray],
		},
		disabled: {
			label: '是否禁用',
			tip: '值为 true 时，滑块为禁用状态',
			type: PROPS_TYPES.boolean,
		},
		dots: {
			label: '拖拽限制',
			tip: '是否只能拖拽到刻度上',
			type: PROPS_TYPES.boolean,
		},
		included: {
			label: '包含关系',
			tip:
				'	marks 不为空对象时有效，值为 true 时表示值为包含关系，false 表示并列',
			type: PROPS_TYPES.boolean,
		},
		marks: {
			label: '刻度标记',
			tip:
				'刻度标记，key 的类型必须为 number 且取值在闭区间 min, max 内，每个标签可以单独设置样式',
			type: PROPS_TYPES.object,
			childPropsConfig: {},
		},
		max: {
			label: '最大值',
			type: PROPS_TYPES.number,
		},
		min: {
			label: '最小值',
			type: PROPS_TYPES.number,
		},
		range: {
			label: '双滑块模式',
			type: PROPS_TYPES.boolean,
		},
		reverse: {
			label: '反向坐标轴',
			type: PROPS_TYPES.boolean,
		},
		step: {
			label: '步长',
			tip:
				'	步长，取值必须大于 0，并且可被 (max - min) 整除。当 marks 不为空对象时，可以设置 step 为 null，此时 Slider 的可选值仅有 marks 标出来的部分。',
			type: [PROPS_TYPES.number, PROPS_TYPES.string],
		},
		tipFormatter: {
			label: '提示格式化',
			tip:
				'Slider 会把当前值传给 tipFormatter，并在 Tooltip 中显示 tipFormatter 的返回值，若为 null，则隐藏 Tooltip。',
			type: [PROPS_TYPES.function, PROPS_TYPES.string],
			placeholder: '() => {}',
		},
		value: {
			label: '当前取值',
			tip:
				'设置当前取值。当 range 为 false 时，使用 number，否则用 [number, number]',
			type: [PROPS_TYPES.number, PROPS_TYPES.numberArray],
		},
		vertical: {
			label: '垂直方向',
			tip:
				'值为 true 时，Slider 为垂直方向(注意：设置为true时，需要去样式配置中设置高度)',
			type: PROPS_TYPES.boolean,
		},
		onAfterChange: {
			label: '改变后',
			tip: '与 onmouseup 触发时机一致，把当前值作为参数传入。',
			type: PROPS_TYPES.function,
			placeholder: '(value) => {}',
		},
		onChange: {
			label: '值发生改变',
			tip:
				'当 Slider 的值发生改变时，会触发 onChange 事件，并把改变后的值作为参数传入。',
			type: PROPS_TYPES.function,
			placeholder: '(value) => {}',
		},
		tooltipPlacement: {
			label: '设置 Tooltip 展示位置。',
			type: PROPS_TYPES.enum,
			enumData: [
				'top',
				'left',
				'right',
				'bottom',
				'topLeft',
				'topRight',
				'bottomLeft',
				'bottomRight',
				'leftTop',
				'leftBottom',
				'rightTop',
				'rightBottom',
			],
		},
		tooltipVisible: {
			label: '是否显示Tooltip',
			tip:
				'值为true时，Tooltip 将会始终显示；否则始终不显示，哪怕在拖拽及移入时。',
			type: PROPS_TYPES.boolean,
		},
		getTooltipPopupContainer: {
			label: '渲染父节点',
			tip: 'Tooltip 渲染父节点，默认渲染到 body 上。',
			type: PROPS_TYPES.function,
			placeholder: '()=>document.body',
		},
	},
}

export default Slider

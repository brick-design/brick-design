import { ComponentSchemaType, PROPS_TYPES } from '@brickd/react'

const Affix: ComponentSchemaType = {
	propsConfig: {
		offsetBottom: {
			label: '达到偏移量后触发',
			tip: '距离窗口底部达到指定偏移量后触发',
			type: PROPS_TYPES.number,
		},
		offsetTop: {
			label: '达到偏移量后触发',
			tip: '距离窗口顶部达到指定偏移量后触发',
			type: PROPS_TYPES.number,
		},
		target: {
			label: '监听滚动事件的元素',
			tip:
				'设置 Affix 需要监听其滚动事件的元素，值为一个返回对应 DOM 元素的函数',
			type: PROPS_TYPES.function,
			placeholder: '() => window',
		},
		onChange: {
			label: '状态改变时触发',
			tip: '固定状态改变时触发的回调函数',
			type: PROPS_TYPES.function,
			placeholder: '(affixed)=>{}',
		},
	},
}

export default Affix

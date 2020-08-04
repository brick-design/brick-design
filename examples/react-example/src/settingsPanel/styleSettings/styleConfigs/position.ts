import { CSS_TYPE } from '../config'

const positionEnumData = ['relative', 'absolute', 'fixed', 'sticky']
const displayEnumData = ['block', 'inline', 'inline-block', 'flex', 'none']

export default {
	position: {
		label: '定位属性',
		labelSpan: 6,
		valueSpan: 10,
		span: 24,
		type: 'enum',
		props: {
			enumData: positionEnumData,
			size: 'small',
			placeholder: '请选择',
		},
	},
	top: {
		label: '上',
		labelPlace: 'bottom',
		span: 12,
		labelSpan: 0,
		valueSpan: 24,
		type: CSS_TYPE.number,
		props: {
			hasUnit: true,
		},
	},
	bottom: {
		label: '下',
		labelPlace: 'bottom',
		span: 12,
		labelSpan: 0,
		valueSpan: 24,
		type: CSS_TYPE.number,
		props: {
			hasUnit: true,
		},
	},
	left: {
		label: '左',
		labelPlace: 'bottom',
		span: 12,
		labelSpan: 0,
		valueSpan: 24,
		type: CSS_TYPE.number,
		props: {
			hasUnit: true,
		},
	},
	right: {
		label: '右',
		labelPlace: 'bottom',
		span: 12,
		labelSpan: 0,
		valueSpan: 24,
		type: CSS_TYPE.number,
		props: {
			hasUnit: true,
		},
	},
	display: {
		label: 'display属性',
		labelPlace: 'bottom',
		labelSpan: 0,
		valueSpan: 24,
		span: 12,
		type: 'enum',
		props: {
			enumData: displayEnumData,
			size: 'small',
			placeholder: '请选择',
		},
	},
	zIndex: {
		label: 'zIndex属性',
		labelPlace: 'bottom',
		labelSpan: 0,
		valueSpan: 24,
		span: 12,
		type: 'number',
	},
	flex: {
		label: 'flex',
		tip: 'display: flex；时生效',
		type: 'number',
		labelSpan: 8,
		valueSpan: 10,
		span: 24,
	},
}

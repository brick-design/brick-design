import { CSS_TYPE } from '../config'

const fEnumData = [
	{
		key: 'left',
		label: 'left',
	},
	{
		key: 'right',
		label: 'right',
	},
	{
		key: 'none',
		label: 'none',
	},
]
const cEnumData = [
	{
		key: 'left',
		label: 'left',
	},
	{
		key: 'right',
		label: 'right',
	},
	{
		key: 'both',
		label: 'both',
	},
	{
		key: 'none',
		label: 'none',
	},
]

export default {
	float: {
		label: '浮动属性',
		labelSpan: 6,
		valueSpan: 10,
		span: 24,
		type: CSS_TYPE.enum,
		props: {
			enumData: fEnumData,
			placeholder: '请选择',
		},
	},
	clear: {
		label: '清除属性',
		labelSpan: 6,
		valueSpan: 10,
		span: 24,
		type: CSS_TYPE.enum,
		props: {
			enumData: cEnumData,
			placeholder: '请选择',
		},
	},
	width: {
		label: '整体宽度',
		labelSpan: 6,
		valueSpan: 18,
		span: 24,
		type: CSS_TYPE.number,
		props: {
			hasUnit: true,
		},
	},
	maxWidth: {
		label: '最大宽度',
		labelPlace: 'bottom',
		span: 12,
		labelSpan: 0,
		valueSpan: 24,
		type: CSS_TYPE.number,
		props: {
			hasUnit: true,
		},
	},
	minWidth: {
		label: '最小宽度',
		labelPlace: 'bottom',
		span: 12,
		labelSpan: 0,
		valueSpan: 24,
		type: CSS_TYPE.number,
		props: {
			hasUnit: true,
		},
	},
	height: {
		label: '整体高度',
		labelSpan: 6,
		valueSpan: 18,
		span: 24,
		type: CSS_TYPE.number,
		props: {
			hasUnit: true,
		},
	},
	maxHeight: {
		label: '最大高度',
		labelPlace: 'bottom',
		span: 12,
		labelSpan: 0,
		valueSpan: 24,
		type: CSS_TYPE.number,
		props: {
			hasUnit: true,
		},
	},
	minHeight: {
		label: '最小高度',
		labelPlace: 'bottom',
		span: 12,
		labelSpan: 0,
		valueSpan: 24,
		type: CSS_TYPE.number,
		props: {
			hasUnit: true,
		},
	},
}

import { CSS_TYPE } from '../config'

const family = [
	{
		key: 'PingFangSC-Medium',
		label: 'PingFangSC-Medium',
	},
	{
		key: 'PingFangSC-Regular',
		label: 'PingFangSC-Regular',
	},
	{
		key: 'SimSun',
		label: '宋体',
	},
	{
		key: 'SimHei',
		label: '黑体',
	},
	{
		key: 'Microsoft YaHei',
		label: '微软雅黑',
	},
	{
		key: 'Microsoft JhengHei',
		label: '微软正黑体',
	},
	{
		key: 'NSimSun',
		label: '新宋体',
	},
	{
		key: 'PMingLiU',
		label: '新细明体',
	},
	{
		key: 'MingLiU',
		label: '细明体',
	},
	{
		key: 'DFKai-SB',
		label: '标楷体',
	},
	{
		key: 'FangSong',
		label: '仿宋',
	},
	{
		key: 'KaiTi',
		label: '楷体',
	},
	{
		key: 'FangSong_GB2312',
		label: '仿宋_GB2312',
	},
	{
		key: 'KaiTi_GB2312',
		label: '楷体_GB2312',
	},
]
const weight = [
	'normal',
	'bold',
	'bolder',
	'light',
	'lighter',
	100,
	200,
	300,
	400,
	500,
	600,
	700,
	800,
	900,
	'inherit',
]
const size = ['12', '14', '16', '18', '20', '28', '36', '48', '72']
const overflow = ['visible', 'hidden', 'scroll', 'auto']
const textTransform = [
	'none',
	'capitalize',
	'uppercase',
	'lowercase',
	'full-width',
]
const textDecoration = [
	'none',
	'underline',
	'overline',
	'line-through',
	'blink',
]
const whiteSpace = ['normal', 'pre', 'nowrap', 'pre-wrap', 'pre-line']
const wordWrap = ['normal', 'break-word']


const fontStretch = [
	'ultra-condensed',
	'extra-condensed',
	'condensed',
	'semi-condensed',
	'normal',
	'semi-expanded',
	'expanded',
	'extra-expanded',
	'ultra-expanded',
]
export default {
	fontFamily: {
		label: '字体',
		labelSpan: 0,
		valueSpan: 24,
		span: 24,
		type: CSS_TYPE.enum,
		props: {
			enumData: family,
			placeholder: '请选择字体',
		},
	},
	fontWeight: {
		label: '粗细',
		labelSpan: 0,
		valueSpan: 24,
		span: 12,
		type: CSS_TYPE.enum,
		props: {
			enumData: weight,
			placeholder: '请选择文字粗细',
		},
	},
	textDecoration: {
		label: '文本装饰',
		span: 12,
		labelSpan: 0,
		valueSpan: 24,
		type: CSS_TYPE.enum,
		props: {
			enumData: textDecoration,
		},
	},

	fontSize: {
		label: '字体大小',
		labelSpan: 0,
		valueSpan: 24,
		span: 6,
		type: CSS_TYPE.enum,
		props: {
			enumData: size,
			placeholder: '请输入或者选择字体大小',
		},
	},
	color: {
		label: '字体颜色',
		span: 6,
		labelSpan: 0,
		valueSpan: 24,
		type: CSS_TYPE.string,
		props: {
			isShowInput: false,
			isFont: true,
			isShowColor: true,
			colorColProps: { span: 24 },
		},
	},
	textIndent: {
		label: '文本缩进',
		labelPlace: 'bottom',
		span: 12,
		labelSpan: 0,
		valueSpan: 24,
		type: CSS_TYPE.number,
		props: {
			hasUnit: true,
		},
	},
	lineHeight: {
		label: '文本行高',
		labelPlace: 'bottom',
		span: 12,
		labelSpan: 0,
		valueSpan: 24,
		type: CSS_TYPE.number,
		props: {
			hasUnit: true,
		},
	},
	letterSpacing: {
		label: '文本间隔',
		labelPlace: 'bottom',
		span: 12,
		labelSpan: 0,
		valueSpan: 24,
		type: CSS_TYPE.number,
		props: {
			hasUnit: true,
		},
	},
	overflow: {
		label: '溢出选项',
		labelPlace: 'bottom',
		labelSpan: 0,
		valueSpan: 24,
		span: 12,
		type: 'enum',
		props: {
			enumData: overflow,
			placeholder: '请选择',
		},
	},
	fontStretch: {
		label: '字体拉伸',
		labelPlace: 'bottom',
		labelSpan: 0,
		valueSpan: 24,
		span: 12,
		type: 'enum',
		props: {
			enumData: fontStretch,
			placeholder: '请选择',
		},
	},
	textTransform: {
		label: '文本转换',
		labelPlace: 'bottom',
		labelSpan: 0,
		valueSpan: 24,
		span: 12,
		type: CSS_TYPE.enum,
		props: {
			enumData: textTransform,
			placeholder: '请选择',
		},
	},
	fontSizeAdjust: {
		label: '字体调整',
		labelPlace: 'bottom',
		labelSpan: 0,
		valueSpan: 24,
		span: 12,
		type: CSS_TYPE.number,
		props: {
			step: 0.01,
			min: 0,
			precision: 2,
			size: 'small',
		},
	},
	whiteSpace: {
		label: '处理空白符',
		labelPlace: 'bottom',
		labelSpan: 0,
		valueSpan: 24,
		span: 12,
		type: CSS_TYPE.enum,
		props: {
			enumData: whiteSpace,
			placeholder: '请选择',
		},
	},
	wordWrap: {
		label: '单词折行',
		labelPlace: 'bottom',
		labelSpan: 0,
		valueSpan: 24,
		span: 12,
		type: CSS_TYPE.enum,
		props: {
			enumData: wordWrap,
			placeholder: '请选择',
		},
	},
}

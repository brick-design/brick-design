import { CSS_TYPE } from '../config'

export default {
	backgroundColor: {
		label: '背景色',
		span: 24,
		type: CSS_TYPE.string,
		props: {
			inputProps: { placeholder: '请输入或在右侧选择' },
			isFont: false,
			isShowColor: true,
		},
	},
}

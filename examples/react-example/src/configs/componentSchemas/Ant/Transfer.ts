import { ComponentSchemaType, PROPS_TYPES } from '@brickd/react'

const Transfer: ComponentSchemaType = {
	isNonContainer:true,

	propsConfig: {
		render: {
			label: '行元素渲染',
			tip:
				'每行数据渲染函数，该函数的入参为 dataSource 中的项，返回值为 ReactElement。或者返回一个普通对象，其中 label 字段为 ReactElement，value 字段为 title',
			type: PROPS_TYPES.function,
			placeholder: '(record) => {}',
			rules: [
				{
					required: true,
					message: '请输入render方法名称',
				},
			],
		},
		showSearch: {
			label: '是否显示搜索框',
			type: PROPS_TYPES.boolean,
			defaultValue: false,
		},
		titles: {
			label: '标题集合',
			tip: '标题集合，顺序从左至右',
			type: PROPS_TYPES.stringArray,
			stringCount: 2,
		},
		onChange: {
			label: '数据切换函数',
			tip: '选项在两栏之间转移时的回调函数',
			type: PROPS_TYPES.function,
			placeholder: '(targetKeys, direction, moveKeys) => {}',
		},
	},
}

export default Transfer

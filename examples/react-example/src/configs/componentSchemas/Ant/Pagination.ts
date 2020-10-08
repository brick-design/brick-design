import {
	ComponentSchemaType,
	NODE_PROPS_TYPES,
	PROPS_TYPES,
} from '@brickd/react'

const Pagination: ComponentSchemaType = {
	nodePropsConfig: {
		itemRender: {
			type: NODE_PROPS_TYPES.functionReactNode,
			isOnlyNode: true,
			params: ['page', 'type', 'originalElement'],
		},
	},
	propsConfig: {
		current: {
			label: '当前页数',
			tip: '当前页数',
			type: PROPS_TYPES.number,
		},
		defaultCurrent: {
			label: '默认当前页数',
			tip: '默认的当前页数',
			type: PROPS_TYPES.number,
			defaultValue: 1,
		},
		defaultPageSize: {
			label: '默认每页条数',
			tip: '默认的每页条数',
			type: PROPS_TYPES.number,
			defaultValue: 10,
		},
		disabled: {
			label: '禁用分页',
			type: PROPS_TYPES.boolean,
		},
		hideOnSinglePage: {
			label: '隐藏分页',
			tip: '只有一页时是否隐藏分页器',
			type: PROPS_TYPES.boolean,
			defaultValue: false,
		},
		pageSize: {
			label: '每页条数',
			tip: '每页条数',
			type: PROPS_TYPES.number,
			defaultValue: 10,
		},
		pageSizeOptions: {
			label: '每页显示条数',
			tip: '指定每页可以显示多少条',
			type: PROPS_TYPES.stringArray,
			// type: PROPS_TYPES.enum,
			// enumData: ['10', '20', '30', '40']
		},
		showLessItems: {
			label: 'show less page items',
			type: PROPS_TYPES.boolean,
		},
		showQuickJumper: {
			label: '快速跳转',
			tip: '是否可以快速跳转至某页',
			type: PROPS_TYPES.boolean,
			defaultValue: false,
		},
		showSizeChanger: {
			label: '改变pageSize',
			tip: '是否可以改变 pageSize',
			type: PROPS_TYPES.boolean,
			defaultValue: false,
		},
		showTotal: {
			label: '显示数据总量',
			tip: '用于显示数据总量和当前数据顺序',
			type: PROPS_TYPES.function,
			placeholder: '(total, range) => {}',
		},
		simple: {
			label: '简单分页',
			tip: '当添加该属性时，显示为简单分页',
			type: PROPS_TYPES.boolean,
			defaultValue: false,
		},
		size: {
			label: '分页尺寸',
			tip: '当为「small」时，是小尺寸分页',
			type: PROPS_TYPES.enum,
			enumData: ['small'],
		},
		total: {
			label: '数据总数',
			tip: '数据总数',
			type: PROPS_TYPES.number,
			defaultValue: 0,
		},
		onChange: {
			label: '页码改变回调',
			tip: '页码改变的回调，参数是改变后的页码及每页条数',
			type: PROPS_TYPES.function,
			placeholder: '(page, pageSize) => {}',
		},
		onShowSizeChange: {
			label: 'pageSize变化回调',
			tip: 'pageSize 变化的回调',
			type: PROPS_TYPES.function,
			placeholder: '(current, size) => {}',
		},
	},
}

export default Pagination

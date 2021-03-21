import { CategoryType } from '@brickd/react-web'

export const reactContainers: CategoryType = {
	Layout: {
		components: {
			Layout: {
				props: [
					{
						style: {
							height: 100,
						},
					},
				],
			},
			'Layout.Header': {
				props: [
					{
						style: {
							height: 50,
						},
					},
				],
			},
			'Layout.Footer': {
				props: [
					{
						style: {
							height: 50,
						},
					},
				],
			},
			'Layout.Content': {
				props: [
					{
						style: {
							height: 100,
						},
					},
				],
			},
			'Layout.Sider': null,
		},
	},
	GridLayout: {
		components: {
			Row: null,
			Col: null,
		},
	},
	Button: {
		span: 12,
		props: [
			{
				type: 'primary',
				children: 'primary',
			},
			{
				type: 'danger',
				children: 'danger',
			},
			{
				type: 'dashed',
				children: 'dashed',
			},
			{
				type: 'primary',
				icon: 'search',
				children: 'srch',
			},
			{
				type: 'primary',
				loading: true,
				children: 'load',
			},
		],
	},
	"Button.Group":null,
	Input: {
		components: {
			Input: {
				props: [
					{},
					{
						addonBefore: 'Http://',
						addonAfter: '.com',
						defaultValue: 'mysite',
					},
				],
			},
			'Input.Group': null,
		},
	},
	Tabs: {
		components: {
			Tabs: null,
			'Tabs.TabPane': null,
		},
	},
	Cards: {
		components: {
			Card: null,
			'Card.Grid': null,
			'Card.Meta': null,
		},
	},
	Collapse: {
		components: {
			Collapse: null,
			'Collapse.Panel': null,
		},
	},
	Timeline: {
		components: {
			Timeline: null,
			'Timeline.Item': null,
		},
	},
	Breadcrumb: {
		components: {
			Breadcrumb: null,
			'Breadcrumb.Item': null,
			'Breadcrumb.Separator': null,
		},
	},
	Dropdown: {
		components: {
			Dropdown: null,
			'Dropdown.Button': null,
		},
	},
	Menus: {
		span: 12,
		components: {
			Menu: null,
			'Menu.Item': null,
			'Menu.SubMenu': null,
			'Menu.ItemGroup': null,
			'Menu.Divider': null,
		},
	},
	Steps: {
		span: 12,
		components: {
			Steps: null,
			'Steps.Step': null,
		},
	},
	AutoComplete: {
		span: 12,
		components: {
			AutoComplete: null,
			'AutoComplete.Option': null,
			'AutoComplete.OptGroup': null,
		},
	},
	DatePicker: {
		components: {
			DatePicker: null,
			'DatePicker.MonthPicker': null,
			'DatePicker.WeekPicker': null,
			'DatePicker.RangePicker': null,
		},
	},
	Form: {
		components: {
			Form: null,
			'Form.Item': null,
		},
	},
	Select: {
		components: {
			Select: null,
			'Select.Option': null,
			'Select.OptGroup': null,
		},
	},

	TreeSelect: {
		components: {
			TreeSelect: null,
			'TreeSelect.TreeNode': null,
		},
	},
	List: {
		components: {
			List: null,
			'List.Item': null,
			'List.Item.Meta': null,
		},
	},
	Tag: {
		props: [{ children: 'Tag' }],
	},
	Cascader: {
		props: [
			{
				options: [
					{
						value: 'zhejiang',
						label: 'Zhejiang',
						children: [
							{
								value: 'haha',
								label: 'haha',
							},
						],
					},
				],
			},
		],
	},
	PageHeader: null,
	Pagination: {
		props: [{}],
	},
	Tooltip: {
		props: [{ children: 'Tooltip', title: 'Tooltip' }],
	},
	Spin: {
		props: [{}],
	},
	Popover: {
		props: [{ children: 'Popover', content: 'Popover' }],
	},
	Divider: {
		props: [{ children: 'Divider' }],
	},
	Carousel: null,
	Badge: {
		span: 12,
		props: [
			{ count: 25 },
			{ style: { backgroundColor: '#52c41a' }, count: 109 },
		],
	},
	BackTop: null,
	Anchor: {
		components: {
			Anchor: null,
			'Anchor.Link': null,
		},
	},
	Upload: null,
	'Radio.Group': null,
	Switch: {
		span: 12,
		props: [
			{ checkedChildren: '开', unCheckedChildren: '关' },
			{ loading: true },
		],
	},
	Avatar: {
		span: 12,
		props: [
			{
				src:
					'https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1409542008,2775622124&fm=111&gp=0.jpg',
				size: 100,
			},
			{
				src:
					'https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1409542008,2775622124&fm=111&gp=0.jpg',
				size: 100,
				shape: 'square',
			},
		],
	},
	Affix: null,
	Modal: null,
	Drawer: null,
}

export const reactNonContainers: CategoryType = {
	Typography: {
		components: {
			'Typography.Text': null,
			'Typography.Title': null,
			'Typography.Paragraph': null,
		},
	},
	Icon: {
		props: [{ type: 'heart' }],
	},
	Checkbox: {
		components: {
			Checkbox: {
				props: [{}],
			},
			'Checkbox.Group': null,
		},
	},
	InputNumber: {
		props: [{}],
	},
	Input: {
		components: {
			'Input.TextArea': {
				props: [{}],
			},
			'Input.Search': {
				props: [{}],
			},
			'Input.Password': {
				props: [{ visibilityToggle: true }],
			},
		},
	},
	Radio: {
		components: {
			Radio: {
				props: [{ children: 'Radio' }],
			},
			'Radio.Button': {
				props: [{ children: 'Radio.Button' }],
			},
		},
	},
	Rate: {
		props: [{}],
	},
	Slider: {
		props: [{}],
	},
	Transfer: null,
}

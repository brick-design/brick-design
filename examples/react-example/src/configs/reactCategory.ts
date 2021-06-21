import { CategoryType } from '@brickd/react-web'

// @ts-ignore
export const reactContainers: any = {
	Layout: {
		Layout:[{props:{
			style: {
					height: '100%',
					width:'100%',
				}}}],
		'Layout.Header': [{
			props:{
				style: {
					height: 50,
				},
			}
		}],
		'Layout.Footer': [{
			props: {
					style: {
						height: 50,
					},
				},
		}],
		'Layout.Content': [{
			props: {
					style: {
						height: 100,
					},
				},
		}],
		'Layout.Sider': null,
		Row: null,
		Col: null,
		Divider: [{
			props: { children: 'Divider' },
		}],
	},
	General: {
		Button:[{
			props:{
				type: 'primary',
				children: 'primary',
			}
		},{
			props:{
				type: 'primary',
				icon: 'search',
				children: 'srch',
			},
		}],
		Icon:[{props:{ type: 'heart' }}],
		'Typography.Text': null,
		'Typography.Title': null,
		'Typography.Paragraph': null,
	},
	Navigation:{
		Affix: null,
		Breadcrumb: null,
		'Breadcrumb.Item': null,
		'Breadcrumb.Separator': null,
		Dropdown: null,
		'Dropdown.Button': null,
		Menu: null,
		'Menu.Item': null,
		'Menu.SubMenu': null,
		'Menu.ItemGroup': null,
		'Menu.Divider': null,
		PageHeader: null,
		Pagination:null,
		Steps: null,
		'Steps.Step': null,
	},
	'Data Entry':{
	AutoComplete: null,
		'AutoComplete.Option': null,
		'AutoComplete.OptGroup': null,
		Cascader:[{props:{
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
		},}],
		Checkbox: [{
		props:{}
		}],
		'Checkbox.Group': null,
		DatePicker: null,
		'DatePicker.MonthPicker': null,
		'DatePicker.WeekPicker': null,
		'DatePicker.RangePicker': null,
		Form: null,
		'Form.Item': null,
		Input: [{
			props: {},
		},{props:{
				addonBefore: 'Http://',
				addonAfter: '.com',
				defaultValue: 'mysite',
			}}],
		'Input.TextArea': [{
			props: [{}],
		}],
		'Input.Search': [{
			props: [{}],
		}],
		'Input.Password': [{
			props: [{ visibilityToggle: true }],
		}],
		'Input.Group': null,
		'InputNumber':[{props:{}}],
		Radio:[{
			props: { children: 'Radio' },
		}] ,
		'Radio.Button': [{
			props: { children: 'Radio.Button' },
		}],
		Rate: [{
			props: {},
		}],
		Select: null,
		'Select.Option': null,
		'Select.OptGroup': null,
		Slider: [{
			props: {},
		}],
		Switch: [{
			props: { checkedChildren: '开', unCheckedChildren: '关' },
		},{props:{ loading: true }}],
		Transfer: null,
		Upload: null,
		TreeSelect: null,
		'TreeSelect.TreeNode': null,
},
	'Data Display': {
		Anchor: null,
		'Anchor.Link': null,
		Badge:[{props:{ count: 25 },
			},{props:{ style: { backgroundColor: '#52c41a' }, count: 109 },}],
		Card: null,
		'Card.Grid': null,
		'Card.Meta': null,
		Carousel: null,
		Collapse: null,
		'Collapse.Panel': null,
		List: null,
		'List.Item': null,
		'List.Item.Meta': null,
		Popover: [{
			props: { children: 'Popover', content: 'Popover' },
		}],
		Tabs: null,
		'Tabs.TabPane': null,
		Tag: [{
			props: { children: 'Tag' },
		}],
		Timeline: null,
		'Timeline.Item': null,
		Tooltip: [{
			props: { children: 'Tooltip', title: 'Tooltip' }
		}],
	},
	Feedback:{
		Drawer: null,
		Modal: null,
		BackTop: null,
		Spin: [{
			props: {},
		}],
		Avatar: [{
			props: {
					src:
						'https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1409542008,2775622124&fm=111&gp=0.jpg',
					size: 100,
				}
		},{props:{
				src:
					'https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1409542008,2775622124&fm=111&gp=0.jpg',
				size: 100,
				shape: 'square',
			},}],
	}
}

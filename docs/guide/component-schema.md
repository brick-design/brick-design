---
title: 组件的配置介绍
order: 9
nav:
  order: 10
---

### 介绍
为了让编辑器识别组件与组件的特性，需要将组件特性抽象成相应的对象。

以下为Ant Design中Layout组件的标准配置对象。

Layout.ts

```ts
import {ComponentSchemaType,NODE_PROPS_TYPES,PROPS_TYPES} from '@brickd/react'

const Layout: ComponentSchemaType = {
	propsConfig: {
		hasSider: {
			label: '子元素是否有sider',
			tip: '表示子元素里有 Sider，一般不用指定。可用于服务端渲染时避免样式闪动',
			type: PROPS_TYPES.boolean,
		},
		className: {
			label: '类名',
			type: PROPS_TYPES.stringArray,
		},
	},
}

const Header: ComponentSchemaType = {
	propsConfig: {
		className: {
			label: '样式类名',
			type: PROPS_TYPES.string,
		},
	},
}
const Footer: ComponentSchemaType = {
	propsConfig: {
		className: {
			label: '样式类名',
			type: PROPS_TYPES.string,
		},
	},
}
const Sider: ComponentSchemaType = {
	nodePropsConfig: {
		trigger: {
			type: NODE_PROPS_TYPES.reactNode,
		},
		children: {
			type: NODE_PROPS_TYPES.reactNode,
		},
	},
	propsConfig: {
		trigger: {
			label: 'trigger',
			tip: '自定义 trigger，设置为 null 时隐藏 trigger',
			type: PROPS_TYPES.string,
		},
		breakpoint: {
			label: '断点触发',
			tip: '触发响应式布局的断点',
			type: PROPS_TYPES.enum,
			enumData: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
		},
		collapsed: {
			label: '当前收起状态',
			type: PROPS_TYPES.boolean,
		},
		collapsedWidth: {
			label: '收缩宽度',
			tip: '收缩宽度，设置为 0 会出现特殊 trigger',
			type: PROPS_TYPES.number,
		},
		collapsible: {
			label: '是否可收起',
			type: PROPS_TYPES.boolean,
		},
		defaultCollapsed: {
			label: '是否默认收起',
			type: PROPS_TYPES.boolean,
		},
		reverseArrow: {
			label: '翻转折叠提示箭头的方向',
			tip: '翻转折叠提示箭头的方向，当 Sider 在右边时可以使用',
			type: PROPS_TYPES.boolean,
		},
		theme: {
			label: '主题颜色',
			type: PROPS_TYPES.enum,
			enumData: ['light', 'dark'],
		},

		width: {
			label: '宽度',
			type: PROPS_TYPES.number,
			hasUnit: true,
		},
		onCollapse: {
			label: '收起时的回调函数',
			tip:
				'展开-收起时的回调函数，有点击 trigger 以及响应式反馈两种方式可以触发',
			type: PROPS_TYPES.function,
			placeholder: '(collapsed, type) => {}',
		},
		onBreakpoint: {
			label: '触发响应式布局断点时的回调',
			type: PROPS_TYPES.function,
			placeholder: '(broken) => {}',
		},
		zeroWidthTriggerStyle: {
			label: 'trigger 的样式',
			tip: '指定当 collapsedWidth 为 0 时出现的特殊 trigger 的样式',
			type: PROPS_TYPES.object,
			childPropsConfig: {},
		},
	},
}
const Content: ComponentSchemaType = {
	propsConfig: {
		className: {
			label: '样式类名',
			type: PROPS_TYPES.string,
		},
	},
}

export default {
	Layout,
	'Layout.Header': Header,
	'Layout.Footer': Footer,
	'Layout.Content': Content,
	'Layout.Sider': Sider,
}
```
### 为什么会是这样的？
在antd中Layout其实是5个组件，除了Layout本身，其他四个都属于它的附属组件，以静态属性的形式挂载在Layout上，所以在使用时需要Layout.XXX的形式获取，
brick design使用了lodash的get方式来获取组件，当一个组件的配置信息拖放到编辑区域，brick design首先读取组件的名字，通过这个名字与组件集合中通过get(components,path)获取组件，path就是组件的名字，因为Layout的其他
附属组件需要通过Layout.XXX的形式获取，所以组件的配置信息的属性名也就是Layout.XXX的形式。

### 为什么5个组件的配置信息写到一个文件？
其实建议一个文件写一个组件的配置信息，并且将文件名命名为组件的名字，这样便于维护与查找，类似Layout这种组件最好写成几个组件的配置信息放入同一个文件中，并且文件名已主组件名命名，这样设计保证组件的配置信息与组件的真实结构一致，便于对着组件文档维护与扩展配置信息。

一般组件的配置信息如下 Button.ts

```ts
import { ComponentSchemaType, PROPS_TYPES } from '@brickd/react'

const Button: ComponentSchemaType = {
	propsConfig: {
		children: {
			label: '内容',
			type: PROPS_TYPES.string,
		},
		disabled: {
			label: '禁用',
			tip: '按钮失效状态',
			type: PROPS_TYPES.boolean,
		},
		ghost: {
			label: '幽灵模式',
			tip: '按钮背景透明',
			type: PROPS_TYPES.boolean,
		},
		onClick: {
			label: '点击事件',
			tip: '点击事件回调',
			type: PROPS_TYPES.function,
			placeholder: '(event) => {}',
		},
		...
	},
}

export default Button
```
### 组件配置集合
以下是antd组件库的所有组件的配置信息集合。

index.ts

```ts
import AutoComplete from './AutoComplete'
import Anchor from './Anchor'
import Layout from './Layout'
import Cascader from './Cascader'
import Checkbox from './Checkbox'
import Input from './Input'
import InputNumber from './InputNumber'
import Rate from './Rate'
import Slider from './Slider'
import Switch from './Switch'
import Avatar from './Avatar'
import Calendar from './Calendar'
import Divider from './Divider'
import Tabs from './Tabs'
import Progress from './Progress'
import Tag from './Tag'
import TimePicker from './TimePicker'
import Transfer from './Transfer'
import Tree from './Tree'
import TreeSelect from './TreeSelect'
import DatePicker from './DatePicker'
import Button from './Button'
import Icon from './Icon'
import Radio from './Radio'
import BackTop from './BackTop'
import List from './List'
import Timeline from './Timeline'
import Tooltip from './Tooltip'
import Popover from './Popover'
import Badge from './Badge'
import Collapse from './Collapse'
import Carousel from './Carousel'
import Card from './Card'
import Modal from './Modal'
import Pagination from './Pagination'
import Row from './Row'
import Col from './Col'
import Menu from './Menu'
import Form from './Form'
import Affix from './Affix'
import Typography from './Typography'
import Breadcrumb from './Breadcrumb'
import Dropdown from './Dropdown'
import PageHeader from './PageHeader'
import Steps from './Steps'
import Select from './Select'
import Drawer from './Drawer'

export default {
	...AutoComplete,
	...Anchor,
	...Layout,
	Affix,
	Avatar,
	BackTop,
	Badge,
	...Breadcrumb,
	Button,
	Calendar,
	...Card,
	Carousel,
	Cascader,
	...Checkbox,
	Col,
	...Collapse,
	...DatePicker,
	Divider,
	Drawer,
	...Dropdown,
	...Form,
	Icon,
	...Input,
	InputNumber,
	...List,
	...Menu,
	Modal,
	PageHeader,
	Pagination,
	Popover,
	Progress,
	...Radio,
	Rate,
	Row,
	...Select,
	Slider,
	...Steps,
	Switch,
	...Tabs,
	Tag,
	...Timeline,
	TimePicker,
	Tooltip,
	Transfer,
	...Tree,
	...TreeSelect,
	...Typography,
}

```
你会看到类似Layout组件配置信息都是以解构的形式出现的，为什么？再次看一下Layout 配置文件中导出的形式，其实Layout文件本身已经是组件集合了，所以在最终的集合导出时需要解构。

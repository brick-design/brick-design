import { defineConfig } from 'dumi'

export default defineConfig({
	mode: 'site',
	title: 'Brick Design',
	hash: true,
	menus:{
		'/guide': [
			{
				title: '简介',
				children: ['guide/index', 'guide/getting-started'],
			},
			{
				title: '基础配置',
				children: ['guide/configs','guide/component-schema'],
			},
			{
				title: '类型定义',
				children: ['guide/types/ConfigType','guide/types/ComponentSchemaTypes'],
			}
		],
		'/react': [
			{
				title: '介绍',
				children: ['react/index', 'react/getting-started'],
			},
			{
				title: '组件',
				children: ['react/components/BrickProvider','react/components/BrickDesign','react/components/BrickTree'],
			},
			{
				title: 'Api',
				children: ['react/api/state','react/api/functions'],
			}
		],
	},
	navs: [
		null,
		{ title: 'GitHub', path: 'https://github.com/brick-design/react-visual-editor' },
	],
})

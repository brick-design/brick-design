import { reactContainers } from './reactCategory'
import * as Ants from 'antd/es'
import componentSchemas from './componentSchemas'
import { ConfigType } from '@brickd/react'

/**
 * 容器组件分类
 */
export const CONTAINER_CATEGORY = { ...reactContainers, HTMLTag: {
		div: null,
		a: null,
		span: null,
		del:null,
		img: [{
			props: {
				style: { height: '100%',width:'100%' },
				src:
					'https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1191630624,1109312732&fm=26&gp=0.jpg',
			},
		}],
	} }

/**
 * 设计面板iframe 模板，如果集成到项目中，需要将拖拽组件所依赖的样式在模板中设置，
 * 否则设计面板渲染的页面将是无样式的效果
 */
const config: ConfigType = {
	componentsMap: Ants,
	componentSchemasMap:componentSchemas,
}

export default config

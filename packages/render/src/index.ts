import {
	ChildNodesType,
	ComponentConfigsType,
	PropsNodeType,
	ROOT,
	LEGO_BRIDGE,
	VirtualDOMType,
	ComponentConfigTypes,
} from '@brickd/core'
import { each, get, isArray, map, reduce } from 'lodash'
type PluginType=(vDom: VirtualDOMType,componentConfig:ComponentConfigTypes)=>VirtualDOMType

export default function brickRender(pageConfigs: ComponentConfigsType, createElement: any, plugins?: PluginType[]) {

	function handlePlugins(vDom: VirtualDOMType, plugins: any=[]) {
		const componentConfig=get(LEGO_BRIDGE.config.AllComponentConfigs,vDom.componentName)
		const newVDom=reduce(plugins, (newVDom, plugin) => plugin(newVDom,componentConfig), vDom)
		return newVDom.props
	}

	function renderArrChildNodes(childNodes: string[]) {
		return map(childNodes, key => {
			const vDom = pageConfigs[key]
			const { componentName, childNodes } = vDom
			return createElement(get(LEGO_BRIDGE.config.OriginalComponents, componentName, componentName), { ...handlePlugins(vDom, plugins), ...renderChildNodes(childNodes) })
		})
	}

	function renderMapChildNodes(childNodes: PropsNodeType) {
		const mapChildNodes: any = {}
		each(childNodes, (childNodeKeys, propName) => {
			mapChildNodes[propName] = renderArrChildNodes(childNodeKeys)
		})
		return mapChildNodes
	}

	function renderChildNodes(childNodes: ChildNodesType) {
		if (isArray(childNodes)) {
			return { children: renderArrChildNodes(childNodes) }
		} else {
			return renderMapChildNodes(childNodes)
		}
	}

	const Root = pageConfigs[ROOT]
	const { componentName, childNodes } = Root
	return createElement(get(LEGO_BRIDGE.config.OriginalComponents, componentName, componentName), { ...handlePlugins(Root, plugins), ...renderChildNodes(childNodes) })
}

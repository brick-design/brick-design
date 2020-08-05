import {
	ChildNodesType,
	PropsNodeType,
	ROOT,
	LEGO_BRIDGE,
	VirtualDOMType,
	ComponentConfigTypes,
	 ComponentConfigsType,
} from '@brickd/core'
import { each, get, isArray, map, reduce } from 'lodash'
type PluginType=(vDom: VirtualDOMType,componentConfig:ComponentConfigTypes)=>VirtualDOMType

interface BrickRenderType{
	componentConfigs:ComponentConfigsType
	createElement: any,
	plugins?: PluginType[]
}
export default function BrickRender(props:BrickRenderType) {
	const {componentConfigs,createElement,plugins}=props

	function handlePlugins(vDom: VirtualDOMType, plugins: any=[]) {
		const componentConfig=get(LEGO_BRIDGE.config.AllComponentConfigs,vDom.componentName)
		const newVDom=reduce(plugins, (newVDom, plugin) => plugin(newVDom,componentConfig), vDom)
		return newVDom.props
	}

	function renderArrChildNodes(childNodes: string[]) {
		return map(childNodes, key => {
			return renderNode(componentConfigs[key],key)
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

	function renderNode(vDom:VirtualDOMType,key?:string){
		const { componentName, childNodes } = vDom
		return createElement(get(LEGO_BRIDGE.config.OriginalComponents, componentName, componentName), {key, ...handlePlugins(vDom, plugins), ...renderChildNodes(childNodes) })
	}


	return renderNode(componentConfigs[ROOT])
}

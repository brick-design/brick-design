import {
	ChildNodesType,
	PropsNodeType,
	ROOT,
	VirtualDOMType,
	ComponentSchemaType,
	PageConfigType, getBrickdConfig,
} from '@brickd/core';
import { each, get, isArray, map, reduce } from 'lodash';

type PluginType=(vDom: VirtualDOMType,componentSchema:ComponentSchemaType)=>VirtualDOMType

interface BrickRenderType{
	pageConfig:PageConfigType
	createElement: any,
	plugins?: PluginType[]
}
export default function BrickRender(props:BrickRenderType) {
	const {pageConfig,createElement,plugins}=props;

	function handlePlugins(vDom: VirtualDOMType, plugins: any=[]) {
		const componentSchema=get(getBrickdConfig().componentSchemasMap,vDom.componentName);
		const newVDom=reduce(plugins, (newVDom, plugin) => plugin(newVDom,componentSchema), vDom);
		return newVDom.props;
	}

	function renderArrChildNodes(childNodes: string[]) {
		return map(childNodes, key => {
			return renderNode(pageConfig[key],key);
		});
	}

	function renderMapChildNodes(childNodes: PropsNodeType) {
		const mapChildNodes: any = {};
		each(childNodes, (childNodeKeys, propName) => {
			mapChildNodes[propName] = renderArrChildNodes(childNodeKeys);
		});
		return mapChildNodes;
	}

	function renderChildNodes(childNodes: ChildNodesType) {
		if (isArray(childNodes)) {
			return { children: renderArrChildNodes(childNodes) };
		} else {
			return renderMapChildNodes(childNodes);
		}
	}

	function renderNode(vDom:VirtualDOMType,key?:string){
		const { componentName, childNodes } = vDom;
		return createElement(get(getBrickdConfig().componentsMap, componentName, componentName), {key, ...handlePlugins(vDom, plugins), ...renderChildNodes(childNodes) });
	}


	return renderNode(pageConfig[ROOT]);
}

import React, {
	createElement,
	memo, useCallback, useContext, useMemo,
} from 'react';
import { each, get } from 'lodash';
import { FunParamContextProvider,useCommon,StaticContext } from '@brickd/hooks';
import NoneContainer from './NoneContainer';
import StateDomainWrapper from './StateDomainWrapper';

/**
 * 所有的容器组件名称
 */
export type CommonPropsType={
	renderKey:string;
	[propName:string]:any
}
function Container(vProps:CommonPropsType) {
	const {renderKey,...rest}=vProps;
	const {pageConfig,componentsMap}=useContext(StaticContext);
	const vNode=pageConfig[renderKey];
	const {componentName,childNodes}=vNode;
	const {props,hidden}=useCommon(vNode,rest);

	const renderArrChild=useCallback((childNodes:string[])=>{

		return childNodes.map((nodeKey)=>{
			const {childNodes,isStateDomain}=pageConfig[nodeKey];
			if(isStateDomain) return <StateDomainWrapper renderKey={nodeKey} key={nodeKey}/>;
			if(childNodes) {
				return <Container renderKey={nodeKey} key={nodeKey} />;
			}else {
				return <NoneContainer renderKey={nodeKey} key={nodeKey}/>;
			}
		});
	},[pageConfig]);

const nodeProps=	useMemo(()=>{
	const nodeProps={};
	if(Array.isArray(childNodes)){
			nodeProps['children']=renderArrChild(childNodes);
		}else {
			each(childNodes,(nodes,propName)=>{
				if(propName.includes('#')){
					const realPropName=propName.substring(1);
					// eslint-disable-next-line react/display-name
					nodeProps[realPropName]=(...funParams)=>{
						return(<FunParamContextProvider value={funParams}>
							{renderArrChild(nodes)}</FunParamContextProvider>) ;
					};
				}else {
					nodeProps[propName]=renderArrChild(nodes);
				}
			});
		}
	return nodeProps;
},[pageConfig,childNodes,renderArrChild]);
const propsResult=useMemo(()=>({...props,...nodeProps}),[props,nodeProps]);
	if(hidden) return null;
	return createElement(get(componentsMap,componentName,componentName),propsResult);
}

export default memo<CommonPropsType>(Container);

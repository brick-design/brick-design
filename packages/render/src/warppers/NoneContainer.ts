import  { createElement, forwardRef, memo, useContext } from 'react';

import { get } from 'lodash';
import { CommonPropsType } from '@brickd/utils';
import { useCommon,StaticContext } from '@brickd/hooks';


function NoneContainer(vProps:CommonPropsType) {
	const {renderKey,...rest}=vProps;
	const {pageConfig,componentsMap}=useContext(StaticContext);
	const vNode=pageConfig[renderKey];
	const {props,hidden}=useCommon(vNode,rest);
	const {componentName}=vNode;
	if(hidden) return null;
	return createElement(get(componentsMap,componentName,componentName),props);
}

export default memo<CommonPropsType>(forwardRef(NoneContainer));

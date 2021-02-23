import { createElement, forwardRef, memo, useContext, useMemo } from 'react';

import { get } from 'lodash';
import { CommonPropsType } from '@brickd/utils';
import { useCommon,StaticContext } from '@brickd/hooks';


function NoneContainer(vProps:CommonPropsType,ref:any) {
	const {renderKey,...rest}=vProps;
	const {pageConfig,componentsMap}=useContext(StaticContext);
	const vNode=pageConfig[renderKey];
	const {props,hidden}=useCommon(vNode,rest);
	const {componentName}=vNode;
	const propsResult=useMemo(()=>({...props,ref}),[props,ref]);

	if(hidden) return null;
	return createElement(get(componentsMap,componentName,componentName),propsResult);
}

export default memo<CommonPropsType>(forwardRef(NoneContainer));

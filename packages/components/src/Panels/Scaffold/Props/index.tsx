import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import {
	getComponentConfig,
	PROPS_TYPES,
	PropInfoType,
	useSelector,
	changeProps,
	PageConfigType, SelectedInfoType, STATE_PROPS,
} from '@brickd/canvas';
import {get,isEmpty} from 'lodash';
import { VirtualDOMType } from '@brickd/utils';
import styles from './index.less';
import PropItem from './PropItem';
import NForm from '../../../Components/NForm';
import { splitPropsConfig } from '../../../utils';




const  controlUpdate= (prevState: any, nextState: any)=>{
	const {selectedInfo,pageConfig}=prevState;
	const {selectedKey}=selectedInfo||{};
	const props= get(pageConfig,`${selectedKey}.props`);
	return nextState.selectedInfo!==selectedInfo||props!==get(nextState.pageConfig,`${selectedKey}.props`);
};
type PropsType={
	isCommon?:boolean
}

type PropsHookState = {
	pageConfig: PageConfigType;
	selectedInfo:SelectedInfoType

};


function Props({isCommon}:PropsType){
	const {selectedInfo,pageConfig}=useSelector<PropsHookState,STATE_PROPS>(['selectedInfo','pageConfig'],controlUpdate);
	const {selectedKey}=selectedInfo||{};
	const {componentName,props,childNodes}=get(pageConfig,selectedKey,{}) as VirtualDOMType;
	const nFormRef=useRef<any>();
	const {propsConfig}=getComponentConfig(componentName);
	const {firstConfig,secondConfig }=useMemo(()=>splitPropsConfig(propsConfig,childNodes),[propsConfig,childNodes]);
	const formConfig=isCommon?firstConfig:secondConfig;
	useEffect(()=>{
		if(nFormRef.current&&props){
			nFormRef.current.setFieldsValue(props);
		}
	},[props]);
	const renderFormItem=useCallback((config:PropInfoType,key?:string,isExpression?:boolean,menu?:string)=>{
		const {type}=config;
		const menus=Array.isArray(type)&&type;
		const subStyle:React.CSSProperties={justifyContent:'flex-end',height:22};
		let style:React.CSSProperties={flexDirection:'column',alignItems:'flex-start'};
		const borderStyle:React.CSSProperties={flexDirection:'column', alignItems:'flex-start', };
		const renderComponent=<PropItem config={config} isExpression={isExpression} menu={menu}/>;
		let headerStyle:React.CSSProperties={};
		if(isExpression) return {style,renderComponent};
		if(!Array.isArray(type)){
			switch (type) {
				case PROPS_TYPES.boolean:
				case PROPS_TYPES.number:
					style=subStyle;
					headerStyle={overflow:'hidden',marginRight:10};
					break;
				case PROPS_TYPES.object:
				case PROPS_TYPES.objectArray:
					style=borderStyle;
					headerStyle={marginBottom:5};
					break;
				default:
					// headerStyle={marginBottom:5};
			}
		}else {
			style=borderStyle;
		}


		return{style,renderComponent,menus,headerStyle};
	},[]);

	const onValuesChange=(changedValues, values)=>{
		changeProps({isMerge:true,props:values});
	};

	if(!componentName|| isEmpty(formConfig)){
		let tip='请选中任意组件进行属性操作';
		if(componentName&&isEmpty(formConfig)){
			tip='该组件暂未有可操作的属性';
		}
		return <div className={styles['empty']}>{tip}</div>;
	}
	return <NForm className={styles['container']}
								renderFormItem={renderFormItem}
								onValuesChange={onValuesChange}
								ref={nFormRef}
								formConfig={formConfig} />;
}

export default memo(Props);

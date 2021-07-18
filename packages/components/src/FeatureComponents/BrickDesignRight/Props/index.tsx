import React, { memo, useCallback, useMemo } from 'react';
import { getComponentConfig, getSelector, PROPS_TYPES, PropsConfigType,PropInfoType, useSelector } from '@brickd/canvas';
import { each, get,isEmpty} from 'lodash';
import styles from './index.less';
import PropItem from './PropItem';
import NForm from '../../../Components/NForm';

const handlePropsConfig=(propsConfig:PropsConfigType)=>{
	const firstConfig={};
	const secondConfig={};
	each(propsConfig,(config,key)=>{
		const {type}=config;
		switch (type){
			case PROPS_TYPES.boolean:
			case PROPS_TYPES.number:
			case PROPS_TYPES.style:
				firstConfig[key]=config;
				break;
			case PROPS_TYPES.function:
			case PROPS_TYPES.cssClass:
				break;
			default:
				secondConfig[key]=config;
		}
	});

	return {...firstConfig,...secondConfig};
};


function Props(){
	const {selectedInfo}=useSelector(['selectedInfo']);
	const {pageConfig}=getSelector(['pageConfig']);
	const {selectedKey}=selectedInfo||{};
	const {componentName,props}=get(pageConfig,selectedKey,{});
	const {propsConfig}=getComponentConfig(componentName);
	const formConfig=useMemo(()=>handlePropsConfig(propsConfig),[propsConfig]);

	const renderFormItem=useCallback((config:PropInfoType,key?:string,isExpression?:boolean,menu?:string)=>{
		const {type}=config;
		const menus=Array.isArray(type)&&type;
		const borderColor='#f2f2f2';
		const subStyle:React.CSSProperties={justifyContent:'flex-end',height:22};
		let style:React.CSSProperties={flexDirection:'column',alignItems:'flex-start'};
		const borderStyle:React.CSSProperties={flexDirection:'column',
			alignItems:'flex-start',
			borderTop:`1px ${borderColor} solid`,
		};
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
					break;
			}
		}else {
			style=borderStyle;
		}


		return{style,renderComponent,menus,headerStyle};
	},[]);
	if(isEmpty(formConfig)) return <div className={styles['empty']}>
		请选中任意组件进行属性操作
	</div>;
	return <NForm className={styles['container']} renderFormItem={renderFormItem} initialValues={props} formConfig={formConfig} />;
}

export default memo(Props);

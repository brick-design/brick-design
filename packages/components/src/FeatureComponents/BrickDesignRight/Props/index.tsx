import React, { memo, useCallback, useMemo } from 'react';
import { getComponentConfig, getSelector, PROPS_TYPES, PropsConfigType, useSelector } from '@brickd/canvas';
import { each, get} from 'lodash';
import { PropInfoType } from '@brickd/core';
import Switch from 'rc-switch';
import styles from './index.less';
import NForm from '../../../Components/NForm';
import { Input, InputNumber } from '../../../Components';
import { CommonArray,  ObjectArray, ObjectValue } from '../../../PropComponents';

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

	const renderFormItem=useCallback((config:PropInfoType)=>{
		const {type}=config;
		// const propsKeys=keys(formConfig);
		// const isDouble=propsKeys.indexOf(key)%2>0;
		const subStyle:React.CSSProperties={justifyContent:'space-between',height:22};
		let renderComponent,style:React.CSSProperties={flexDirection:'column',alignItems:'flex-start'};
		switch (type) {
			case PROPS_TYPES.boolean:
				renderComponent=<Switch className={styles['switch']}/>;
				style=subStyle;
				break;
			case PROPS_TYPES.number:
				renderComponent=<InputNumber/>;
				style=subStyle;
				break;
			case PROPS_TYPES.string:
				renderComponent=<Input className={styles['input-container']}
															 closeStyle={{width:10,height:10 }}
															 focusClass={styles['focus-class']}
				/>;
				break;
			case PROPS_TYPES.stringArray:
				renderComponent=<CommonArray/>;
				break;
			case PROPS_TYPES.numberArray:
				renderComponent=<CommonArray isNumber/>;
				break;
			case PROPS_TYPES.enum:
				renderComponent=<div/>;
				break;
			case PROPS_TYPES.object:
				renderComponent=<ObjectValue/>;
				break;
			case PROPS_TYPES.objectArray:
				renderComponent=<ObjectArray/>;
				break;
			default:
				renderComponent=<div/>;
				style=subStyle;
		}

		return{style,renderComponent};
	},[formConfig]);

	return <NForm className={styles['container']} renderFormItem={renderFormItem} initialValues={props} formConfig={formConfig} />;
}

export default memo(Props);

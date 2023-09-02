import React, { memo, useCallback, useEffect, useRef } from 'react';
import {
	PROPS_TYPES,
	PropInfoType,
} from '@brickd/canvas';
import styles from './index.less';
import PropItem from './PropItem';
import NForm, { NFormProps } from '../../Components/NForm';
import { usePrevious } from '../../utils';

interface PropsType extends NFormProps{
	defaultFormData?:any
	tip?:string
	lockKey?:string
}

function ScaffoldForm(props:PropsType){
	const nFormRef=useRef<any>();
	const {defaultFormData,onValuesChange,tip,formConfig,lockKey}=props;
	const prevLockKey= usePrevious(lockKey);
	if(prevLockKey!==lockKey&&nFormRef.current){
		nFormRef.current.resetFields();
	}
	useEffect(()=>{
		if(nFormRef.current&&defaultFormData){
			nFormRef.current.setFieldsValue(defaultFormData);
		}
	},[defaultFormData]);

	const renderFormItem=useCallback((config:PropInfoType,key?:string,isExpression?:boolean,menu?:string)=>{
		const {type}=config;
		const menus=Array.isArray(type)&&type;
		const subStyle:React.CSSProperties={justifyContent:'flex-end',height:32};
		let style:React.CSSProperties={flexDirection:'column',alignItems:'flex-start'};
		const borderStyle:React.CSSProperties={flexDirection:'column', alignItems:'flex-start' };
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
				case PROPS_TYPES.enum:
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


	const onChange=(changedValues: any, values: any)=>{
			onValuesChange&&onValuesChange(changedValues,values);
	};

	return tip?<div className={styles['empty']}>{tip}</div>:<NForm
		className={styles['container']}
								renderFormItem={renderFormItem}
								onValuesChange={onChange}
								ref={nFormRef}
								formConfig={formConfig} />;
}

export default memo(ScaffoldForm);

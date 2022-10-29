import React, { memo, useCallback, useEffect, useRef } from 'react';
import {  PROPS_TYPES,PropInfoType, useSelector,changeProps } from '@brickd/canvas';
import {  get} from 'lodash';
import styles from './index.less';
import SeniorItem from './SeniorItem';
import { seniorConfigs } from './seniorConfigs';
import NForm from '../../../Components/NForm';

const  controlUpdate= (prevState: any, nextState: any)=>{
	const {selectedInfo,pageConfig}=prevState;
	const {selectedKey}=selectedInfo||{};
	return nextState.selectedInfo!==selectedInfo||pageConfig[selectedKey]!==nextState.pageConfig[selectedKey];
};
function Senior(){
	const {selectedInfo,pageConfig}=useSelector(['selectedInfo','pageConfig'],controlUpdate);
	const {selectedKey}=selectedInfo||{};
	const {componentName,props,...rest}=get(pageConfig,selectedKey,{});
	const nFormRef=useRef<any>();

	useEffect(()=>{
		if(nFormRef.current&&rest){
			nFormRef.current.setFieldsValue(rest);
		}
	},[rest]);

	const renderFormItem=useCallback((config:PropInfoType,key?:string,isExpression?:boolean,menu?:string)=>{
		const {type}=config;
		const menus=Array.isArray(type)&&type;
		const subStyle:React.CSSProperties={justifyContent:'flex-end',height:22};
		let style:React.CSSProperties={flexDirection:'column',alignItems:'flex-start'};
		const borderStyle:React.CSSProperties={flexDirection:'column',
			alignItems:'flex-start',
			};
		const renderComponent=<SeniorItem config={config} isExpression={isExpression} menu={menu}/>;
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

	const onValuesChange=(changedValues, values)=>{
		changeProps({isMerge:true,props:values});
	};
	if(!componentName) return <div className={styles['empty']}>
		请选中任意组件进行属性操作
	</div>;
	return <NForm className={styles['container']}
								renderFormItem={renderFormItem}
								onValuesChange={onValuesChange}
								ref={nFormRef}
								formConfig={seniorConfigs} />;
}

export default memo(Senior);

import React, { useCallback,memo } from 'react';
import { PropInfoType, PROPS_TYPES } from '@brickd/canvas';
import PropItem from './PropItem';
import styles from './index.less';
import {NForm } from '../../Components';

interface ObjectValueProps{
	value?:any
	onChange?:(v:any)=>void
	childPropsConfig?:any
}

function ObjectValue(props:ObjectValueProps){
	const {childPropsConfig}=props;
	const renderFormItem=useCallback((config:PropInfoType)=>{
		const {type}=config;
		const subStyle:React.CSSProperties={justifyContent:'space-between',height:22,paddingRight:0};
		let style:React.CSSProperties={flexDirection:'column',alignItems:'flex-start',paddingRight:0};
		const renderComponent=<PropItem config={config}/>;
		if(!Array.isArray(type)){
			switch (type) {
				case PROPS_TYPES.boolean:
					style=subStyle;
					break;
				case PROPS_TYPES.number:
					style=subStyle;
					break;
			}
		}


		return{style,renderComponent,isHidden:true};
	},[]);


	return <NForm
		className={styles['container']}
		formConfig={childPropsConfig}
		renderFormItem={renderFormItem}
	/>;
}

export default memo(ObjectValue);

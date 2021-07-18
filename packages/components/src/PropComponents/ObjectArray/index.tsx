import React, { memo, useState, useRef } from 'react';
import { PropsConfigType } from '@brickd/canvas';
import {each} from 'lodash';
import styles from './index.less';
import SortableTags from '../../Components/SortableTags';
import  ObjectValue  from '../ObjectValue';


interface ObjectArrayProp{
	value?:any
	onChange?:(v:any)=>void
	childPropsConfig?:PropsConfigType[]
}

const handleConfig=(childPropsConfig:PropsConfigType[])=>{
	const propsConfigs={};
	each(propsConfigs,(config,index)=>{
		propsConfigs[index]=config;
	});
	return propsConfigs;
};


function ObjectArray(props:ObjectArrayProp){
	const {childPropsConfig}=props;
	const childPropsConfigRef= useRef(handleConfig(childPropsConfig)).current;
	const [sortData,setSortData]=useState([]);
	const [key,setKey]=useState<string>();

	const onTagClick=(key:string)=>{
		setKey(key);
		// childPropsConfigRef.current.find((item)=>item.id===key);
		// setConfig(key);
	};

	const  addItem=()=>{
		setSortData([]);
	};

	return <div className={styles['container']}>
		<SortableTags
			sortData={sortData}
			extra={<div onClick={addItem} className={styles['add']}>+</div>}
			onTagClick={onTagClick}
		/>
			<ObjectValue childPropsConfig={childPropsConfigRef[key]}/>
	</div>;
}

export default memo(ObjectArray);

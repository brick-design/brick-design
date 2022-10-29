import React, { useRef, useState } from 'react';
import {map,get} from 'lodash';
import styles from './index.less';

interface SelectTreeProps{
	data:any;
	onChange:(v:string)=>void;
}
export default function SelectTree(props:SelectTreeProps){
	const {data={},onChange}=props;
	const selectKeys=useRef([]);
	const [keys,setKeys]=useState([Object.keys(data)]);
	const onSelect=(k,index)=>{
		selectKeys.current[index]=k;
		console.log('onSelect>>>>>>>>>',selectKeys.current);

		// selectKeys.current.splice(index);
		const  path=[...selectKeys.current].join('.');
		onChange&&onChange(path);
		console.log('nextData1>>>>>>',data,path,selectKeys.current);

		const nextData=get(data,path);
		const newKeys=[...keys];
		if(typeof nextData==='object'){
			newKeys[index+1]=Object.keys(nextData);
			console.log('nextData3>>>>>>',newKeys);

			// newKeys.splice(index+1);
			console.log('nextData2>>>>>>',newKeys);

			setKeys(newKeys);
		}

	};
	return <div  className={styles['select-container']}>
		{map(keys,(ks,index)=>{
			return <div className={styles['item-container']}>
				{map(ks,(k)=><div className={styles['item']} onClick={()=>onSelect(k,index)}>{k}</div>)}
			</div>;
		})}
	</div>;
}

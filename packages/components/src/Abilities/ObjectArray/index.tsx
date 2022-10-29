import React, { memo, useState } from 'react';
import { PropsConfigType } from '@brickd/canvas';
import { map} from 'lodash';
import styles from './index.less';
import SortableTags from '../../Components/SortableTags';

import ObjectValue from '../ObjectValue';

interface ObjectArrayProp {
  value?: any[];
  onChange?: (v: any) => void;
  childPropsConfig?: PropsConfigType;
}


function ObjectArray(props: ObjectArrayProp) {
  const { childPropsConfig,value,onChange } = props;
  const [sortData, setSortData] = useState([]);
  // const [key, setKey] = useState<string>();

  const onTagClick = (key: string) => {
    // setKey(key);
    // childPropsConfigRef.current.find((item)=>item.id===key);
    // setConfig(key);
  };

  const addItem = () => {
    setSortData([]);
  };

  let newValue=value;
  if(!value){
    newValue=[{}];
  }

 const onChangeData=(v:any,index:number)=>{
    onChange&&onChange([v]);
 };

  return (
    <div className={styles['container']}>
      <SortableTags
        sortData={sortData}
        extra={
          <div onClick={addItem} className={styles['add']}>
            +
          </div>
        }
        onTagClick={onTagClick}
      />
      <div className={styles['content-wrapper']}>
        {map(newValue,(v,index)=><ObjectValue value={v} onChange={(v)=>onChangeData(v,index)} childPropsConfig={childPropsConfig} key={index} />
        )}
      </div>
    </div>
  );
}

export default memo(ObjectArray);

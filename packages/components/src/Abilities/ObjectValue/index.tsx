import React,{memo} from 'react';
import { PROPS_TYPES, PropsConfigType } from '@brickd/canvas';
import { each, isEmpty } from 'lodash';
import styles from './index.less';
import { CodeEditor } from '../../Components';
import { ScaffoldForm } from '../index';

interface ObjectValueProps {
  value?: any;
  onChange?: (v: any) => void;
  childPropsConfig?: PropsConfigType;
}


const handleValue=(value:any,childPropsConfig:PropsConfigType)=>{
  const newChildPropsConfig={...childPropsConfig};
  each(value,(v,k)=>{
    if(!newChildPropsConfig[k]){
      switch (typeof v) {
        case 'string':
          newChildPropsConfig[k]={type:PROPS_TYPES.string};
          break;
        case 'number':
          newChildPropsConfig[k]={type:PROPS_TYPES.number};
          break;
        case 'boolean':
          newChildPropsConfig[k]={type:PROPS_TYPES.boolean};
          break;
        case 'object':
          if(Array.isArray(v)){
            let type=null;
            for (const childV of v){
              const childType=typeof childV;
              if(childType==='string'&&(!type||type===PROPS_TYPES.stringArray)){
                type=PROPS_TYPES.stringArray;
              }else if(childType==='number'&&(!type||type===PROPS_TYPES.numberArray)){
                type=PROPS_TYPES.numberArray;
              }else {
                type=PROPS_TYPES.object;
                break;
              }
            }
            newChildPropsConfig[k]={type};
          }else {
            newChildPropsConfig[k]={type:PROPS_TYPES.object};
          }
      }
    }
  });

  return newChildPropsConfig;
};

function ObjectValue(props: ObjectValueProps) {
  const { childPropsConfig,value,onChange,...rest } = props;
  const onValuesChange=(changedValues, values)=>{
    onChange&&onChange(values);
  };

  if(!childPropsConfig||isEmpty(childPropsConfig)){
    return  <CodeEditor value={value} onChange={onChange} {...rest}/>;
  }
  return (<ScaffoldForm
      defaultFormData={value}
      className={styles['container']}
      formConfig={handleValue(value,childPropsConfig)}
      onValuesChange={onValuesChange}
    />
  );
}

export default memo(ObjectValue);

import React, { memo, useCallback, useEffect, useRef } from 'react';
import { PropInfoType, PROPS_TYPES, PropsConfigType } from '@brickd/canvas';
import { each, isEqual,isEmpty } from 'lodash';
import PropItem from './PropItem';
import styles from './index.less';
import { CodeEditor, NForm } from '../../Components';
import { usePrevious } from '../../utils';

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
  const { childPropsConfig,value,onChange } = props;
  const nFormRef=useRef<any>();
  const prevValue= usePrevious(value);
  useEffect(()=>{
    nFormRef.current&&nFormRef.current.setFieldsValue(value);
  },[isEqual(prevValue,value)]);

  const renderFormItem = useCallback((config: PropInfoType) => {
    const { type } = config;
    const subStyle: React.CSSProperties = {
      justifyContent: 'space-between',
      height: 22,
      paddingRight: 0,
    };

    let style: React.CSSProperties = {
      flexDirection: 'column',
      alignItems: 'flex-start',
      paddingRight: 0,
    };

    const renderComponent = <PropItem config={config} />;
    if (!Array.isArray(type)) {
      switch (type) {
        case PROPS_TYPES.boolean:
          style = subStyle;
          break;
        case PROPS_TYPES.number:
          style = subStyle;
          break;
      }
    }

    return { style, renderComponent, isHidden: true };
  }, []);

  const onValuesChange=(changedValues, values)=>{
    onChange&&onChange(values);
  };
  if(!childPropsConfig||isEmpty(childPropsConfig)){
    return  <CodeEditor/>;
  }
  return (
    <NForm
      ref={nFormRef}
      className={styles['container']}
      formConfig={handleValue(value,childPropsConfig)}
      renderFormItem={renderFormItem}
      onValuesChange={onValuesChange}
    />
  );
}

export default memo(ObjectValue);

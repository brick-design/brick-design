import React, { Component, forwardRef, memo, useEffect, useState } from 'react';
import { Input } from 'antd';
import isObject from 'lodash/isObject'
import debounce from 'lodash/debounce'
import { propsAreEqual, usePrevious } from '@/utils';
const { TextArea } = Input;

interface JsonTextAreaPropsType {
  value?:any,
  onChange:(value:any)=>void
}
function JsonTextArea(props:JsonTextAreaPropsType,ref:any) {
  const {onChange,value}=props
  const [json,setJson]=useState()
  useEffect(()=>{
    try {
      let strObj;
      eval(`strObj=${json}`)
      if(isObject(strObj)){
        onChange && onChange(strObj);
      }

    } catch (e) {}
  },[json,onChange])

  useEffect(()=>{
    const jsonStr=JSON.stringify(value,null,2)
    setJson(jsonStr)
  },[value])

    return (
      <TextArea ref={ref} value={json} onChange={(e)=>setJson(e.target.value)}/>
    );
}

export default memo(forwardRef(JsonTextArea), propsAreEqual);

import React, { forwardRef, memo, useEffect, useState } from 'react';
import { Input } from 'antd';
import isObject from 'lodash/isObject';
import isEqual from 'lodash/isEqual';
import { propsAreEqual } from '../utils';

const { TextArea } = Input;

interface JsonTextAreaPropsType {
  value?: any;
  onChange: (value: any) => void;
}

function JsonTextArea(props: JsonTextAreaPropsType, ref: any) {
  const { onChange, value } = props;
  const [json, setJson] = useState<string>();
  useEffect(() => {
    try {
      let strObj;
      eval(`strObj=${json}`);
      if (isObject(strObj) && !isEqual(value, strObj)) {
        onChange && onChange(strObj);
      }
    } catch (e) {
      console.error(e);
    }
  }, [json, onChange]);

  useEffect(() => {
    const jsonStr = JSON.stringify(value, null, 2);
    setJson(jsonStr);
  }, [value]);

  return (
    <TextArea
      ref={ref}
      value={json}
      onChange={(e) => setJson(e.target.value)}
    />
  );
}

export default memo(forwardRef(JsonTextArea), propsAreEqual);

import React, { memo, useRef } from 'react';
import { PropInfoType } from '@brickd/core';
import styles from './index.less';

interface InputNumberProps extends React.HTMLProps<HTMLInputElement>{
  config?:PropInfoType
};

function InputNumber(props: InputNumberProps) {
  const { className,config,value,onChange, ...rest } = props;
  const {unit}=config||{};
  const inputNumberRef = useRef<HTMLInputElement>();
  let newValue=value;
  if(typeof value==='string'&&unit){
    newValue=Number(unit.replace(unit,''));
  }

  const onChangeValue=(event:any)=>{
    let value=event.target.value;
    if(unit){
      value=value+unit;
    }
    onChange&&onChange(value);
  };
  const add = () => {
    inputNumberRef.current.stepUp(1);
  };
  const minus = () => {
    inputNumberRef.current.stepDown(1);
  };
  return (
    <div className={`${styles['container']} ${className}`}>
      <span onClick={minus} className={styles['icon']}>
        -
      </span>
      <input
        ref={inputNumberRef}
        className={styles['input-number']}
        defaultValue={0}
        type={'number'}
        value={newValue}
        onChange={onChangeValue}
        {...rest}
      />
      {!!unit&&<span className={styles['unit']}>{unit}</span>}

      <span onClick={add} className={styles['icon']}>
        +
      </span>
    </div>
  );
}

export default memo(InputNumber);

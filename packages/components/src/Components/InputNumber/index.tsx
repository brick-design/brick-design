import React, { memo, useRef } from 'react';
import styles from './index.less';

type InputNumberProps = React.HTMLProps<HTMLInputElement>;

function InputNumber(props: InputNumberProps) {
  const { className, ...rest } = props;
  const inputNumberRef = useRef<HTMLInputElement>();
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
        {...rest}
      />
      <span onClick={add} className={styles['icon']}>
        +
      </span>
    </div>
  );
}

export default memo(InputNumber);

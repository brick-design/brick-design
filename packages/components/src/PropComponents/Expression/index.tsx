import React, { memo } from 'react';
import styles from './index.less';
import { Input } from '../../Components';

interface ExpressionProps {
  onChange?: (s: string) => void;
  value?: string;
}
function Expression(props: ExpressionProps) {
  const { onChange, value } = props;
  // const rex=/^(\${).+(})$/;
  const onInputChange = (v) => {
    onChange && onChange(v ? `\${${v}}` : undefined);
  };
  let  newValue = '';
  if(value){
    newValue=value.replace('${','');
    newValue=newValue.replace('}','');
  }
  return (
    <Input
      onChange={onInputChange}
      value={newValue}
      placeholder={'请输入js表达式'}
      closeAble={false}
      addonBefore={<span>{'{{'}</span>}
      addonAfter={<span>{'}}'}</span>}
      className={styles['input-container']}
      focusClass={styles['focus-class']}
      inputClass={styles['inputClass']}
    />
  );
}

export default memo(Expression);

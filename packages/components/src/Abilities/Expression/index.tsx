import React, { memo } from 'react';
// import { useOperate } from '@brickd/canvas';
import styles from './index.less';
import SelectTree from './SelectTree';
import { Input } from '../../Components';
import { expressionRex } from '../../utils';

interface ExpressionProps {
  onChange?: (s: string) => void;
  value?: string;
}
function Expression(props: ExpressionProps) {
  const { onChange, value } = props;
  // const {getOperateState}=useOperate();
  // const {pageState}=getOperateState();
  // const rex=/^(\${).+(})$/;
  const onInputChange = (v) => {
    onChange && onChange(v ? `\${${v}}` : undefined);
  };
  let  newValue = '';
  if(expressionRex.test(value)){
    newValue=value.replace('${','');
    newValue=newValue.replace('}','');
  }

  const onSelectTreeChange=(path:string)=>{

  };
  return (
    <div className={styles['container']}>
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
      type={'text'}
    />
      <SelectTree data={{1:{2:5},3:{6:7} }} onChange={onSelectTreeChange}/>
    </div>
  );
}

export default memo(Expression);

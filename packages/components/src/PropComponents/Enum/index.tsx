import React, { forwardRef, memo } from 'react';
import styles from '../../index.less';
import { propsAreEqual } from '../../utils';
import { Select,Radio } from '../../Components';

interface EnumComponentPropsType  {
  enumData?: string[];
  onChange?: (value: any) => void;
}

const Enum = forwardRef(function Component(
  props: EnumComponentPropsType,
  ref: any,
) {
  const { enumData, ...rest } = props;
  if(enumData.length>4){
    return (
      <Select
        ref={ref}
        style={{ width: '100%', height: 24 }}
        className={styles.select}
        {...rest}
      />
    );
  }
  return  <Radio.RadioGroup
    radioData={enumData}
    {...rest}
  />;

});

export default memo<EnumComponentPropsType>(Enum, propsAreEqual);

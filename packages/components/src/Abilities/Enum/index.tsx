import React, { forwardRef, memo } from 'react';
import styles from './index.less';
import { propsAreEqual } from '../../utils';
import { Select, Radio } from '../../Components';

interface EnumComponentPropsType {
  enumData?: string[];
  onChange?: (value: any) => void;
}

const Enum = forwardRef(function Component(props: EnumComponentPropsType) {
  const { enumData, ...rest } = props;
  if (enumData.length > 3) {
    return (
      <Select className={styles['select']} enumData={enumData} {...rest} />
    );
  }
  return <Radio radioData={enumData}  {...rest} />;
});

export default memo<EnumComponentPropsType>(Enum, propsAreEqual);

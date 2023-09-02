import React, { memo } from 'react';
import { PropInfoType, PROPS_TYPES } from '@brickd/canvas';
import Switch from 'rc-switch';
import styles from './index.less';
import  CommonArray  from '../CommonArray';
import { CodeEditor, Input, InputNumber } from '../../Components';

interface PropItem {
  config?: PropInfoType;
  [key: string]: any;
}
function PropItem(props: PropItem) {
  const { config, ...rest } = props;
  const { type } = config || {};
  let renderComponent = null;
  switch (type) {
    case PROPS_TYPES.boolean:
      renderComponent = <Switch {...rest} className={styles['switch']} />;
      break;
    case PROPS_TYPES.number:
      renderComponent = <InputNumber {...rest} />;
      break;
    case PROPS_TYPES.string:
      renderComponent = (
        <Input
          className={styles['input-container']}
          closeStyle={{ width: 10, height: 10 }}
          focusClass={styles['focus-class']}
          {...rest}
        />
      );
      break;
    case PROPS_TYPES.stringArray:
      renderComponent = <CommonArray {...rest} />;
      break;
    case PROPS_TYPES.numberArray:
      renderComponent = <CommonArray isNumber {...rest} />;
      break;
    case PROPS_TYPES.objectArray:
    case PROPS_TYPES.object:
      renderComponent = <CodeEditor />;
      break;
  }

  return renderComponent;
}

export default memo(PropItem);

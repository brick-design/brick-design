import React, { memo } from 'react';
import { PropInfoType, PROPS_TYPES } from '@brickd/canvas';
import Switch from 'rc-switch';
import styles from './index.less';
import { getValueType } from '../../../utils';
import { Input, InputNumber } from '../../../Components';
import {
  CommonArray,
  Enum,
  Expression,
  ObjectArray,
  ObjectValue,
} from '../../../PropComponents';

interface PropItem {
  isExpression?: boolean;
  menu?: string;
  config?: PropInfoType;
  [key: string]: any;
}
function PropItem(props: PropItem) {
  const { isExpression, menu, config, ...rest } = props;
  const { value } = props;
  const { enumData, type, childPropsConfig } = config || {};
  let switchCase = menu || type;
  if (Array.isArray(type) && !menu) {
    if (value) {
      switchCase = getValueType(value);
    } else {
      switchCase = type[0];
    }
  }
  let renderComponent = <Expression {...rest} />;
  if (isExpression) return renderComponent;
  switch (switchCase) {
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
    case PROPS_TYPES.enum:
      renderComponent = <Enum enumData={enumData} {...rest} />;
      break;
    case PROPS_TYPES.object:
      renderComponent = (
        <ObjectValue childPropsConfig={childPropsConfig} {...rest} />
      );
      break;
    case PROPS_TYPES.objectArray:
      renderComponent = (
        <ObjectArray childPropsConfig={childPropsConfig as any[]} {...rest} />
      );
      break;
    default:
      renderComponent = <div />;
  }

  return renderComponent;
}
export default memo(PropItem);

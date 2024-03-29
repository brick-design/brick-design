import React, { memo, useEffect } from 'react';
import { PropInfoType, PROPS_TYPES } from '@brickd/canvas';
import Switch from 'rc-switch';
import styles from './index.less';
import { expressionRex, getValueType } from '../../utils';
import { CodeEditor,  InputNumber, Textarea } from '../../Components';
import {
  CommonArray,
  Enum,
  Expression,
  // ObjectArray,
  ObjectValue,
} from '../index';

interface PropItem {
  isExpression?: boolean;
  menu?: string;
  config?: PropInfoType;
  [key: string]: any;
}
function PropItem(props: PropItem) {
  const { isExpression, menu, config,setIsExpression,name, ...rest } = props;
  const { enumData, type, childPropsConfig } = config || {};
  let switchCase = menu || type;
  const {value}=props;

  useEffect(()=>{
    if(expressionRex.test(value)){
      setIsExpression(true);
    }
  },[setIsExpression,value]);

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
      renderComponent = <Switch {...rest} checked={value}  className={styles['switch']} />;
      break;
    case PROPS_TYPES.number:
      renderComponent = <InputNumber config={config} {...rest} />;
      break;
    case PROPS_TYPES.string:
      renderComponent = (
        <Textarea
          className={styles['input-container']}
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
    // case PROPS_TYPES.objectArray:
    //   renderComponent = (
    //     <ObjectArray childPropsConfig={childPropsConfig} {...rest} />
    //   );
    //   break;
    default:
      renderComponent = <CodeEditor name={name} {...rest}/>;
  }

  return renderComponent;
}
export default memo(PropItem);

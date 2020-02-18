import { Form, InputNumber, Modal, Switch } from 'antd';
import each from 'lodash/each';
import get from 'lodash/get';
import {
  Animate,
  FunctionComponent,
  JsonTextArea,
  NumberArray,
  ObjectArrayComponent,
  ObjectComponent,
  StringArray,
} from '../components';
import { EnumComponent, StringComponent } from '../../components';
import { PROPS_TYPES } from '@/types/ConfigTypes';

/**
 * 默认属性
 * @type {{className: {label: string, type: string}, animateClass: {label: string, type: string}}}
 */
export const DEFAULT_PROPS = {
  className: { label: '类名', type: PROPS_TYPES.stringArray },
  animateClass: { label: '动画', type: PROPS_TYPES.animate },
};

/**
 * 类型映射组件
 */
export const TYPES_TO_COMPONENT = {
  object: ObjectComponent,
  objectArray: ObjectArrayComponent,
  string: StringComponent,
  function: FunctionComponent,
  number: InputNumber,
  numberArray: NumberArray,
  stringArray: StringArray,
  enum: EnumComponent,
  json: JsonTextArea,
  boolean: Switch,
  animate: Animate,

};


export const confirmModal = (fnBsn:()=>void) =>
  Modal.confirm({
    title: '你确定要删除此项吗?',
    onOk() {
      fnBsn();
    },
  });





import { InputNumber, Modal, Switch } from 'antd';
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
  [PROPS_TYPES.object]: ObjectComponent,
  [PROPS_TYPES.objectArray]: ObjectArrayComponent,
  [PROPS_TYPES.string]: StringComponent,
  [PROPS_TYPES.function]: FunctionComponent,
  [PROPS_TYPES.number]: InputNumber,
  [PROPS_TYPES.numberArray]: NumberArray,
  [PROPS_TYPES.stringArray]: StringArray,
  [PROPS_TYPES.enum]: EnumComponent,
  [PROPS_TYPES.json]: JsonTextArea,
  [PROPS_TYPES.boolean]: Switch,
  [PROPS_TYPES.animate]: Animate,

};


export const confirmModal = (fnBsn: () => void) =>
  Modal.confirm({
    title: '你确定要删除此项吗?',
    onOk() {
      fnBsn();
    },
  });





import { PROPS_TYPES } from '@brickd/react';
import { InputNumber, Switch } from 'antd';
import {
  EnumComponent,
  FunctionComponent,
  JsonTextArea,
  NumberArray,
  ObjectArrayComponent,
  ObjectComponent,
  StringArray,
  StringComponent,
} from './PropComponents';

export * from './ToolComponents/BrickDesignLeft/BrickPreview/CategoryTypes';
export { default as BrickPreview } from './ToolComponents/BrickDesignLeft/BrickPreview';
export {default as BrickDesign} from './BrickDeign';
export {default as BrickDesignLeft} from './ToolComponents/BrickDesignLeft';
export * from './PropComponents';

export const TYPES_TO_COMPONENT: any = {
  [PROPS_TYPES.object]: ObjectComponent,
  [PROPS_TYPES.objectArray]: ObjectArrayComponent,
  [PROPS_TYPES.string]: StringComponent,
  [PROPS_TYPES.function]: FunctionComponent,
  [PROPS_TYPES.numberArray]: NumberArray,
  [PROPS_TYPES.stringArray]: StringArray,
  [PROPS_TYPES.enum]: EnumComponent,
  [PROPS_TYPES.json]: JsonTextArea,
  [PROPS_TYPES.boolean]: Switch,
  [PROPS_TYPES.number]: InputNumber,
};

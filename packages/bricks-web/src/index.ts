import {PROPS_TYPES} from 'brickd-core'
import {Switch,InputNumber} from 'antd'
import {
  ObjectComponent,
  ObjectArrayComponent,
  StringComponent,
  FunctionComponent,
  NumberArray,
  StringArray,
  EnumComponent,
  JsonTextArea,
} from './PropComponent';
export * from './BrickTree'
export {default as BrickPreview} from './BrickPreview'
export * from './PropComponent'


export const TYPES_TO_COMPONENT:any={
  [PROPS_TYPES.object]: ObjectComponent,
  [PROPS_TYPES.objectArray]: ObjectArrayComponent,
  [PROPS_TYPES.string]: StringComponent,
  [PROPS_TYPES.function]: FunctionComponent,
  [PROPS_TYPES.numberArray]: NumberArray,
  [PROPS_TYPES.stringArray]: StringArray,
  [PROPS_TYPES.enum]: EnumComponent,
  [PROPS_TYPES.json]: JsonTextArea,
  [PROPS_TYPES.boolean]: Switch,
  [PROPS_TYPES.number]:InputNumber
}

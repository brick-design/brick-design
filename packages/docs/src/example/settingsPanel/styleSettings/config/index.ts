import { EnumComponent, NumberComponent, StringComponent } from '../../components';

/**
 * 样式类型定义
 */
export enum CSS_TYPE {
  string = 'string',
  enum = 'enum',
  number = 'number',
};


export const CSS_TYPE_TO_COMPONENT:any = {
  [CSS_TYPE.enum]: EnumComponent,
  [CSS_TYPE.number]: NumberComponent,
  [CSS_TYPE.string]: StringComponent,
};




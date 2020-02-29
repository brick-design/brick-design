import { EnumComponent, NumberComponent, StringComponent } from '../../components';
import { CSS_TYPE } from '@/types/ConfigTypes';

export const CSS_TYPE_TO_COMPONENT = {
  [CSS_TYPE.enum]: EnumComponent,
  [CSS_TYPE.number]: NumberComponent,
  [CSS_TYPE.string]: StringComponent,
};




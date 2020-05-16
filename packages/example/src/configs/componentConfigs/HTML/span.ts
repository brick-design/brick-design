import { PROPS_TYPES } from '@/types/ConfigTypes';
import { ComponentConfigType } from '@/types/ComponentConfigType';

const span: ComponentConfigType = {
  propsConfig: {
    children: {
      label: '文本内容',
      type: PROPS_TYPES.string,
    },
  },
};

export default span;

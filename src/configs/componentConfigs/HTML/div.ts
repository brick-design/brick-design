import { ComponentConfigType } from '@/types/ComponentConfigType';
import { PROPS_TYPES } from '@/types/ConfigTypes';

const div:ComponentConfigType={
  propsConfig: {
    children: {
      label: '文本内容',
      type: PROPS_TYPES.string,
    },
  },
};

export default div

import { ComponentConfigType } from '@/types/ComponentConfigType';
import { PROPS_TYPES } from '@/types/ConfigTypes';

const Tag: ComponentConfigType = {
  propsConfig: {
    color: {
      label: '标签色',
      type: PROPS_TYPES.string,
    },
  },
};

export default Tag;

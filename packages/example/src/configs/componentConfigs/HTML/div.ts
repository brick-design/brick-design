import { ComponentConfigTypes } from 'brickd-core';
import { PROPS_TYPES } from 'brickd-core';

const div: ComponentConfigTypes = {
  propsConfig: {
    children: {
      label: '文本内容',
      type: PROPS_TYPES.string,
    },
  },
};

export default div;

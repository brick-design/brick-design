import { PROPS_TYPES } from 'brickd-core';
import { ComponentConfigTypes } from 'brickd-core';

const span: ComponentConfigTypes = {
  propsConfig: {
    children: {
      label: '文本内容',
      type: PROPS_TYPES.string,
    },
  },
};

export default span;

import { ComponentConfigTypes } from 'brickd-core';
import { PROPS_TYPES } from 'brickd-core';

const Tag: ComponentConfigTypes = {
  propsConfig: {
    color: {
      label: '标签色',
      type: PROPS_TYPES.string,
    },
  },
};

export default Tag;

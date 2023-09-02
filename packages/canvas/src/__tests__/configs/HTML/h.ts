import { ComponentSchemaType, PROPS_TYPES } from '@brickd/core';

const h: ComponentSchemaType = {
  childNodesRule: ['img'],
  isRequired: true,
  propsConfig: {
    children: {
      label: '文本内容',
      type: PROPS_TYPES.string,
    },
  },
};

export default h;

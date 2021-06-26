import {
  ComponentSchemaType,
  NODE_PROPS_TYPES,
  PROPS_TYPES,
} from '@brickd/core';

const div: ComponentSchemaType = {
  fatherNodesRule: ['div.children'],
  nodePropsConfig: {
    children: {
      type: NODE_PROPS_TYPES.reactNode,
      childNodesRule: ['img', 'div', 'span'],
    },
  },
  propsConfig: {
    children: {
      label: '文本内容',
      type: PROPS_TYPES.string,
    },
  },
};

export default div;

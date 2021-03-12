import { ComponentSchemaType, PROPS_TYPES } from '@brickd/core';

const img: ComponentSchemaType = {
  propsConfig: {
    alt: {
      label: '图像的替代文本',
      type: PROPS_TYPES.string,
    },
    src: {
      label: '上传图像',
      type: PROPS_TYPES.string,
    },
    height: {
      label: '规定图像的高度',
      type: PROPS_TYPES.string,
    },
    width: {
      label: '规定图像的宽度',
      type: PROPS_TYPES.string,
    },
    a: {
      type: PROPS_TYPES.objectArray,
    },
  },
};
export default img;

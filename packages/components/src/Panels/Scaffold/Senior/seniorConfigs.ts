import { PROPS_TYPES, PropsConfigType } from '@brickd/core';

export const seniorConfigs: PropsConfigType = {
  layoutMode: {
    label: '布局模式',
    type: PROPS_TYPES.enum,
    enumData: ['flow', 'free'],
  },
  state: {
    label: '状态定义',
    type: PROPS_TYPES.object,
    formItemProps: {
      mode: 'json5',
    },
  },
  isStateDomain: {
    type: PROPS_TYPES.boolean,
  },

  propFields: {
    type: PROPS_TYPES.stringArray,
  },
  condition: {
    type: PROPS_TYPES.string,
  },
  loop: {
    type: PROPS_TYPES.objectArray,
    formItemProps: {
      mode: 'json5',
    },
  },

  api: {
    type: PROPS_TYPES.objectArray,
    formItemProps: {
      mode: 'json5',
    },
  },
};

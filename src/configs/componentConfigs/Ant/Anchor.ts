import { PROPS_TYPES } from '@/types/ConfigTypes';

export default {
  propsConfig: {
    affix: {
      label: '固定模式',
      type: PROPS_TYPES.boolean,
      defaultValue: true,
    },
    bounds: {
      label: '锚点区域边界',
      type: PROPS_TYPES.number,
      defaultValue: 5,
    },
    offsetBottom: {
      label: '距底部距离',
      tip: '距离窗口底部达到指定偏移量后触发',
      type: PROPS_TYPES.number,
    },
    offsetTop: {
      label: '距顶部距离',
      tip: '距离窗口顶部达到指定偏移量后触发',
      type: PROPS_TYPES.number,
    },
    onClick: {
      label: '点击事件',
      type: PROPS_TYPES.function,
      placeholder: '(e, link) => {}',
    },
  },
};

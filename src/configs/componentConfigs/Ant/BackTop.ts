import { PROPS_TYPES } from '@/types/ConfigTypes';
import { ComponentConfigType } from '@/types/ComponentConfigType';

const BackTop:ComponentConfigType= {

  propsConfig: {
    target: {
      label: '监听滚动事件元素',
      tip: '设置需要监听其滚动事件的元素，值为一个返回对应 DOM 元素的函数',
      type: PROPS_TYPES.function,
      placeholder: '(window)=> {}',
    },
    children: {
      label: '回到顶部按钮',
      type: PROPS_TYPES.string,
    },
    visibilityHeight: {
      label: '滚动高度',
      tip: '	滚动高度达到此参数值才出现 BackTop',
      type: PROPS_TYPES.number,
      defaultValue: 400,
    },
    onClick: {
      label: '点击回调',
      tip: '点击按钮的回调函数',
      type: PROPS_TYPES.function,
      placeholder: '() => {}',
    },
  },
};

export default BackTop

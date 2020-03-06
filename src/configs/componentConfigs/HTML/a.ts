import { ComponentConfigType } from '@/types/ComponentConfigType';
import { PROPS_TYPES } from '@/types/ConfigTypes';

const a: ComponentConfigType = {
  propsConfig: {
    target: {
      label: '规定在何处打开链接文档',
      type: PROPS_TYPES.enum,
      enumData: ['_blank', '_parent', '_self', '_top', 'framename'],
    },
    href: {
      label: '规定链接指向的页面的 URL',
      type: PROPS_TYPES.string,
    },
    className: {
      label: '类名',
      type: PROPS_TYPES.string,
    },
    onClick: {
      label: '点击事件',
      type: PROPS_TYPES.function,
      placeholder: '()=>{}',
    },
    children: {
      label: '文本内容',
      type: PROPS_TYPES.string,
    },
  },
};

export default a;

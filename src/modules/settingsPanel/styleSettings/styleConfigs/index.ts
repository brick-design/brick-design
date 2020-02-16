import font from './font';
import margin from './margin';
import looks from './looks';
import float from './float';
import position from './position';
import { CSS_TYPE } from '@/types/ConfigTypes';

const className = {
  label: '组件类名',
  styles: {
    classNameSelf: {
      label: '字体',
      labelSpan: 0,
      valueSpan: 24,
      span: 24,
      type: CSS_TYPE.string,
      props: { isShowColor: false, inputColProps: { span: 24 } },
    },
  },
};

export default {
  className,
  font,
  margin,
  looks,
  float,
  position,
};

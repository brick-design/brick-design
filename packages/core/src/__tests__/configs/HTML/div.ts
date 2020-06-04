import { ComponentConfigTypes, PROPS_TYPES } from '../../../types';

const div: ComponentConfigTypes = {
  fatherNodesRule:['div.children'],
  nodePropsConfig:{
    children:{
      type:PROPS_TYPES.reactNode,
      childNodesRule:['img','div','span'],
    }
  },
  propsConfig: {
    children: {
      label: '文本内容',
      type: PROPS_TYPES.string,
    },
  },
};

export default div;

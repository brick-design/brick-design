import { ComponentConfigTypes, PROPS_TYPES } from '../../../types';

const span: ComponentConfigTypes = {
  nodePropsConfig:{
    children:{
      type:PROPS_TYPES.reactNode,
      isRequired:true
    },
    test:{
      type:PROPS_TYPES.reactNode,
      childNodesRule: ['a']
    }
  },
  propsConfig: {
    children: {
      label: '文本内容',
      type: PROPS_TYPES.string,
    },
  },
};

export default span;

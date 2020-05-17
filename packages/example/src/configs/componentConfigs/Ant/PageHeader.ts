import Avatar from './Avatar';
import Tag from './Tag';
import Breadcrumb from './Breadcrumb';
import { ComponentConfigTypes } from 'brickd-core';
import { PROPS_TYPES } from 'brickd-core';

const PageHeader: ComponentConfigTypes = {
  nodePropsConfig: {
    title: {
      type: PROPS_TYPES.reactNode,
    },
    subTitle: {
      type: PROPS_TYPES.reactNode,
    },
    backIcon: {
      type: PROPS_TYPES.reactNode,
    },
    extra: {
      type: PROPS_TYPES.reactNode,
    },
    footer: {
      type: PROPS_TYPES.reactNode,
    },
    children: {
      type: PROPS_TYPES.reactNode,
    },
  },
  propsConfig: {
    ghost: {
      label: 'pageHeader 的类型',
      tip: 'pageHeader 的类型，将会改变背景颜色',
      type: PROPS_TYPES.boolean,
    },
    avatar: {
      label: '标题栏旁的头像',
      type: PROPS_TYPES.object,
      childPropsConfig: Avatar.propsConfig,
    },
    tags: {
      label: 'title 旁的 tag 列表',
      type: PROPS_TYPES.objectArray,
      childPropsConfig: [Tag.propsConfig],
    },
    breadcrumb: {
      label: '面包屑的配置',
      type: PROPS_TYPES.object,
      childPropsConfig: Breadcrumb.Breadcrumb.propsConfig,
    },
    onBack: {
      label: '返回按钮的点击事件',
      type: PROPS_TYPES.function,
      placeholder: '()=>{}',
    },
  },
};
export default PageHeader;

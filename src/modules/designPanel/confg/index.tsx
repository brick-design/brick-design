import React from 'react'
import { flattenDeepArray } from '@/utils';
import CommonContainer from '../components/CommonContainer';
import NoneContainer from '../components/NoneContainer';
import config from '@/configs';
import each from 'lodash/each'

/**
 * 生成react组件容器
 */
function generateContainers(componentNames: string[]) {
  const components: any = {};
  each(componentNames, componentName => {
    components[componentName] = (props: any) => <CommonContainer {...props} containerName={componentName}/>;
  });
  return components;
}

function generateNoneContainers(componentNames: string[]) {
  const components: any = {};
  each(componentNames, componentName => {
    components[componentName] = (props: any) => <NoneContainer {...props} componentName={componentName}/>;
  });
  return components;
}

export const ALL_CONTAINER_COMPONENT_NAMES = flattenDeepArray(config.CONTAINER_CATEGORY);
export const oAllComponents = {
  ...generateNoneContainers(flattenDeepArray(config.NON_CONTAINER_CATEGORY)),
  ...generateContainers(ALL_CONTAINER_COMPONENT_NAMES),

};

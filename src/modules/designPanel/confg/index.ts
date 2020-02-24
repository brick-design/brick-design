import { flattenDeepArray, generateContainers } from '@/utils';
import config from '@/configs';

export const ALL_CONTAINER_COMPONENT_NAMES=flattenDeepArray(config.CONTAINER_CATEGORY)


export const oAllComponents={
  ...config.OriginalComponents,
  ...generateContainers(ALL_CONTAINER_COMPONENT_NAMES),

}

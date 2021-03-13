import { useEffect, useMemo } from 'react';
import {
  ChildNodesType,
  getComponentConfig,
  SelectedInfoBaseType,
} from '@brickd/core';
import { isEmpty } from 'lodash';
import { handleSelectedStatus } from '../common/events';

export interface UseChildNodeType {
  specialProps: SelectedInfoBaseType;
  childNodes?: ChildNodesType;
  componentName: string;
}

export function useChildNodes({
  specialProps,
  childNodes,
  componentName,
}: UseChildNodeType) {
  const { nodePropsConfig, isRequired } = useMemo(
    () => getComponentConfig(componentName),
    [],
  );
  useEffect(() => {
    if (nodePropsConfig) {
      for (const prop of Object.keys(nodePropsConfig)) {
        const { isRequired } = nodePropsConfig[prop];
        if (isRequired && (!childNodes || isEmpty(childNodes[prop]))) {
          handleSelectedStatus(null, false, specialProps, prop);
          break;
        }
      }
    } else if (isRequired && isEmpty(childNodes)) {
      handleSelectedStatus(null, false, specialProps);
    }
  }, [childNodes]);
}

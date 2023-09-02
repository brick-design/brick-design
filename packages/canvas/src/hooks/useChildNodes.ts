import { useEffect, useMemo } from 'react';
import {
  ChildNodesType,
  getComponentConfig,
  selectComponent,
  SelectedInfoBaseType,
} from '@brickd/core';
import { isEmpty } from 'lodash';

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
      for (const propName of Object.keys(nodePropsConfig)) {
        const { isRequired } = nodePropsConfig[propName];
        if (isRequired && (!childNodes || isEmpty(childNodes[propName]))) {
          selectComponent({ ...specialProps, propName });
          break;
        }
      }
    } else if (isRequired && isEmpty(childNodes)) {
      selectComponent(specialProps);
    }
  }, [childNodes]);
}

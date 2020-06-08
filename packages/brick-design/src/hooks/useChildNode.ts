import { useEffect, useMemo } from 'react';
import { LEGO_BRIDGE, PropsNodeType,ChildNodesType, SelectedInfoBaseType } from 'brickd-core';
import { handleSelectedStatus } from '..';
import get from 'lodash/get';
export interface UseChildNodeType {
  specialProps:SelectedInfoBaseType,
  childNodes?:ChildNodesType,
  componentName:string
}

export function useChildNode({specialProps,childNodes,componentName}:UseChildNodeType) {
  const { nodePropsConfig, isRequired } = useMemo(() => get(LEGO_BRIDGE.config!.AllComponentConfigs, componentName), []);
  useEffect(() => {
    if(!childNodes) return
    if (!Array.isArray(childNodes)) {
      for (const prop of Object.keys(nodePropsConfig!)) {
        const { isRequired } = nodePropsConfig![prop];
        if (isRequired && childNodes[prop].length === 0) {
          handleSelectedStatus(null, false, specialProps, prop);
          break;
        }
      }
    } else if (isRequired && childNodes.length === 0) {
      handleSelectedStatus(null, false, specialProps);
    }
  }, [childNodes]);
}

import { useCallback } from 'react';
import {
  SelectedInfoBaseType,
  SelectedInfoType,
  STATE_PROPS,
} from '@brickd/core';
import { useSelector } from './useSelector';
import {  isEqualKey } from '../utils';

interface SelectType {
  selectedInfo: SelectedInfoType;
}

export interface UseSelectType {
  isSelected: boolean;
  selectedDomKeys?: string[];
  propName?: string;
  lockedKey: string;
  selectedStyleProp?:string
}

export function useSelect(
  specialProps: SelectedInfoBaseType,
  isModal?: boolean,
): UseSelectType {
  const { key} = specialProps;

  const controlUpdate = useCallback(
    (prevState: SelectType, nextState: SelectType) => {
      const {
        selectedKey: prevSelectedKey,
        propName: prevPropName,
        domTreeKeys: prevDomTreeKeys = [],
        selectedStyleProp:prevSelectedStyleProp
      } = prevState.selectedInfo || {};
      const { selectedKey, domTreeKeys = [], propName ,selectedStyleProp} =
        nextState.selectedInfo || {};

      if (
        (!prevSelectedKey && selectedKey) ||
        (prevSelectedKey && !selectedKey)
      ) {
        if (
          isModal &&
          (domTreeKeys.includes(key) || prevDomTreeKeys.includes(key))
        ) {
          return true;
        }
        return isEqualKey(key, selectedKey) || isEqualKey(key, prevSelectedKey);
      }

      if (prevSelectedKey && selectedKey) {
        if (prevSelectedKey !== selectedKey) {
          if (isModal && domTreeKeys.includes(key)) return true;
          return (
            isEqualKey(key, prevSelectedKey) || isEqualKey(key, selectedKey)
          );
        } else if(prevSelectedStyleProp!==selectedStyleProp){
          return true;
        }else {
          return (
            propName !== prevPropName
          );
        }
      }
    },
    [],
  );


  const { selectedInfo } = useSelector<SelectType, STATE_PROPS>(
    ['selectedInfo'],
    controlUpdate,
  );

  const { selectedKey, domTreeKeys: selectedDomKeys, propName,selectedStyleProp } =
    selectedInfo || {};
  const isSelected = isEqualKey(key, selectedKey);


  return { selectedDomKeys, isSelected, propName, lockedKey: selectedKey,selectedStyleProp };
}

import { useEffect } from 'react';
import {
  SelectedInfoBaseType,
  SelectedInfoType,
  STATE_PROPS,
} from '@brickd/core';
import { useSelector } from './useSelector';
import { handleSelectedStatus } from '../common/events';
import { isEqualKey } from '../utils';

interface SelectType {
  selectedInfo: SelectedInfoType;
}

function controlUpdate(
  prevState: SelectType,
  nextState: SelectType,
  key: string,
  isModal?: boolean,
) {
  const {
    selectedKey: prevSelectedKey,
    propName: prevPropName,
    domTreeKeys: prevDomTreeKeys,
  } = prevState.selectedInfo || {};
  const { selectedKey, propName, domTreeKeys } = nextState.selectedInfo || {};

  if (!prevSelectedKey && selectedKey) {
    if (isModal) {
      if (domTreeKeys.includes(key)) {
        return true;
      }
    }
    return isEqualKey(key, selectedKey);
  }
  if (prevSelectedKey && !selectedKey) {
    if (isModal) {
      if (prevDomTreeKeys.includes(key)) {
        return true;
      }
    }
    return isEqualKey(key, prevSelectedKey);
  }
  if (prevSelectedKey && selectedKey) {
    if (isModal) {
      if (
        (!prevDomTreeKeys.includes(key) && domTreeKeys.includes(key)) ||
        (prevDomTreeKeys.includes(key) && !domTreeKeys.includes(key))
      ) {
        return true;
      }
    }
    if (prevSelectedKey !== selectedKey) {
      return (
        isEqualKey(key, prevSelectedKey) ||
        (!isEqualKey(key, prevSelectedKey) && isEqualKey(key, selectedKey))
      );
    } else {
      return propName !== prevPropName;
    }
  }
  return false;
}

interface UseSelectType {
  isSelected: boolean;
  selectedDomKeys?: string[];
}

export function useSelect(
  specialProps: SelectedInfoBaseType,
  isModal?: boolean,
): UseSelectType {
  const { key } = specialProps;
  const { selectedInfo } = useSelector<SelectType, STATE_PROPS>(
    ['selectedInfo'],
    (prevState, nextState) => controlUpdate(prevState, nextState, key, isModal),
  );
  const { selectedKey, domTreeKeys: selectedDomKeys } = selectedInfo || {};
  const isSelected = isEqualKey(key, selectedKey);
  useEffect(() => {
    if (isSelected) {
      handleSelectedStatus(null, false, specialProps);
    }
  }, []);
  return { selectedDomKeys, isSelected };
}

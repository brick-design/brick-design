import { SelectedInfoBaseType, SelectedInfoType, STATE_PROPS, useSelector } from 'brickd-core';
import { useEffect } from 'react';
import { handleSelectedStatus } from '../common/events';
import { formatUnit, isEqualKey } from '../utils';

interface SelectType {
  selectedInfo: SelectedInfoType
}

function controlUpdate(prevState: SelectType, nextState: SelectType, key: string) {
  const { selectedKey: prevSelectedKey, propName: prevPropName } = prevState.selectedInfo || {};
  const { selectedKey, propName } = nextState.selectedInfo || {};
  const keyResult=parseInt(key)
  if (!prevSelectedKey && selectedKey) {
    return isEqualKey(key,selectedKey);
  }
  if (prevSelectedKey && !selectedKey) {
    return isEqualKey(key,prevSelectedKey);
  }
  if (prevSelectedKey && selectedKey) {
    if (prevSelectedKey !== selectedKey) {
      return isEqualKey(key,prevSelectedKey) || !isEqualKey(key,prevSelectedKey) && isEqualKey(key,selectedKey);
    } else {
      return propName !== prevPropName;
    }
  }
  return false;
}

interface UseSelectType {
  isSelected: boolean,
  selectedDomKeys?: string[]
}

export function useSelect(specialProps: SelectedInfoBaseType): UseSelectType {
  const { key } = specialProps;
  const { selectedInfo } = useSelector<SelectType, STATE_PROPS>(['selectedInfo'],
    (prevState, nextState) => controlUpdate(prevState, nextState, key));
  const { selectedKey, domTreeKeys: selectedDomKeys } = selectedInfo || {};
  const isSelected = isEqualKey(key,selectedKey);
  useEffect(() => {
    if (isSelected) {
      handleSelectedStatus(null, false, specialProps);
    }
  }, []);
  return { selectedDomKeys, isSelected };
}

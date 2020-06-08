import { SelectedInfoBaseType, SelectedInfoType, useSelector } from 'brickd-core';
import { useEffect } from 'react';
import { handleSelectedStatus } from '../../dist';

interface SelectType {
  selectedInfo: SelectedInfoType
}

function controlUpdate(prevState: SelectType, nextState: SelectType, key: string) {
  const { selectedKey: prevSelectedKey, propName: prevPropName } = prevState.selectedInfo || {};
  const { selectedKey, propName } = nextState.selectedInfo || {};
  if (!prevSelectedKey && selectedKey) {
    return selectedKey.includes(key);
  }
  if (prevSelectedKey && !selectedKey) {
    return prevSelectedKey.includes(key);
  }
  if (prevSelectedKey && selectedKey) {
    if (prevSelectedKey !== selectedKey) {
      return prevSelectedKey.includes(key) || !prevSelectedKey.includes(key) && selectedKey.includes(key);
    } else {
      return propName !== prevPropName;
    }
  }
  return false;
}

interface UseSelectType {
  isSelected: boolean,
  selectedDomKeys?:string[]
}

export function useSelect(specialProps:SelectedInfoBaseType): UseSelectType {
  const {key}=specialProps
  const { selectedInfo } = useSelector<SelectType>(['selectedInfo'],
    (prevState, nextState) => controlUpdate(prevState, nextState, key));
  const {selectedKey,domTreeKeys:selectedDomKeys}=selectedInfo||{}
  const isSelected=!!selectedKey && selectedKey.includes(key)
  useEffect(() => {
    if (isSelected) {
      handleSelectedStatus(null, false, specialProps);
    }
  }, []);
  return {selectedDomKeys,isSelected};
}

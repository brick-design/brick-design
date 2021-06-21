import { useCallback, useEffect, useRef } from 'react';
import {
  SelectedInfoBaseType,
  SelectedInfoType,
  STATE_PROPS,
  selectComponent,
} from '@brickd/core';
import { get } from 'lodash';
import { useSelector } from './useSelector';
import { getDragKey, isEqualKey } from '../utils';

interface SelectType {
  selectedInfo: SelectedInfoType;
}

interface UseSelectType {
  isSelected: boolean;
  selectedDomKeys?: string[];
  propName?: string;
  lockedKey: string;
}

export function useSelect(
  specialProps: SelectedInfoBaseType,
  isModal?: boolean,
): UseSelectType {
  const { key, domTreeKeys: selfDomTreeKeys } = specialProps;

  const controlUpdate = useCallback(
    (prevState: SelectType, nextState: SelectType) => {
      const {
        selectedKey: prevSelectedKey,
        propName: prevPropName,
        domTreeKeys: prevDomTreeKeys = [],
      } = prevState.selectedInfo || {};
      const { selectedKey, domTreeKeys = [], propName } =
        nextState.selectedInfo || {};

      const prevDragKey = get(prevState, 'dragSource.dragKey');
      const nextDragKey = get(nextState, 'dragSource.dragKey');

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
        } else {
          return (
            propName !== prevPropName ||
            selfDomTreeKeys.includes(prevDragKey) ||
            selfDomTreeKeys.includes(nextDragKey)
          );
        }
      } else {
        return (
          selfDomTreeKeys.includes(prevDragKey) ||
          selfDomTreeKeys.includes(nextDragKey)
        );
      }
    },
    [],
  );

  const renderStatusRef = useRef(false);

  const { selectedInfo } = useSelector<SelectType, STATE_PROPS>(
    ['selectedInfo', 'dragSource'],
    controlUpdate,
  );

  const { selectedKey, domTreeKeys: selectedDomKeys, propName } =
    selectedInfo || {};
  const isSelected = isEqualKey(key, selectedKey);

  useEffect(() => {
    if (!isSelected) {
      renderStatusRef.current = true;
    }
  }, []);

  useEffect(() => {
    const dragKey = getDragKey();
    if (isSelected && !dragKey && !renderStatusRef.current) {
      renderStatusRef.current = true;
      selectComponent(specialProps);
    }
  });

  return { selectedDomKeys, isSelected, propName, lockedKey: selectedKey };
}

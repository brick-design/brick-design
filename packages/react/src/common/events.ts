import {
  addComponent,
  clearHovered,
  clearSelectedStatus,
  overTarget,
  selectComponent,
  SelectedInfoBaseType,
} from '@brickd/core';

export function handleSelectedStatus(
  event: Event | null,
  isSelected: boolean,
  specialProps: SelectedInfoBaseType,
  propName?: string,
) {
  event && event.stopPropagation && event.stopPropagation();
  if (isSelected) {
    clearSelectedStatus();
  } else {
    selectComponent({ ...specialProps, propName });
  }
}

/**
 * hover组件上触发
 * @param event
 * @param key
 * @param isSelected
 */
export function onMouseOver(event: Event, key: string, isSelected: boolean) {
  event && event.stopPropagation && event.stopPropagation();
  if (isSelected) {
    clearHovered();
  } else {
    overTarget({
      hoverKey: key,
    });
  }
}

export function onDragover(e: any) {
  e.preventDefault();
}

export function onDrop(e: any) {
  e.stopPropagation();
  addComponent();
  // eslint-disable-next-line no-undef
}

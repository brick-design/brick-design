import { addComponent, clearHovered, overTarget } from '@brickd/core';

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

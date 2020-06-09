import { DragSourceType, DropTargetType, STATE_PROPS, useSelector } from 'brickd-core';

export interface DragDropTypes {
  dragSource: DragSourceType,
  dropTarget: DropTargetType
}

function dragDropUpdate(prevState: DragDropTypes, nextState: DragDropTypes, key: string) {
  const { dragKey } = nextState.dragSource || {};
  const { dragKey: prevDragKey } = prevState.dragSource || {};


    return false;
}

export function useDragDrop(key: string) {
  const { dragSource, dropTarget } = useSelector<DragDropTypes, STATE_PROPS>(['dragSource', 'dropTarget'],
    (prevState, nextState) => dragDropUpdate(prevState, nextState, key));
  const {  selectedKey,domTreeKeys } = dropTarget || {};
  const { parentKey, dragKey } = dragSource || {};
  const isHidden = dragKey === key&&!!parentKey&& !!selectedKey && parentKey !== selectedKey&&!domTreeKeys.includes(parentKey);

  return { dragSource, dropTarget, isHidden};
}

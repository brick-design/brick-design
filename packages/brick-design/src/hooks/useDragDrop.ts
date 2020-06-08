import { DragSourceType, DropTargetType, useSelector } from 'brickd-core';
import get from 'lodash/get';

export interface DragDropTypes {
  dragSource: DragSourceType,
  dropTarget: DropTargetType
}

function dragDropUpdate(prevState: DragDropTypes, nextState: DragDropTypes, key: string) {
  const selectedKey = get(nextState.dropTarget, 'selectedKey');
  const prevSelectedKey = get(prevState.dropTarget, 'selectedKey');
  const dragKey = get(nextState.dragSource, 'dragKey');
  const prevDragKey = get(prevState.dragSource, 'dragKey');
  return selectedKey !== key && prevSelectedKey === key ||
    selectedKey === key && prevSelectedKey !== key || dragKey !== prevDragKey;
}
export function useDragDrop(key:string) {

  const { dragSource, dropTarget } = useSelector<DragDropTypes>(['dragSource', 'dropTarget'],
    (prevState, nextState) => dragDropUpdate(prevState, nextState, key));
  const {domTreeKeys,selectedKey}=dropTarget||{}
  const {parentKey}=dragSource||{}
  const isHidden=!!parentKey&&parentKey!==selectedKey&&!domTreeKeys.includes(parentKey)
  return{dragSource,dropTarget,isHidden}
}

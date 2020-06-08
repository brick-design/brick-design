import { DragSourceType, DropTargetType, STATE_PROPS, useSelector } from 'brickd-core';
import get from 'lodash/get';

export interface DragDropTypes {
  dragSource: DragSourceType,
  dropTarget: DropTargetType
}

function dragDropUpdate(prevState: DragDropTypes, nextState: DragDropTypes, key: string) {
  const{selectedKey}=nextState.dropTarget||{}
  const {selectedKey:prevSelectedKey}=prevState.dropTarget||{}
  const {dragKey}=nextState.dragSource||{}
  const {dragKey:prevDragKey}=prevState.dragSource||{}
  if(prevSelectedKey!==selectedKey){
    return  prevSelectedKey===key||selectedKey===key
  }
  return dragKey!==prevDragKey
}
export function useDragDrop(key:string) {

  const { dragSource, dropTarget } = useSelector<DragDropTypes,STATE_PROPS>(['dragSource', 'dropTarget'],
    (prevState, nextState) => dragDropUpdate(prevState, nextState, key));
  const {domTreeKeys,selectedKey}=dropTarget||{}
  const {parentKey,dragKey}=dragSource||{}
  const isHidden=dragKey===key&&!!selectedKey&&parentKey!==selectedKey&&!domTreeKeys.includes(parentKey)
  return{dragSource,dropTarget,isHidden}
}

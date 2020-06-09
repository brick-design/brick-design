import { DragSourceType, DropTargetType, STATE_PROPS, useSelector } from 'brickd-core';

export interface DragDropTypes {
  dragSource: DragSourceType,
  dropTarget: DropTargetType
}

function dragDropUpdate(prevState: DragDropTypes, nextState: DragDropTypes, key: string) {
  const { selectedKey,domTreeKeys } = nextState.dropTarget || {};
  const { selectedKey: prevSelectedKey,domTreeKeys:prevDomTreeKeys } = prevState.dropTarget || {};
  const { dragKey,parentKey } = nextState.dragSource || {};
  const { dragKey: prevDragKey } = prevState.dragSource || {};
  //drop相关 分立不合并
    if(prevSelectedKey===key&&selectedKey!==key||prevSelectedKey!==key&&selectedKey===key){
      return true
    }

    if(dragKey==key){
      if(!prevDomTreeKeys&&domTreeKeys){
       return  domTreeKeys.includes(parentKey)
      }
      if(prevDomTreeKeys&&!domTreeKeys){
        return prevDomTreeKeys.includes(parentKey)
      }

      if(prevDomTreeKeys&&domTreeKeys){
        return prevDomTreeKeys.includes(parentKey)&&!domTreeKeys.includes(parentKey)||!prevDomTreeKeys.includes(parentKey)&&domTreeKeys.includes(parentKey)
      }

    }
  //drag相关 分立不合并
    return prevDragKey === key && dragKey !== key || prevDragKey !== key && dragKey === key;

}

export function useDragDrop(key: string) {
  const { dragSource, dropTarget } = useSelector<DragDropTypes, STATE_PROPS>(['dragSource', 'dropTarget'],
    (prevState, nextState) => dragDropUpdate(prevState, nextState, key));
  const {  selectedKey,domTreeKeys } = dropTarget || {};
  const { parentKey, dragKey } = dragSource || {};
  const isHidden = dragKey === key&&!!parentKey&& !!selectedKey && parentKey !== selectedKey&&!domTreeKeys.includes(parentKey);

  return { dragSource, dropTarget, isHidden};
}

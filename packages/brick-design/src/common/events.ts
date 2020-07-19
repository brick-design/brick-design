import {
  addComponent,
  clearHovered,
  clearSelectedStatus,
  getDragSource,
  getDropTarget,
  overTarget,
  selectComponent,
  SelectedInfoBaseType,
} from 'brickd-core';


export function handleSelectedStatus(
  event: Event | null,
  isSelected: boolean,
  specialProps: SelectedInfoBaseType
  , propName?: string) {

  event&& event.stopPropagation&&event.stopPropagation();
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
export function onMouseOver(event: Event, key: string,isSelected:boolean) {
  event&&event.stopPropagation&&event.stopPropagation();
  if(isSelected){
    clearHovered()
  }else {
    overTarget({
      hoverKey: key,
    });
  }

}

/**
 * 获取要放入组件的容器信息
 * @param event
 * @param domTreeKeys
 * @param selectedKey
 * @param propName
 */
export function getDropTargetInfo(event: Event, domTreeKeys: string[], selectedKey: string, propName?: string) {
  event&&event.stopPropagation&&event.stopPropagation();

  getDropTarget({
    propName,
    selectedKey,
    domTreeKeys,
  });

}


/**
 * 拖拽当前组件时获取当前组件的信息
 * @param event
 * @param dragKey
 * @param parentKey
 * @param parentPropName
 */
export function onDragStart(event: Event, dragKey: string, parentKey: string, parentPropName?: string) {
  event&&event.stopPropagation&&event.stopPropagation();
  setTimeout(()=>{
    getDragSource({
      dragKey,
      parentKey,
      parentPropName,
    });
  },0)

}




export function onDragover(e: any) {
  e.preventDefault();

}

export function onDrop(e: any) {
  e.stopPropagation();
  addComponent();
}

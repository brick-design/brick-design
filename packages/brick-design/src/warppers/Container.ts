import { createElement, forwardRef, memo, useEffect, useState } from 'react';
import get from 'lodash/get';
import merge from 'lodash/merge';
import { formatSpecialProps } from '../utils';
import { DragSourceType, DropTargetType, LEGO_BRIDGE, produce, useSelector } from 'brickd-core';

import {
  CommonPropsType,
  handleChildNodes,
  handleEvents,
  handleModalTypeContainer,
  handlePropsClassName,
  HookState,
  propAreEqual,
} from '../common/handleFuns';
import { useCommon } from '../hooks/useCommon';
import { getDropTargetInfo } from '..';


export interface DragDropTypes extends HookState {
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

/**
 * 所有的容器组件名称
 */
function Container(allProps: CommonPropsType, ref: any) {
  const {
    specialProps,
    specialProps: {
      key,
      domTreeKeys,
    },
    ...rest
  } = allProps;

  const { dragSource, dropTarget } = useSelector<DragDropTypes>(['dragSource', 'dropTarget'],
    (prevState, nextState) => dragDropUpdate(prevState, nextState, key));
  const {
    props,
    addPropsConfig,
    childNodes,
    componentName,
    mirrorModalField,
    propsConfig,
    isHovered,
    isSelected,
    componentConfigs,
    SelectedDomKeys,
  } = useCommon(allProps);
  const [children, setChildren] = useState(childNodes);

  const onDragEnter = (e: Event) => {
    e.stopPropagation();
    const { dragKey,parentKey, } = dragSource;
    if (dragKey && !domTreeKeys.includes(dragKey)&& !SelectedDomKeys) {
      let propName;
      if(parentKey!==key){
        if (Array.isArray(childNodes)) {
          setChildren([...childNodes, dragKey]);
        } else {
          setChildren(produce(childNodes, oldChild => {
            propName = Object.keys(oldChild!)[0];
            oldChild![propName] = [...oldChild![propName], dragKey];
          }));
        }
      }
      getDropTargetInfo(e, domTreeKeys, key, propName);
    }
  };

  useEffect(() => {
      setChildren(childNodes);
  }, [childNodes]);

  if ((!dropTarget|| dropTarget.selectedKey !== key) && children !== childNodes) {
    setChildren(childNodes);
  }

  if (!componentName) return null;

  let modalProps: any = {};
  if (mirrorModalField) {
    const { displayPropName, mountedProps } = handleModalTypeContainer(mirrorModalField, 'dnd-iframe');
    const isVisible = isSelected || SelectedDomKeys && SelectedDomKeys.includes(key);
    modalProps = { [displayPropName]: isVisible, ...mountedProps };
  }

  const { className, animateClass, ...restProps } = props;
  return (
    createElement(get(LEGO_BRIDGE.config!.OriginalComponents, componentName, componentName), {
      ...restProps,
      className: handlePropsClassName(isSelected, isHovered, className, animateClass),
      ...handleEvents(specialProps, isSelected, childNodes),
      onDragEnter,
      ...handleChildNodes(domTreeKeys, key, componentConfigs, children!),
      ...formatSpecialProps(props, merge({}, propsConfig, addPropsConfig)),
      draggable: true,
      /**
       * 设置组件id方便抓取图片
       */
      id: isSelected ? 'select-img' : undefined,
      ref,
      ...rest,
      ...modalProps,
    })
  );
}

export default memo<CommonPropsType>(forwardRef(Container), propAreEqual);



import { createElement, forwardRef, memo, useEffect, useMemo, useState } from 'react';
import get from 'lodash/get';
import merge from 'lodash/merge';
import { formatSpecialProps } from '../utils';
import { clearDropTarget, getAddPropsConfig, LEGO_BRIDGE, produce, STATE_PROPS, useSelector } from 'brickd-core';

import {
  CommonPropsType,
  controlUpdate,
  handleChildNodes,
  handleEvents,
  handleModalTypeContainer,
  handlePropsClassName,
  HookState,
  propAreEqual,
  stateSelector,
} from '../common/handleFuns';
import { getDropTargetInfo } from '..';
import { useHover } from '../hooks/useHover';
import { useSelect } from '../hooks/useSelect';
import { useDragDrop } from '../hooks/useDragDrop';
import { useChildNodes } from '../hooks/useChildNodes';

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
    isDragAddChild,
    ...rest
  } = allProps;

  const { componentConfigs, propsConfigSheet } = useSelector<HookState, STATE_PROPS>(stateSelector,
    (prevState, nextState) => controlUpdate(prevState, nextState, key));
  const { props, childNodes, componentName } = componentConfigs[key] || {};
  useChildNodes({ childNodes, componentName, specialProps });
  const { dragSource, dropTarget, isHidden } = useDragDrop(key);
  const { dragKey,parentKey} = dragSource || {};
  const [children, setChildren] = useState(childNodes);
  const isHovered = useHover(key);
  const { selectedDomKeys, isSelected } = useSelect(specialProps);
  const { mirrorModalField, propsConfig } = useMemo(() => get(LEGO_BRIDGE.config!.AllComponentConfigs, componentName), []);
  const onDragEnter = (e: Event) => {
    e.stopPropagation();
    if (!selectedDomKeys) {
      let propName;
      //判断当前组件是否为拖拽组件的父组件或者是否为子孙组件或者它自己
      if (parentKey!==key&&dragKey!==key&&!domTreeKeys.includes(dragKey)) {
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
  const onDragLeave = (e: Event) => {
    e.stopPropagation();
    const { selectedKey } = dropTarget || {};
    if (selectedKey === key) {
      // clearDropTarget();
    }
  };

  useEffect(() => {
    setChildren(childNodes);
  }, [childNodes]);

  if ((!dropTarget || dropTarget.selectedKey !== key) && children !== childNodes) {
    setChildren(childNodes);
  }

  if (!componentName) return null;

  let modalProps: any = {};
  if (mirrorModalField) {
    const { displayPropName, mountedProps } = handleModalTypeContainer(mirrorModalField, 'dnd-iframe');
    const isVisible = isSelected || selectedDomKeys && selectedDomKeys.includes(key);
    modalProps = { [displayPropName]: isVisible, ...mountedProps };
  }

  const { className, animateClass, ...restProps } = props || {};
  return (
    createElement(get(LEGO_BRIDGE.config!.OriginalComponents, componentName, componentName), {
      ...restProps,
      className: handlePropsClassName(isSelected, isHovered, isHidden, className, animateClass),
      ...handleEvents(specialProps, isSelected, childNodes),
      ...(isDragAddChild ?{}:{
        onDragEnter,
        onDragLeave,
      }),
      ...handleChildNodes(specialProps, componentConfigs, children!, dragKey, childNodes!==children, isDragAddChild),
      ...formatSpecialProps(props, produce(propsConfig, oldPropsConfig => {
        merge(oldPropsConfig, getAddPropsConfig(propsConfigSheet, key));
      })),
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



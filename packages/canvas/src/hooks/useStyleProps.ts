import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  getComponentConfig,
  PROPS_TYPES,
  selectComponent,
  SelectedInfoBaseType,
} from '@brickd/core';
import { each } from 'lodash';
import { useOperate } from './useOperate';
import { useMouseMove } from './useMouseMove';
import { UseSelectType } from './useSelect';
import { getNodeFromClassName } from '../utils';

export function useStyleProps(
  componentName: string,
  specialProps: SelectedInfoBaseType,
  className: string,
  selectedInfo: UseSelectType,
) {
  const { key } = specialProps;
  const { propsConfig } = getComponentConfig(componentName);
  const { setOperateState } = useOperate();
  const stylePropsNodeRef = useRef<any>({});
  const styleProps: any = {};
  const { isSelected, selectedStyleProp } = selectedInfo;
  const { onMouseDown, onMove, onMoveEnd } = useMouseMove(isSelected, key);
  useMemo(() => {
    each(propsConfig, (config, propName) => {
      const { type } = config;
      if (type === PROPS_TYPES.cssClass) {
        styleProps[propName] = key + propName;
      }
    });
  }, []);

  const onHover = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation();
      setOperateState({ hoverNode: event.target as HTMLElement });
    },
    [isSelected],
  );

  const onClick = useCallback((event: MouseEvent, propName: string) => {
    event.stopPropagation();
    selectComponent({ ...specialProps, selectedStyleProp: propName });
    setOperateState({
      selectedNode: event.target as HTMLElement,
      operateSelectedKey: key,
      // index,
    });
  }, []);

  useEffect(() => {
    const stylePropsListeners: any = {};
    each(styleProps, (className, propName) => {
      if (propName !== 'className' && !stylePropsNodeRef.current[propName]) {
        //todo 获取的节点不够精确
        stylePropsNodeRef.current[propName] = getNodeFromClassName(className);
      }
    });
    each(stylePropsNodeRef.current, (node: HTMLElement, propName) => {
      stylePropsListeners[propName] = {
        onClick: (event: MouseEvent) => onClick(event, propName),
      };
      node.onmouseover = onHover;
      node.ondblclick = (event: MouseEvent) => onClick(event, propName);
      if (isSelected && selectedStyleProp === propName) {
        node.draggable = false;
        node.onmousedown = onMouseDown;
        node.onmousemove = onMove;
        node.onmouseup = onMoveEnd;
        node.ondragstart = () => false;
      }
    });
  });

  styleProps.className = key + 'brick-design' + ' ' + className;
  return styleProps;
}

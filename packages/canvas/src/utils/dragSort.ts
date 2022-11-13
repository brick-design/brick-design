import { get, isEmpty, isEqual } from 'lodash';
import {
  css,
  EXCLUDE_POSITION,
  getDragKey,
  getParentKeyNodes,
  getParentKeyNodesRect,
  getParentNodeRealRect,
  getSelectedNode,
  getVNode,
  isVertical,
} from './utils';

export const placeholderBridgeStore = {
  prevRects: null,
  renderPlaceholder: null,
  changePosition(rects: PlaceholderPositionType) {
    if (!isEqual(this.prevRects, rects)) {
      this.prevRects = rects;
      this.renderPlaceholder && this.renderPlaceholder(rects);
    }
  },
};

export type PlaceholderRect = {
  height?: number;
  left?: number;
  top?: number;
  width?: number;
  isEmptyChild?: boolean;
};

export type PlaceholderPositionType = {
  node1?: PlaceholderRect;
  node2?: PlaceholderRect;
  node3?: PlaceholderRect;
  isFreeLayout?: boolean;
};

export const dragFreeLayout = (dragOffset: DragEvent) => {
  const { clientX, clientY, target } = dragOffset;
  const { left, top } = getParentNodeRealRect(target as Element);
  placeholderBridgeStore.changePosition({
    node2: {
      width: 60,
      height: 60,
      left: clientX - left,
      top: clientY - top,
    },
    isFreeLayout: true,
  });
};

const getFirstNodeRect = (dragKeys: string[], parentNode: Element) => {
  for (let index = 0; index < dragKeys.length; index++) {
    const rect = getParentKeyNodesRect(parentNode, dragKeys[index]);
    if (!isEmpty(rect)) {
      return { ...rect, index };
    }
  }
  return {};
};
/**
 * 获取容器中最后一个节点的真实Rect
 * @param dragKeys
 * @param parentNode
 */
const getLastNodeRect = (dragKeys: string[], parentNode: Element) => {
  for (let index = dragKeys.length - 1; index >= 0; index--) {
    const rect = getParentKeyNodesRect(parentNode, dragKeys[index]);
    if (!isEmpty(rect)) {
      return { ...rect, index };
    }
  }
  return {};
};

/**
 * 获取拖拽操作层第一个占位节点的Rect
 * @param index
 * @param firstNodeRect
 * @param parentNode
 * @param compareChildren
 */
const getPlaceholder1Rect = (
  index,
  firstNodeRect,
  parentNode,
  compareChildren,
) => {
  if (index >= firstNodeRect.index) {
    for (let i = index; i >= firstNodeRect.index; i--) {
      const rect = getParentKeyNodesRect(parentNode, compareChildren[i]);
      if (!isEmpty(rect)) {
        const { realWidth, left, top, realHeight } = getParentKeyNodesRect(
          parentNode,
          compareChildren[index],
        );
        return {
          height: top - firstNodeRect.top + realHeight,
          width: left - firstNodeRect.left + realWidth,
          realHeight,
          realWidth,
        };
      }
    }
  } else {
    return {};
  }
};

const getPlaceholder3Rect = (
  index,
  lastNodeRect,
  parentNode,
  compareChildren,
) => {
  if (index <= lastNodeRect.index) {
    for (let i = index; i <= lastNodeRect.index; i++) {
      const rect = getParentKeyNodesRect(parentNode, compareChildren[i]);
      if (!isEmpty(rect)) {
        const { left, top, realHeight, realWidth } = rect;
        return {
          width: lastNodeRect.left - left + lastNodeRect.realWidth,
          height: lastNodeRect.top - top + lastNodeRect.realHeight,
          realHeight,
          realWidth,
        };
      }
    }
  }
  return {};
};

/**
 * 获取拖拽排序
 * @param compareChildren
 * @param parentNode
 * @param dragOffset
 */
export const dragSort = (
  compareChildren: string[] = [],
  parentNode: Element,
  dragOffset: DragEvent,
) => {
  const isV = isVertical(parentNode);
  const placeholderPosition: PlaceholderPositionType = {};
  const dragKey = getDragKey();
  if (!dragKey) return compareChildren;
  // const {
  //   realWidth: parentWidth,
  //   realHeight: parentHeight,
  //   left:parentLeft,
  //   top:parentTop
  // } = getParentNodeRealRect(parentNode);
  const { clientX, clientY } = dragOffset;
  let newChildren = [];
  const lastNodeRect = getLastNodeRect(compareChildren, parentNode);
  const firstNodeRect = getFirstNodeRect(compareChildren, parentNode);
  const restChildren = () => {
    placeholderPosition.node1 = null;
    placeholderPosition.node2 = null;
    placeholderPosition.node3 = null;
    newChildren = compareChildren;
  };

  const getNode1Rect = (index) => {
    return getPlaceholder1Rect(
      index,
      firstNodeRect,
      parentNode,
      compareChildren,
    );
  };

  const getNode3Rect = (index) => {
    return getPlaceholder3Rect(
      index,
      lastNodeRect,
      parentNode,
      compareChildren,
    );
  };

  for (let index = 0; index < compareChildren.length; index++) {
    const compareKey = compareChildren[index];
    // if (compareKey === dragKey) continue;
    if (
      EXCLUDE_POSITION.includes(
        get(css(getParentKeyNodes(parentNode, compareKey)[0]), 'position'),
      )
    ) {
      newChildren.push(compareKey);
      continue;
    }
    const childRect = getParentKeyNodesRect(parentNode, compareKey);
    if (!childRect) {
      newChildren.push(compareKey);
      continue;
    }

    const { left, top, width, height } = childRect;
    const offsetLeft = clientX - left;
    const offsetTop = clientY - top;
    // const offsetW = parentWidth - realWidth;
    // const offsetH = parentHeight - realHeight;
    if (!isV) {
      if (offsetLeft > 0) {
        if (offsetLeft <= width * 0.5) {
          if (
            dragKey === compareKey ||
            dragKey === compareChildren[index - 1]
          ) {
            restChildren();
            break;
          }
          placeholderPosition.node1 = getNode1Rect(index - 1);
          placeholderPosition.node2 = { height };
          placeholderPosition.node3 = getNode3Rect(index);
          newChildren.push(dragKey, ...compareChildren.slice(index));
          break;
        } else if (offsetLeft < width && offsetLeft > width * 0.5) {
          if (
            dragKey === compareKey ||
            dragKey === compareChildren[index + 1]
          ) {
            restChildren();
            break;
          }
          placeholderPosition.node1 = getNode1Rect(index);
          placeholderPosition.node2 = { height };
          placeholderPosition.node3 = getNode3Rect(index + 1);

          newChildren.push(
            compareKey,
            dragKey,
            ...compareChildren.slice(index + 1),
          );
          break;
        } else {
          if (dragKey !== compareKey) newChildren.push(compareKey);
          if (index === compareChildren.length - 1) {
            newChildren.push(dragKey);
            placeholderPosition.node1 = getNode1Rect(index);
            placeholderPosition.node2 = { height };
            placeholderPosition.node3 = getNode3Rect(index + 1);
          }
        }
      } else {
        if (dragKey === compareKey || dragKey === compareChildren[index - 1]) {
          restChildren();
          break;
        }
        placeholderPosition.node1 = getNode1Rect(index - 1);
        placeholderPosition.node2 = { height };
        placeholderPosition.node3 = getNode3Rect(index);
        newChildren.push(dragKey, ...compareChildren.slice(index));
        break;
      }
    } else {
      if (offsetTop > 0) {
        if (offsetTop <= height * 0.5) {
          if (
            dragKey === compareKey ||
            dragKey === compareChildren[index - 1]
          ) {
            restChildren();
            break;
          }
          placeholderPosition.node1 = getNode1Rect(index - 1);
          placeholderPosition.node2 = { width };
          placeholderPosition.node3 = getNode3Rect(index);
          newChildren.push(dragKey, ...compareChildren.slice(index));
          break;
        } else if (offsetTop < height && offsetTop > height * 0.5) {
          if (
            dragKey === compareKey ||
            dragKey === compareChildren[index + 1]
          ) {
            restChildren();
            break;
          }
          placeholderPosition.node1 = getNode1Rect(index);
          placeholderPosition.node2 = { width };
          placeholderPosition.node3 = getNode3Rect(index + 1);

          newChildren.push(
            compareKey,
            dragKey,
            ...compareChildren.slice(index + 1),
          );
          break;
        } else {
          if (dragKey !== compareKey) newChildren.push(compareKey);
          if (index === compareChildren.length - 1) {
            newChildren.push(dragKey);
            placeholderPosition.node1 = getNode1Rect(index);
            placeholderPosition.node2 = { width };
            placeholderPosition.node3 = getNode3Rect(index + 1);
          }
        }
      } else {
        if (dragKey === compareKey || dragKey === compareChildren[index - 1]) {
          restChildren();
          break;
        }
        placeholderPosition.node1 = getNode1Rect(index - 1);
        placeholderPosition.node2 = { width };
        placeholderPosition.node3 = getNode3Rect(index);
        newChildren.push(dragKey, ...compareChildren.slice(index));
        break;
      }
    }
  }
  if (!newChildren.includes(dragKey)) {
    newChildren.push(dragKey);
  }
  placeholderBridgeStore.changePosition(placeholderPosition);
  return [...new Set(newChildren)];
};

export const onDragBrickTree = (
  dragKey: string,
  sortKeys: string[],
  parentKey: string,
  setOperateState,
  propName,
) => {
  let parentNode = getSelectedNode(parentKey);
  const placeholderPosition: PlaceholderPositionType = {};
  let childNodes = get(getVNode(parentKey), 'childNodes', []) as string[];
  if (!Array.isArray(childNodes) && propName) {
    childNodes = get(childNodes, 'propName', []);
  }

  if (isEqual(childNodes, sortKeys))
    return placeholderBridgeStore.changePosition(placeholderPosition);
  if (sortKeys.length > 1) {
    const childKey = sortKeys.find((v) => v !== dragKey);
    parentNode = getSelectedNode(childKey).parentNode as HTMLElement;
  }
  setOperateState({
    dropNode: parentNode,
    isDropAble: true,
    index: 0,
    isLock: true,
  });
  const isV = isVertical(parentNode);
  const dragIndex = sortKeys.findIndex((v) => v === dragKey);
  const firstNodeRect = getFirstNodeRect(childNodes, parentNode);
  const lastNodeRect = getLastNodeRect(childNodes, parentNode);

  const getNode1Rect = (index) => {
    return getPlaceholder1Rect(index, firstNodeRect, parentNode, childNodes);
  };

  const getNode3Rect = (index) => {
    return getPlaceholder3Rect(index, lastNodeRect, parentNode, childNodes);
  };

  const getNode2Rect = () => {
    if (isV) {
      return {
        width:
          get(placeholderPosition.node1, 'realWidth') ||
          get(placeholderPosition.node3, 'realWidth'),
      };
    } else {
      return {
        height:
          get(placeholderPosition.node1, 'realHeight') ||
          get(placeholderPosition.node3, 'realHeight'),
      };
    }
  };

  if (dragIndex > 0 && dragIndex < sortKeys.length - 1) {
    placeholderPosition.node1 = getNode1Rect(dragIndex);
    placeholderPosition.node3 = getNode3Rect(dragIndex + 1);
    placeholderPosition.node2 = getNode2Rect();
  } else if (dragIndex === 0 && sortKeys.length > 1) {
    placeholderPosition.node3 = getNode3Rect(dragIndex);
    placeholderPosition.node2 = getNode2Rect();
  } else if (dragIndex > 0 && dragIndex === sortKeys.length - 1) {
    placeholderPosition.node1 = getNode1Rect(dragIndex);
    placeholderPosition.node2 = getNode2Rect();
  } else if (sortKeys.length === 1) {
    placeholderPosition.node2 = getNode2Rect();
  }
  placeholderBridgeStore.changePosition(placeholderPosition);
};

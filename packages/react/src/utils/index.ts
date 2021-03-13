import { useEffect, useRef } from 'react';
import { each, get } from 'lodash';
import {
  PageConfigType,
  getComponentConfig,
  getBrickdConfig,
  ChildNodesType,
  getSelector,
} from '@brickd/core';

import { Edge, IE11OrLess } from '@brickd/utils';
import { defaultPropName, selectClassTarget } from '../common/constants';

export const SPECIAL_STRING_CONSTANTS: any = {
  null: null,
};

export function usePrevious<T>(value: any) {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export const iframeSrcDoc = `<!DOCTYPE html>
<html lang="en">
<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=0.5, maximum-scale=2.0, user-scalable=yes" />
<body>
<div id="dnd-container" style="width: 100%;height: 100%"></div>
</body>
</html>
`;

export const isEqualKey = (key: string, selectKey?: string | null) => {
  if (!selectKey) return false;
  return selectKey.includes(key) && parseInt(selectKey) === parseInt(key);
};

export const getIframe = (): HTMLIFrameElement => {
  return document.getElementById('dnd-iframe') as HTMLIFrameElement;
};

export const getComponent = (componentName: string) =>
  get(getBrickdConfig().componentsMap, componentName, componentName);

export function formatUnit(target: string | null) {
  if (target) {
    const result = target.match(/\d+/);
    if (result) {
      return Number.parseInt(result[0]);
    }
  }

  return null;
}

export const getSelectedNode = (
  index='0',
  key?: string | null,
  iframe?: HTMLIFrameElement,
  propName?: string,
): HTMLElement | undefined => {
  if (iframe && key) {
    const { contentDocument } = iframe;
    return contentDocument!.getElementsByClassName(
      index+selectClassTarget + parseInt(key) + (propName ? propName : ''),
    )[0] as HTMLElement;
  }
};

export function generateCSS(
  left: number,
  top: number,
  width?: number,
  height?: number,
) {
  return `
    ${width ? `width:${width}px;` : ''}
    ${height ? `height:${height}px;` : ''}
    display:flex;
    left:${left}px;
    top:${top}px;
  `;
}

export function getElementInfo(
  element: any,
  iframe: HTMLIFrameElement,
  isModal?: boolean,
) {
  const { contentWindow } = iframe;
  const { scrollX = 0, scrollY = 0 } = contentWindow || {};
  const { width, height, left, top } = element.getBoundingClientRect();
  let newLeft = left;
  let newTop = top;
  if (!isModal) {
    newLeft += scrollX;
    newTop += scrollY;
  }
  return {
    width,
    height,
    left: newLeft,
    top: newTop,
    bottom: newTop + height,
    right: newLeft + width,
  };
}

export function getIsModalChild(
  pageConfig: PageConfigType,
  domTreeKeys?: string[],
) {
  if (domTreeKeys) {
    for (const key of domTreeKeys) {
      const { mirrorModalField } =
        getComponentConfig(get(pageConfig, [key, 'componentName'])) || {};
      if (mirrorModalField) return true;
    }
  }
  return false;
}

export function setPosition(nodes: any[], isModal?: boolean) {
  if (isModal) {
    each(nodes, (node) => (node.style.position = 'fixed'));
  } else {
    each(nodes, (node) => (node.style.position = 'absolute'));
  }
}

export function generateRequiredProps(componentName: string) {
  const { propsConfig } = getComponentConfig(componentName);
  const requiredProps: any = {};
  each(propsConfig, (config, propName) => {
    const { isRequired, defaultValue } = config;
    if (isRequired) requiredProps[propName] = defaultValue;
  });

  return requiredProps;
}

export type PropParentNodes = { [propName: string]: HTMLElement };

export const getNodeRealRect = (element: Element) => {
  const eleCSS = css(element);
  const {
    left,
    right,
    top,
    bottom,
    height,
    width,
  } = element.getBoundingClientRect();
  const realWidth =
    parseInt(eleCSS.marginLeft) + parseInt(eleCSS.marginRight) + width;
  const realHeight =
    parseInt(eleCSS.marginTop) + parseInt(eleCSS.marginBottom) + height;

  return { left, right, top, bottom, height, width, realWidth, realHeight };
};

export const getParentNodeRealRect = (parent: Element) => {
  const eleCSS = css(parent);
  const {
    left,
    right,
    top,
    bottom,
    height,
    width,
  } = parent.getBoundingClientRect();
  const realWidth =
    parseInt(eleCSS.width) -
    parseInt(eleCSS.paddingLeft) -
    parseInt(eleCSS.paddingRight) -
    parseInt(eleCSS.borderLeftWidth) -
    parseInt(eleCSS.borderRightWidth);
  const realHeight =
    parseInt(eleCSS.height) -
    parseInt(eleCSS.paddingTop) -
    parseInt(eleCSS.paddingBottom) -
    parseInt(eleCSS.borderTopWidth) -
    parseInt(eleCSS.borderBottomWidth);

  return { left, right, top, bottom, height, width, realHeight, realWidth };
};

export function getChildNodesRects(
  nodeRectsMapRef: any,
  childNodes: ChildNodesType,
  propParentNodes: PropParentNodes,
  isRest?: boolean,
) {
  if (!childNodes) return;
  const nodeRectsMap = nodeRectsMapRef.current;
  function keys2Rects(nodeKeys, propName) {
    const parentNodes = propParentNodes[propName];
    if (!parentNodes) return;
    const childNodes = parentNodes.children;
    each(nodeKeys, (key, index) => {
      if (!childNodes.item(Number.parseInt(index))) return;
      if (!nodeRectsMap[key]) {
        nodeRectsMap[key] = getNodeRealRect(
          childNodes.item(Number.parseInt(index)),
        );
      } else if (isRest) {
        nodeRectsMap[key] = getNodeRealRect(
          childNodes.item(Number.parseInt(index)),
        );
      }
    });
  }
  if (Array.isArray(childNodes)) {
    keys2Rects(childNodes, defaultPropName);
  } else {
    each(childNodes, (nodes, propName) => {
      keys2Rects(nodes, propName);
    });
  }

  nodeRectsMapRef.current = nodeRectsMap as NodeRectsMapType;
}

export const cloneChildNodes = (childNodes?: ChildNodesType) => {
  if (!childNodes) return undefined;
  if (Array.isArray(childNodes)) return [...childNodes];
  const newChildNodes = {};
  for (const propName of Object.keys(childNodes)) {
    newChildNodes[propName] = [...childNodes[propName]];
  }
  return newChildNodes;
};

export interface RealRect {
  realWidth: number;
  realHeight: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
  height: number;
  width: number;
}

export type NodeRectsMapType = { [key: string]: RealRect };
export const dragSort = (
  dragKey: string,
  compareChildren: string[] = [],
  nodeRectsMap: NodeRectsMapType,
  dragOffset: DragEvent,
  propName: string,
  isVertical?: boolean,
) => {
  const {
    left: parentLeft,
    top: parentTop,
    realWidth: parentWidth,
    realHeight: parentHeight,
  } = nodeRectsMap[propName];
  const { offsetX, offsetY } = dragOffset;
  const newChildren = [];
  const { realWidth: dragWidth = 2, realHeight: dragHeight = 2 } =
    nodeRectsMap[dragKey] || {};
  for (let index = 0; index < compareChildren.length; index++) {
    const compareKey = compareChildren[index];
    if (nodeRectsMap[compareKey]) {
      if (compareKey === dragKey) continue;
      const { left, top, realWidth, realHeight, width, height } = nodeRectsMap[
        compareKey
      ];
      const offsetLeft = offsetX - (left - parentLeft);
      const offsetTop = offsetY - (top - parentTop);
      const offsetW = parentWidth - realWidth;
      const offsetH = parentHeight - realHeight;
      console.log(
        'offsetW11>>>>>>',
        isVertical,
        offsetW,
        dragWidth,
        offsetLeft,
      );

      if (!isVertical) {
        console.log('offsetW>>>>>>', offsetW, dragWidth, offsetLeft);
        if (offsetW >= dragWidth) {
          if (offsetLeft > 0) {
            if (offsetLeft <= width * 0.5) {
              newChildren.push(dragKey, ...compareChildren.slice(index));
              break;
            } else if (offsetLeft < width) {
              newChildren.push(
                compareKey,
                dragKey,
                ...compareChildren.slice(index + 1),
              );
              break;
            } else {
              newChildren.push(compareKey);
            }
          } else {
            newChildren.push(dragKey, ...compareChildren.slice(index));
          }
        } else {
          if (offsetTop > 0) {
            if (offsetTop < height * 0.5) {
              newChildren.push(dragKey, ...compareChildren.slice(index));
            } else if (offsetTop < height) {
              newChildren.push(
                compareKey,
                dragKey,
                ...compareChildren.slice(index + 1),
              );
              break;
            } else {
              newChildren.push(compareKey);
            }
          } else {
            newChildren.push(dragKey, ...compareChildren.slice(index));
          }
        }
      } else {
        if (offsetH >= dragHeight) {
          if (offsetTop > 0) {
            if (offsetTop <= height * 0.5) {
              newChildren.push(dragKey, ...compareChildren.slice(index));
              break;
            } else if (offsetTop < height) {
              newChildren.push(
                compareKey,
                dragKey,
                ...compareChildren.slice(index + 1),
              );
              break;
            } else {
              newChildren.push(compareKey);
            }
          } else {
            newChildren.push(dragKey, ...compareChildren.slice(index));
          }
        } else {
          if (offsetLeft > 0) {
            if (offsetLeft < width * 0.5) {
              newChildren.push(dragKey, ...compareChildren.slice(index));
            } else if (offsetLeft < width) {
              newChildren.push(
                compareKey,
                dragKey,
                ...compareChildren.slice(index + 1),
              );
              break;
            } else {
              newChildren.push(compareKey);
            }
          } else {
            newChildren.push(dragKey, ...compareChildren.slice(index));
          }
        }
      }
    }
  }
  if (!newChildren.includes(dragKey)) {
    newChildren.push(dragKey);
  }
  return [...new Set(newChildren)];
};

export const getPropParentNodes = (
  childNodes: ChildNodesType,
  parentNodes: PropParentNodes,
  parentKey: string,
  index='0'
) => {
  const iframe = getIframe();
  if (Array.isArray(childNodes)) {
    for (const childKey of childNodes) {
      const node = getSelectedNode(  index='0',childKey, iframe);
      if (node) {
        const parentNode = node.parentElement;
        parentNode.className +=
          ` ` + index+selectClassTarget + parentKey + defaultPropName;
        parentNodes[defaultPropName] = parentNode;
        break;
      }
    }
  } else {
    each(childNodes, (nodes, propName) => {
      if (!parentNodes[propName]) {
        for (const key of nodes) {
          const node = getSelectedNode(index,key, iframe);
          if (node) {
            const parentNode = node.parentElement;
            parentNode.className +=
              ` ` + index+selectClassTarget + parentKey + propName;
            parentNodes[propName] = parentNode;
            break;
          }
        }
      }
    });
  }

  return parentNodes;
};

export const getDragKey = () =>
  get(getSelector(['dragSource']), ['dragSource', 'dragKey']);
export const getDragSourceVDom = () =>
  get(getSelector(['dragSource']), ['dragSource', 'vDOMCollection'], {});

export function css(el) {
  const style = el && el.style;
  const iframe = getIframe();
  const { contentWindow } = iframe;
  if (style) {
    let cssResult;
    if (contentWindow.getComputedStyle) {
      cssResult = contentWindow.getComputedStyle(el, '');
    } else if (el.currentStyle) {
      cssResult = el.currentStyle;
    }
    return cssResult;
  }
}

function getChild(el, childNum) {
  let currentChild = 0,
    i = 0;
  const children = el.children;
  while (i < children.length) {
    if (children[i].style.display !== 'none') {
      if (currentChild === childNum) {
        return children[i];
      }
      currentChild++;
    }

    i++;
  }
  return null;
}

export const CSSFloatProperty = Edge || IE11OrLess ? 'cssFloat' : 'float';

export function isVertical(el) {
  const elCSS = css(el),
    elWidth =
      parseInt(elCSS.width) -
      parseInt(elCSS.paddingLeft) -
      parseInt(elCSS.paddingRight) -
      parseInt(elCSS.borderLeftWidth) -
      parseInt(elCSS.borderRightWidth),
    child1 = getChild(el, 0),
    child2 = getChild(el, 1),
    firstChildCSS = child1 && css(child1),
    secondChildCSS = child2 && css(child2),
    firstChildWidth =
      firstChildCSS &&
      parseInt(firstChildCSS.marginLeft) +
        parseInt(firstChildCSS.marginRight) +
        child1.getBoundingClientRect().width,
    secondChildWidth =
      secondChildCSS &&
      parseInt(secondChildCSS.marginLeft) +
        parseInt(secondChildCSS.marginRight) +
        child2.getBoundingClientRect().width;

  if (elCSS.display === 'flex') {
    return (
      elCSS.flexDirection === 'column' ||
      elCSS.flexDirection === 'column-reverse'
    );
  }

  if (elCSS.display === 'grid') {
    return elCSS.gridTemplateColumns.split(' ').length <= 1;
  }

  if (child1 && get(firstChildCSS, 'float') !== 'none') {
    const touchingSideChild2 =
      firstChildCSS.float === 'left' ? 'left' : 'right';

    return (
      child2 &&
      (secondChildCSS.clear === 'both' ||
        secondChildCSS.clear === touchingSideChild2)
    );
  }

  return (
    child1 &&
    (firstChildCSS.display === 'block' ||
      firstChildCSS.display === 'flex' ||
      firstChildCSS.display === 'table' ||
      firstChildCSS.display === 'grid' ||
      (firstChildWidth >= elWidth && elCSS[CSSFloatProperty] === 'none') ||
      (child2 &&
        elCSS[CSSFloatProperty] === 'none' &&
        firstChildWidth + secondChildWidth > elWidth))
  );
}

import React, { useEffect, useRef } from 'react';
import { each, get } from 'lodash';
import {
  PageConfigType,
  getComponentConfig,
  getBrickdConfig,
  ChildNodesType,
  getSelector,
  getStore,
  getDragSource,
  getDropTarget,
} from '@brickd/core';

import { Edge, IE11OrLess, VirtualDOMType } from '@brickd/utils';
import { formatUnit } from '@brickd/hooks';
import { getIframe } from './caches';
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

export const getComponent = (componentName: string) =>
  get(getBrickdConfig().componentsMap, componentName, componentName);

export const getSelectedNode = (
  key?: string | null,
  index = 0,
): HTMLElement | undefined => {
  const iframe = getIframe();
  if (iframe && key) {
    const { contentDocument } = iframe;
    let node=contentDocument!.getElementsByClassName(
      selectClassTarget + key + '-' + index,
    )[0] as HTMLElement;
    if(!node) {
      node=contentDocument!.getElementsByClassName(
        selectClassTarget + key,
      )[0] as HTMLElement;
    }
    return node;
  }
};

export const getNodeFromClassName = (className: string) => {
  const iframe = getIframe();
  if (iframe) {
    const { contentDocument } = iframe;
    return contentDocument!.getElementsByClassName(className)[0] as HTMLElement;
  }
};

export function setCss(target: HTMLElement, css: any) {
  each(css, (v, k) => {
    target.style[k] = v;
  });
}

export function generateCSS(
  left?: number,
  top?: number,
  width?: number,
  height?: number,
) {
  return `
    ${width !== undefined ? `width:${width}px;` : ''}
    ${height !== undefined ? `height:${height}px;` : ''}
    display:flex;
    ${left !== undefined ? `left:${left}px;` : ''}
    ${top !== undefined ? `top:${top}px;` : ''}
  `;
}

export function getElementInfo(element: any, isModal?: boolean) {
  const { contentWindow } = getIframe();
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
  if (!element) return;
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
      const childNode = childNodes[index];
      if (!childNode || EXCLUDE_POSITION.includes(css(childNode).position))
        return;
      if (!nodeRectsMap[key]) {
        nodeRectsMap[key] = getNodeRealRect(childNode);
      } else if (isRest) {
        nodeRectsMap[key] = getNodeRealRect(childNode);
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

export const classNameTemplate = 'brick-design';

export const getParentKeyNodes = (parent: Element, key: string) => {
  return parent.getElementsByClassName(key + classNameTemplate);
};

export const getParentKeyNodesRect = (parent: Element, key: string) => {
  const nodes = getParentKeyNodes(parent, key);
  if (
    !nodes.length ||
    EXCLUDE_POSITION.includes(get(css(nodes[0]), 'position'))
  ) {
    return {};
  } else if (nodes.length === 1) {
    return getNodeRealRect(nodes[0]);
  } else {
    const first = getNodeRealRect(nodes[0]);
    const last = getNodeRealRect(nodes[nodes.length - 1]);
    return {
      left: first.left,
      top: first.top,
      width: last.left - first.left + first.width,
      height: last.top - first.top + first.height,
      realWidth: last.left - first.left + first.realWidth,
      realHeight: last.top - first.top + first.realHeight,
    };
  }
};

export const getPropParentNodes = (
  childNodes: ChildNodesType,
  parentNodes: PropParentNodes,
  index = 0,
) => {
  if (Array.isArray(childNodes)) {
    for (const childKey of childNodes) {
      const node = getSelectedNode(childKey, index);
      if (node) {
        const parentNode = node.parentElement;
        parentNodes[defaultPropName] = parentNode;
        break;
      }
    }
  } else {
    each(childNodes, (nodes, propName) => {
      if (!parentNodes[propName]) {
        for (const key of nodes) {
          const node = getSelectedNode(key, index);
          if (node) {
            const parentNode = node.parentElement;
            parentNodes[propName] = parentNode;
            break;
          }
        }
      }
    });
  }
};
/**
 * 获取拖拽组件的key
 */
export const getDragKey = () => getDragSourceFromKey('dragKey');
/**
 * 获取拖放组件的key
 */
export const getDropKey = () => get(getDropTarget(), 'dropKey');

/**
 * 从拖拽源中获取指定的属性值
 * @param propName
 * @param defaultValue
 */
export const getDragSourceFromKey = (propName: string, defaultValue?: any) =>
  get(getDragSource(), propName, defaultValue);
/**
 * 获取拖拽组件的组件名
 * @param dragKey
 */
export const getDragComponentName = (dragKey?: string) =>
  get(getSelector(['pageConfig']), [
    'pageConfig',
    dragKey || getDragKey(),
    'componentName',
  ]) ||
  get(getDragSourceFromKey('template'), [
    dragKey || getDragKey(),
    'componentName',
  ]);
/**
 * 获取指定key 的虚拟dom
 * @param nodeKey
 */
export const getVNode = (nodeKey: string) =>
  (get(getSelector(['pageConfig']), ['pageConfig', nodeKey]) ||
    get(getDragSourceFromKey('template'), nodeKey) ||
    {}) as VirtualDOMType;

export function css(el): CSSStyleDeclaration {
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

export const EXCLUDE_POSITION = ['absolute', 'fixed'];

function getChild(el, childNum) {
  let currentChild = 0,
    i = 0;
  const children = el.children;
  while (i < children.length) {
    const node = children[i];
    if (
      css(node).display !== 'none' ||
      !EXCLUDE_POSITION.includes(css(node).position)
    ) {
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

export const isNeedJudgeFather = (dragKey?: string) => {
  const componentName = getDragComponentName(dragKey);
  const fatherNodesRule = get(
    getComponentConfig(componentName),
    'fatherNodesRule',
  );
  return !!fatherNodesRule;
};

export const isAllowDrop = (childNodesRule?: string[]) => {
  if (!childNodesRule) return true;
  return childNodesRule.includes(getDragComponentName());
};

export function isAllowAdd(targetComponentName: string, dragKey?: string) {
  const fatherNodesRule = get(
    getComponentConfig(getDragComponentName(dragKey)),
    'fatherNodesRule',
  );
  return !fatherNodesRule || fatherNodesRule.includes(targetComponentName);
}

export function getScalePosition(
  canvas: HTMLElement,
  canvasContainer: HTMLElement,
  scale: number,
) {
  const { top: brickdTop, left: brickdLeft } = canvas.getBoundingClientRect();
  const { width, height, top, left } = canvasContainer.getBoundingClientRect();

  return {
    width: width / scale,
    height: height / scale,
    top: (brickdTop - top) / scale,
    left: (brickdLeft - left) / scale,
  };
}

export const firstToUpper = (str: string) => {
  return str.replace(/\b(\w)(\w*)/g, function ($0, $1, $2) {
    return $1.toUpperCase() + $2;
  });
};

export const changeElPositionAndSize = (el: HTMLElement, css: any) => {
  each(css, (v, k) => {
    if (typeof v === 'number') {
      el.style[k] = v + 'px';
    } else {
      el.style[k] = v;
    }
  });
};

/**
 * 解析matrix矩阵，0°-360°，返回旋转角度
 * 当a=b||-a=b,0<=deg<=180
 * 当-a+b=180,180<=deg<=270
 * 当a+b=180,270<=deg<=360
 *
 * 当0<=deg<=180,deg=d;
 * 当180<deg<=270,deg=180+c;
 * 当270<deg<=360,deg=360-(c||d);
 * */
export function getMatrix(transform: string) {
  if (!transform.includes('matrix')) return 0;
  const [a, b, c, d] = transform
    .replace('matrix(', '')
    .replace(')', '')
    .split(',');
  const aa = Math.round((180 * Math.asin(Number(a))) / Math.PI);
  const bb = Math.round((180 * Math.acos(Number(b))) / Math.PI);
  const cc = Math.round((180 * Math.asin(Number(c))) / Math.PI);
  const dd = Math.round((180 * Math.acos(Number(d))) / Math.PI);
  let deg = 0;
  if (aa == bb || -aa == bb) {
    deg = dd;
  } else if (-aa + bb == 180) {
    deg = 180 + cc;
  } else if (aa + bb == 180) {
    deg = 360 - cc || 360 - dd;
  }
  return deg >= 360 ? 0 : deg;
}

export const analysisTransformOrigin = (transformOrigin: string) => {
  const position = transformOrigin.split(' ');

  return { top: formatUnit(position[0]), left: formatUnit(position[1]) };
};

export const getRootState = () => getStore().getState();

export function getDragAngle(
  event: React.MouseEvent | MouseEvent,
  centerX: number,
  centerY: number,
) {
  return Math.atan2(event.clientY - centerY, event.clientX - centerX);
}

export function getDegToRad(transform: string) {
  // const deg=getMatrix(transform)*Math.PI/180;
  let deg = getMatrix(transform);
  if (228 < deg && deg <= 360) {
    deg = deg - 360;
  }
  return (deg * Math.PI) / 180;
}

export function getFatherRotate(selectedNode: any, rotate = 0) {
  if (selectedNode.parentNode) {
    const { transform } = css(selectedNode.parentNode) || {};
    if (!transform) return rotate;
    rotate += getMatrix(transform);
    return getFatherRotate(selectedNode.parentNode, rotate);
  }
  return rotate;
}

export const getTransform = (Transform: string, fatherRotate: number) => {
  const deg = getMatrix(Transform);
  return `rotate(${deg + fatherRotate}deg)`;
};

export const isDragMove=(width:number,height:number,offsetX:number,offsetY:number)=>{
  const halfWidth=width/2;
  const halfHeight=height/2;
  const thresholdWidth=halfWidth*0.7;
  const thresholdHeight=halfHeight*0.7;
  if((halfWidth-offsetX>=0&&halfWidth-offsetX<thresholdWidth||
    offsetX-halfWidth>=0&&offsetX-halfWidth<thresholdWidth)&&
    (halfHeight-offsetY>=0&&halfHeight-offsetY<thresholdHeight||
      offsetY-halfHeight>=0&&offsetY-halfHeight<thresholdHeight)){
    return true;
  }
  return false;
};


export function isInViewPort(element){
  const {contentWindow,contentDocument}=getIframe();
  const viewWidth = contentWindow.innerWidth||contentDocument.documentElement.clientWidth;
  const viewHeight=contentWindow.innerHeight||contentDocument.documentElement.clientHeight;
  if(!element) return true;
  const{
    top,
    right,
    bottom,
    left,
  }=element.getBoundingClientRect();

  return(
    top>=0&&
    left>=0&&
    right<=viewWidth&&
    bottom<=viewHeight
  );
}

export const elementScrollConfig={
  isLock:false
};

export function nodeScrollIntoView(selectedNode){
  if(elementScrollConfig.isLock) return;
    setTimeout(()=>selectedNode.scrollIntoViewIfNeeded(),300);
}

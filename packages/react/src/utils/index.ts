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
  key?: string | null,
  iframe?: HTMLIFrameElement,
): HTMLElement | undefined => {
  if (iframe && key) {
    const { contentDocument } = iframe;
    return contentDocument!.getElementsByClassName(
      selectClassTarget + key,
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
      const childNode=childNodes[index];
      if (!childNode||EXCLUDE_POSITION.includes(css(childNode).position)) return;
      if (!nodeRectsMap[key]) {
        nodeRectsMap[key] = getNodeRealRect(
          childNode
        );
      } else if (isRest) {
        nodeRectsMap[key] = getNodeRealRect(
          childNode
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
  compareChildren: string[] = [],
  parentNode: Element,
  dragOffset: DragEvent,
  isVertical?: boolean,
) => {
  const dragKey=getDragKey();
  if(!dragKey) return  compareChildren;
  const {
    realWidth: parentWidth,
    realHeight: parentHeight,
  } = getParentNodeRealRect(parentNode);
  const { clientX, clientY } = dragOffset;
  const newChildren = [];
  for (let index = 0; index < compareChildren.length; index++) {
    const compareKey = compareChildren[index];
    if(compareKey===dragKey) continue;
    const childNode=parentNode.children[index];
    if(EXCLUDE_POSITION.includes(get(css(childNode),'position'))){
      newChildren.push(compareKey);
      continue;
    }
    console.log('childNode>>>>>>>',childNode);
    const childRect=getNodeRealRect(childNode);
      const { left, top, realWidth, realHeight, width, height } = childRect;
      const offsetLeft = clientX -left;
      const offsetTop = clientY -top;
      const offsetW = parentWidth - realWidth;
      const offsetH = parentHeight - realHeight;
      if (!isVertical) {
        if (offsetW > 0) {
          if (offsetLeft > 0) {
            if (offsetLeft <= width * 0.5) {

              newChildren.push(dragKey, ...compareChildren.slice(index));
              break;
            } else if (offsetLeft < width&&offsetLeft>width*0.5) {
              newChildren.push(
                compareKey,
                dragKey,
                ...compareChildren.slice(index+1),
              );
              break;
            } else {
              newChildren.push(compareKey);

            }
          } else {
            newChildren.push(dragKey, ...compareChildren.slice(index));

            break;
          }
        } else {
          if (offsetTop > 0) {
            if (offsetTop < height * 0.5) {
              newChildren.push(dragKey, ...compareChildren.slice(index));

              break;
            } else if (offsetTop < height&&offsetTop>height*0.5) {
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

            break;
          }
        }
      } else {
        if (offsetH >0) {
          if (offsetTop > 0) {
            if (offsetTop <= height * 0.5) {
              newChildren.push(dragKey, ...compareChildren.slice(index));

              break;
            } else if (offsetTop < height&&offsetTop>height*0.5) {

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

            break;
          }
        } else {
          if (offsetLeft > 0) {
            if (offsetLeft < width * 0.5) {
              newChildren.push(dragKey, ...compareChildren.slice(index));

              break;
            } else if (offsetLeft < width&&offsetLeft > width*0.5) {
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

            break;
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
  index = 0,
) => {
  const iframe = getIframe();
  if (Array.isArray(childNodes)) {
    for (const childKey of childNodes) {
      const node = getSelectedNode(`${childKey}-${index}`, iframe);
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
          const node = getSelectedNode(`${key}-${index}`, iframe);
          if (node) {
            const parentNode = node.parentElement;
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
export const getDragComponentName=(dragKey?:string)=>get(getSelector(['pageConfig']), ['pageConfig',dragKey||getDragKey(),'componentName']);
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

export const EXCLUDE_POSITION=['absolute','fixed'];

function getChild(el, childNum) {
  let currentChild = 0, i = 0;
  const children = el.children;
  while (i < children.length) {
    const node=children[i];
    if (css(node).display !== 'none'||!EXCLUDE_POSITION.includes(css(node).position)) {
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

export const isNeedJudgeFather=(dragKey?:string)=>{
  const componentName= getDragComponentName(dragKey);
  const fatherNodesRule = get(getComponentConfig(componentName),'fatherNodesRule');
  return !!fatherNodesRule;
};

export const isAllowDrop=(childNodesRule?:string[])=>{
  if(!childNodesRule) return  true;
  const componentName= getDragComponentName();
  return childNodesRule.includes(componentName);
};

export function isAllowAdd(targetComponentName:string,dragKey?:string){
 const componentName= getDragComponentName(dragKey);
  const fatherNodesRule=get(getComponentConfig(componentName),'fatherNodesRule');
  if(!fatherNodesRule) return false;
  if(fatherNodesRule){
    for(const father of fatherNodesRule) {
      if(father.includes(targetComponentName)){
        return  true;
      }
    }
  }


}

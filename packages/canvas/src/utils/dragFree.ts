import { get, each, find, isEqual } from 'lodash';
import { getNodeRealRect, getSelectedNode, getVNode } from './utils';

export function unique(array, compare = (a, b) => a === b) {
  const result = [];
  for (let i = 0, len = array.length; i < len; i++) {
    const current = array[i];
    if (result.findIndex((v) => compare(v, current)) === -1) {
      result.push(current);
    }
  }
  return result;
}

type ValueType = { k: string; value: number; origin: number; length: number };

export const checkArrayWithPush = (target, dist: number, value: ValueType) => {
  if (Array.isArray(target[dist])) {
    target[dist].push(value);
  } else {
    target[dist] = [value];
  }
};

export const createCoreData = (
  { node, deltaX, deltaY },
  { originX, originY, x, y },
) => {
  return {
    node,
    deltaY,
    deltaX,
    originX: originX || x,
    originY: originY || y,
    x,
    y,
  };
};

export const getMaxDistance = (arr) => {
  const num = arr.sort((a, b) => a - b);
  return num[num.length - 1] - num[0];
};

export const canDragX = (axis) => axis === 'both' || axis === 'x';

export const canDragY = (axis) => axis === 'both' || axis === 'y';

export const checkOverlapRectangles = (
  { x: x1, y: y1, w: w1, h: h1 },
  { x: x2, y: y2, w: w2, h: h2 },
) => {
  return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
};

type ChildNodeRectType = {
  k: string;
  x: number;
  y: number;
  w: number;
  h: number;
  l: number;
  r: number;
  t: number;
  b: number;
  lr: number;
  tb: number;
};

let childNodeRects: { [k: string]: ChildNodeRectType } | null = null,
  lastXpostion = null,
  lastYpostion = null;

/**
 * 初始化获取所有组件的信息
 * @param parentKey
 * @param propName
 */
export const initialize = (parentKey: string, propName?: string) => {
  freeGuideLinesStore.changeShowDragLine(true);
  const childNodes = get(
    getVNode(parentKey),
    propName ? `childNodes.${propName}` : 'childNodes',
    [],
  );
  childNodeRects = {};
  let parentRect = null;
  each(childNodes, (k) => {
    const node = getSelectedNode(k);
    if(!parentRect){
      parentRect=getNodeRealRect(node.parentElement);
    }
    const { width: w, height: h, top, left } = getNodeRealRect(node);
    const y = top - parentRect.top,
      x = left - parentRect.left;
    childNodeRects[k] = {
      k,
      x,
      y,
      w,
      h,
      l: x,
      r: x + w,
      t: y,
      b: y + h,
      lr: x + w / 2,
      tb: y + h / 2,
    };
  });
};
type DragFreeConfigType = {
  limit: boolean;
  directions: string[];
  threshold: number;
  detectOverlap: boolean;
};
let dragFreeConfig: DragFreeConfigType = {
  limit: false,
  directions: ['tt', 'bb', 'll', 'rr', 'tb', 'lr', 'rl', 'mv', 'mh'],
  threshold: 5,
  detectOverlap: false,
};

export const setDragFreeConfig = (config: DragFreeConfigType) => {
  dragFreeConfig = { ...dragFreeConfig, ...config };
};

// 拖动中计算是否吸附/显示辅助线
// Calculate whether to adsorb/display auxiliary lines while dragging
export const freeCalc = (x: number, y: number, k: string) => {
  const target = childNodeRects[k];
  if (dragFreeConfig.limit) {
    const { limitX, limitY } = checkDragOut({ x, y }, target);
    x = limitX;
    y = limitY;
  }

  if (dragFreeConfig.detectOverlap) {
    if (checkOverlap({ x, y }, target)) {
      if (lastXpostion === null) {
        lastXpostion = x;
        lastYpostion = y;
      }
      return { x: lastXpostion, y: lastYpostion };
    }
  }
  lastXpostion = null;
  lastYpostion = null;

  if (Object.keys(childNodeRects).length === 1) {
    return { x, y };
  }

  calcAndDrawLines({ x, y }, target);
};

const checkOverlap = ({ x, y }: PositionType, target: ChildNodeRectType) => {
  for (const [k, value] of Object.entries(childNodeRects)) {
    if (k === target.k) continue;

    if (checkOverlapRectangles({ ...target, ...{ x, y } }, value)) return true;
  }
  return false;
};

const calcLineValues = (
  values: PositionType,
  target: ChildNodeRectType,
  compare: ChildNodeRectType,
  key: string,
) => {
  const { x, y } = values;
  const { h: H, w: W } = target;
  const { l, r, t, b } = compare;
  console.log('calcLineValues>>>>>>>>', values, target, compare);
  const T = y,
    B = y + H,
    L = x,
    R = x + W;

  const direValues = {
    x: [t, b, T, B],
    y: [l, r, L, R],
  };

  const length = getMaxDistance(direValues[key]);
  const origin = Math.min(...direValues[key]);
  return { length, origin };
};

const calcAndDrawLines = (values: PositionType, target: ChildNodeRectType) => {
  const { v: x, lines: vLines } = calcPosValues(values, target, 'x');
  const { v: y, lines: hLines } = calcPosValues(values, target, 'y');

  if (vLines.length && hLines.length) {
    each(vLines, (line) => {
      const compare = find(childNodeRects, ({ k }) => k === line.k);
      const { length, origin } = calcLineValues({ x, y }, target, compare, 'x');

      line.length = length;
      line.origin = origin;
    });

    each(hLines, (line) => {
      const compare = find(childNodeRects, ({ k }) => k === line.k);
      const { length, origin } = calcLineValues({ x, y }, target, compare, 'y');
      line.length = length;
      line.origin = origin;
    });
  }

  freeGuideLinesStore.changePosition({ vLines, hLines });
  // todo
  // this.setState({
  // 	vLines,
  // 	hLines,
  // 	indices,
  // });
};

const calcPosValues = (
  values: PositionType,
  target: ChildNodeRectType,
  key: string,
) => {
  const results: { [k: string]: ValueType[] } = {};

  const directionsInit = {
    x: ['ll', 'rr', 'lr', 'rl', 'mh'],
    y: ['tt', 'bb', 'tb', 'mv'],
  };

  const validDirections = directionsInit[key].filter((dire: string) =>
    dragFreeConfig.directions.includes(dire),
  );

  each(childNodeRects, (compare, k) => {
    if (k === target.k) return;
    validDirections.forEach((dire) => {
      const { near, dist, value, origin, length } = calcPosValuesSingle(
        values,
        dire,
        target,
        compare,
        key,
      );
      if (near) {
        checkArrayWithPush(results, dist, {
          k: compare.k,
          value,
          origin,
          length,
        });
      }
    });
  });

  const resultArray = Object.entries(results);
  if (resultArray.length) {
    const [minDistance, activeCompares] = resultArray.sort(
      ([dist1], [dist2]) => Math.abs(Number(dist1)) - Math.abs(Number(dist2)),
    )[0];
    const dist = parseInt(minDistance);
    return {
      v: values[key] - dist,
      dist: dist,
      lines: activeCompares,
    };
  }

  return {
    v: values[key],
    dist: 0,
    lines: [],
  };
};

const calcPosValuesSingle = (
  values: PositionType,
  dire: string,
  target: ChildNodeRectType,
  compare: ChildNodeRectType,
  key: string,
) => {
  const { x, y } = values;
  const W = target.w;
  const H = target.h;
  const { l, r, t, b, lr, tb, x: xCompare } = compare;
  const { origin, length } = calcLineValues(values, target, compare, key);

  const result = {
    // 距离是否达到吸附阈值
    // Whether the distance reaches the adsorption threshold
    near: false,
    // 距离差
    // Distance difference
    dist: Number.MAX_SAFE_INTEGER,
    // 辅助线坐标
    // Auxiliary line coordinates
    value: 0,
    // 辅助线长度
    length,
    // 辅助线起始坐标（对应绝对定位的top/left）
    // Starting coordinates of auxiliary line (corresponding to top/left of absolute positioning)
    origin,
  };

  switch (dire) {
    case 'lr': {
      const sides = [];
      sides.push({ dist: x - r, value: r }); // right side
      sides.push({ dist: x + W - xCompare, value: l }); // left side
      sides.forEach((side) => {
        if (Math.abs(side.dist) < Math.abs(result.dist)) {
          result.dist = side.dist;
          result.value = side.value;
        }
      });
      break;
    }
    case 'll':
      result.dist = x - l;
      result.value = l;
      break;
    case 'rr':
      result.dist = x + W - r;
      result.value = r;
      break;
    case 'tt':
      result.dist = y - t;
      result.value = t;
      break;
    case 'bb':
      result.dist = y + H - b;
      result.value = b;
      break;
    case 'tb': {
      const sides = [];
      sides.push({ dist: y + H - t, value: t }); // top side
      sides.push({ dist: y - b, value: b }); // bottom side
      sides.forEach((side) => {
        if (Math.abs(side.dist) < Math.abs(result.dist)) {
          result.dist = side.dist;
          result.value = side.value;
        }
      });
      break;
    }
    case 'mv': // middle vertical
      result.dist = y + H / 2 - tb;
      result.value = tb;
      break;
    case 'mh': // middle horizontal
      result.dist = x + W / 2 - lr;
      result.value = lr;
      break;
  }

  if (Math.abs(result.dist) < dragFreeConfig.threshold + 1) {
    result.near = true;
  }

  return result;
};

type PositionType = { x: number; y: number };

// 检查是否拖出容器
// Check if you drag out the container
const checkDragOut = ({ x, y }: PositionType, target: ChildNodeRectType) => {
  const maxLeft = 100 - target.w;
  const maxTop = 100 - target.h;

  let limitX = x;
  let limitY = y;

  if (x < 0) {
    limitX = 0;
  } else if (x > maxLeft) {
    limitX = maxLeft;
  }

  if (y < 0) {
    limitY = 0;
  }
  if (y > maxTop) {
    limitY = maxTop;
  }

  return { limitX, limitY };
};

type FreeGuideLinesType = {
  vLines: ValueType[];
  hLines: ValueType[];
};

export const resetGuideLines=()=>{
  freeGuideLinesStore.changeShowDragLine(false);
  freeGuideLinesStore.changePosition({vLines:[],hLines:[]});
};

export const freeGuideLinesStore = {
  state: null,
  renderGuideLines: null,
  showDragLine:null,
  changePosition(state: FreeGuideLinesType) {
    if (!isEqual(this.state, state)) {
      this.state = state;
      this.renderGuideLines && this.renderGuideLines(state);
    }
  },
  changeShowDragLine(isShow:boolean){
    this.showDragLine && this.showDragLine(isShow);

  }
};

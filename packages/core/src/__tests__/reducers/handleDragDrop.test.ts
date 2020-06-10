import { reducer } from '../../reducers';
import ACTION_TYPES from '../../actions/actionTypes';
import { DragSourcePayload } from '../../actions';
import { LEGO_BRIDGE, legoState } from '../../store';
import config from '../configs';
import { flattenDeepArray } from '../../utils';
import { ComponentConfigsType, DropTargetType, StateType } from '../../types';

beforeAll(() => {
  LEGO_BRIDGE.config = config;
  LEGO_BRIDGE.containers = flattenDeepArray(config.CONTAINER_CATEGORY);
});

afterAll(() => {
  LEGO_BRIDGE.config = undefined;
  LEGO_BRIDGE.containers = null;
});


describe('drag', () => {
  const action = { type: ACTION_TYPES.getDragSource };
  it('当componentConfigs没有root节点拖拽容器组件', () => {
    const payload: DragSourcePayload = { componentName: 'a' };
    const state = reducer(legoState, { ...action, payload });
    expect(state.dragSource).toEqual({ vDOMCollection: { root: { componentName: 'a' } } });
  });
  it('当componentConfigs没有root节点拖拽非容器组件', () => {
    const payload: DragSourcePayload = { componentName: 'img' };
    const state = reducer(legoState, { ...action, payload });
    expect(state.dragSource).toEqual({ vDOMCollection: { root: { componentName: 'img' } } });
  });
  it('当componentConfigs有root节点', () => {
    const payload: DragSourcePayload = { componentName: 'span' };
    const componentConfigs: ComponentConfigsType = { root: { componentName: 'a' } };
    const prevState: StateType = { ...legoState, componentConfigs };

    const state = reducer(prevState, { ...action, payload });
    expect(state.dragSource?.dragKey).not.toBeUndefined();
    expect(state.undo).toEqual([{ componentConfigs, propsConfigSheet: {} }]);
  });

  it('拖拽设计面板中的组建', () => {
    const prevState: StateType = {
      ...legoState,
      componentConfigs: {
        root: { componentName: 'a', childNodes: ['1'] },
        1: { componentName: 'a', },
      },
    };
    const payload: DragSourcePayload = { dragKey: '1', parentKey: 'root' };
    const nextState = reducer(prevState, { ...action, payload });
    expect(nextState.dragSource?.dragKey).toBe('1');

  });
  it('拖拽添加模板配置信息', () => {
    const prevState: StateType = {
      ...legoState,
      componentConfigs: {
        root: { componentName: 'a' },
      },
    };
    const payload: DragSourcePayload = {
      vDOMCollection: {
        root: { componentName: 'a', childNodes: ['1'] },
        1: { componentName: 'span', childNodes: { children: ['2'], test: ['3'] } },
        2: { componentName: 'img' },
        3: { componentName: 'a', childNodes: ['4'] },
        4: { componentName: 'img' },
      }, propsConfigCollection: {
        'root': {},
        2: {},
        3: {},
        4: '2',
      },
    };
    const state = reducer(prevState, { ...action, payload });
    expect(Object.keys(state.componentConfigs).length).toBe(6);
    expect(Object.keys(state.componentConfigs)).toEqual(
      expect.arrayContaining(Object.keys(state.propsConfigSheet)),
    );

  });
});

describe('getDropTarget', () => {
  const payload: DropTargetType = { selectedKey: '1',domTreeKeys:[] };
  const action = { type: ACTION_TYPES.getDropTarget, payload };
  // it('如果拖拽组件(非容器)与drop组件是同一个', () => {
  //   const prevState: StateType = {
  //     ...legoState,
  //     componentConfigs: {
  //       root: { componentName: 'a', props: {}, childNodes: ['1'] },
  //       1: { componentName: 'img', props: {} },
  //     },
  //     dragSource: { dragKey: '1', parentKey: 'root' },
  //   };
  //
  //   const nextState = reducer(prevState, action);
  //   expect(nextState).toBe(prevState);
  // });

  it('当有选中组件时触发dop', () => {
    const prevState: StateType = {
      ...legoState,
      selectedInfo: { selectedKey: '1', domTreeKeys: [], parentKey: '', propsConfig: {} },
    };
    const nextState = reducer(prevState, action);
    expect(nextState).toBe(prevState);
  });

  // it('当drop组件为非容器组件', () => {
  //   const prevState: StateType = { ...legoState, dropTarget: { selectedKey: '2', domTreeKeys: [] } };
  //   const nextState = reducer(prevState, action);
  //   expect(nextState.dropTarget).toBeNull();
  // });

  it('当drop组件为容器组件', () => {
    const payload: DropTargetType = { selectedKey: '1', domTreeKeys: ['root'] };
    const nextState = reducer(legoState, { ...action, payload });
    expect(nextState).toEqual({ ...legoState, dropTarget: payload, hoverKey: '1' });
  });
});

describe('clearDropTarget', () => {
  const action = { type: ACTION_TYPES.clearDropTarget };
  it('清除DropTarget', () => {
    const prevState: StateType = {
      ...legoState,
      dropTarget: { selectedKey: 'root', domTreeKeys: [] },
      hoverKey: 'root',
    };
    const state = reducer(prevState, action);
    expect(state).toEqual(legoState);
  });
});

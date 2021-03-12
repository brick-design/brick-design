import { reducer } from '../../reducers';
import ACTION_TYPES from '../../actions/actionTypes';
import { DragSourcePayload } from '../../actions';
import { legoState } from '../../reducers/handlePageBrickdState';
import config from '../configs';
import { ROOT, setBrickdConfig, setPageName } from '../../utils';
import { PageConfigType, DropTargetType, StateType } from '../../types';

beforeAll(() => {
  setBrickdConfig(config);
  setPageName('initPage');
});

afterAll(() => {
  setBrickdConfig(null);
  setPageName(null);
});

describe('drag', () => {
  const action = { type: ACTION_TYPES.getDragSource };
  it('当componentConfigs没有root节点拖拽容器组件', () => {
    const payload: DragSourcePayload = { componentName: 'a' };
    const state = reducer({ initPage: legoState }, { ...action, payload });
    expect((state.initPage as StateType).dragSource).toEqual({
      dragKey: ROOT,
      vDOMCollection: { [ROOT]: { componentName: 'a' } },
    });
  });
  it('当componentConfigs没有root节点拖拽非容器组件', () => {
    const payload: DragSourcePayload = { componentName: 'img' };
    const state = reducer({ initPage: legoState }, { ...action, payload });
    expect((state.initPage as StateType).dragSource).toEqual({
      dragKey: ROOT,
      vDOMCollection: { [ROOT]: { componentName: 'img' } },
    });
  });
  it('当componentConfigs有root节点', () => {
    const payload: DragSourcePayload = { componentName: 'span' };
    const pageConfig: PageConfigType = {
      [ROOT]: { componentName: 'a' },
    };
    const prevState: StateType = { ...legoState, pageConfig };

    const state = reducer({ initPage: prevState }, { ...action, payload });
    expect(
      (state.initPage as StateType).dragSource?.dragKey,
    ).not.toBeUndefined();
    expect((state.initPage as StateType).undo).toEqual([{ pageConfig }]);
  });

  it('拖拽设计面板中的组建', () => {
    const prevState: StateType = {
      ...legoState,
      pageConfig: {
        [ROOT]: { componentName: 'a', childNodes: ['1'] },
        1: { componentName: 'a' },
      },
    };
    const payload: DragSourcePayload = { dragKey: '1', parentKey: ROOT };
    const nextState = reducer({ initPage: prevState }, { ...action, payload });
    expect((nextState.initPage as StateType).dragSource?.dragKey).toBe('1');
  });

  it('拖拽添加模板配置信息不带属性配置表', () => {
    const pageConfig = {
      [ROOT]: { componentName: 'a' },
    };
    const prevState: StateType = {
      ...legoState,
      pageConfig,
      undo: [],
    };
    const vDOMCollection = {
      [ROOT]: { componentName: 'a', childNodes: ['1'] },
      1: {
        componentName: 'span',
        childNodes: { children: ['2'], test: ['3'] },
      },
      2: { componentName: 'img' },
      3: { componentName: 'a', childNodes: ['4'] },
      4: { componentName: 'img' },
    };
    const payload: DragSourcePayload = {
      vDOMCollection,
    };
    const state = reducer({ initPage: prevState }, { ...action, payload });
    const expectState: StateType = {
      ...prevState,
      undo: [{ pageConfig }],
      pageConfig: {
        [ROOT]: { componentName: 'a' },
        1: { componentName: 'a', childNodes: ['2'] },
        2: {
          componentName: 'span',
          childNodes: { children: ['3'], test: ['4'] },
        },
        3: { componentName: 'img' },
        4: { componentName: 'a', childNodes: ['5'] },
        5: { componentName: 'img' },
      },
      dragSource: { vDOMCollection, dragKey: '1' },
    };
    expect(state).toEqual({ initPage: expectState });
  });
});

describe('getDropTarget', () => {
  const payload: DropTargetType = { selectedKey: '1', domTreeKeys: [] };
  const action = { type: ACTION_TYPES.getDropTarget, payload };
  // it('如果拖拽组件(非容器)与drop组件是同一个', () => {
  //   const prevState: StateType = {
  //     ...legoState,
  //     pageConfig: {
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
      selectedInfo: {
        selectedKey: '1',
        domTreeKeys: [],
        parentKey: '',
        propsConfig: {},
      },
    };
    const brickdState = { initPage: prevState };
    const nextState = reducer(brickdState, action);
    expect(nextState).toBe(brickdState);
  });

  // it('当drop组件为非容器组件', () => {
  //   const prevState: StateType = { ...legoState, dropTarget: { selectedKey: '2', domTreeKeys: [] } };
  //   const nextState = reducer(prevState, action);
  //   expect(nextState.dropTarget).toBeNull();
  // });

  it('当drop组件为容器组件', () => {
    const payload: DropTargetType = { selectedKey: '1', domTreeKeys: [ROOT] };
    const nextState = reducer({ initPage: legoState }, { ...action, payload });
    expect(nextState).toEqual({
      initPage: {
        ...legoState,
        dropTarget: payload,
        hoverKey: '1',
      },
    });
  });
  it('当selectedInfo!=null 获取dropTarget', () => {
    const payload: DropTargetType = { selectedKey: ROOT, domTreeKeys: [ROOT] };
    const prevState: StateType = {
      ...legoState,
      selectedInfo: {
        selectedKey: ROOT,
        domTreeKeys: [],
        propsConfig: {},
        parentKey: '',
      },
    };
    const nextState = reducer({ initPage: prevState }, { ...action, payload });
    const expectState: StateType = {
      ...prevState,
      dropTarget: { selectedKey: ROOT, domTreeKeys: [ROOT] },
      hoverKey: ROOT,
    };
    expect(nextState).toEqual({ initPage: expectState });
  });
});

describe('clearDropTarget', () => {
  const action = { type: ACTION_TYPES.clearDropTarget };
  it('清除DropTarget', () => {
    const prevState: StateType = {
      ...legoState,
      dropTarget: { selectedKey: ROOT, domTreeKeys: [] },
    };
    const state = reducer({ initPage: prevState }, action);
    expect(state).toEqual({ initPage: legoState });
  });
});

describe('clearDragSource', () => {
  const action = { type: ACTION_TYPES.clearDragSource };
  it('dragSource!==null清除dragSource', () => {
    const prevState: StateType = {
      ...legoState,
      dragSource: { dragKey: ROOT, parentKey: '' },
    };
    const state = reducer({ initPage: prevState }, action);
    expect(state).toEqual({ initPage: legoState });
  });
  it('dragSource===null清除dragSource', () => {
    const state = reducer({ initPage: legoState }, action);
    expect(state).toEqual({ initPage: legoState });
  });
});

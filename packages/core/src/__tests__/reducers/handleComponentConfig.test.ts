import { reducer } from '../../reducers';
import ACTION_TYPES from '../../actions/actionTypes';
import { legoState } from '../../reducers/handlePageBrickdState';
import {
  BrickAction,
  PageConfigType,
  PropsConfigSheetType,
  SelectedInfoType,
  StateType,
  UndoRedoType,
} from '../../types';
import config from '../configs';
import {
  getWarn,
  ROOT,
  setBrickdConfig,
  setPageName,
  setWarn,
} from '../../utils';
import { LayoutSortPayload } from '../../actions';

jest.resetModules();
beforeAll(() => {
  setBrickdConfig(config);
  setPageName('initPage');
  console.warn = jest.fn();
});
afterAll(() => {
  setBrickdConfig(null);
  setPageName(null);
});
describe('addComponent', () => {
  const action: BrickAction = { type: ACTION_TYPES.addComponent };
  test('dragSource===null没有拖拽组件时', () => {
    const brickdState = { initPage: legoState };
    const state = reducer(brickdState, action);
    expect(state).toEqual(brickdState);
  });
  test('dropTarget===null&&selectedInfo===null 既没有drop目标也没有选中组件时', () => {
    const undo: UndoRedoType[] = [
      {
        pageConfig: {
          [ROOT]: {
            componentName: 'img',
          },
        },
      },
    ];
    const prevState: StateType = {
      ...legoState,
      undo,
      pageConfig: {
        [ROOT]: {
          componentName: 'img',
        },
        1: { componentName: 'a' },
      },
      dragSource: { dragKey: '1', parentKey: '', vDOMCollection: {} },
      dropTarget: null,
    };
    const state = reducer({ initPage: prevState }, action);

    expect(state).toEqual(state);
  });
  test('parentKey===selectedKey拖拽的组件是drop目标的子组件', () => {
    const prevState: StateType = {
      ...legoState,
      pageConfig: {
        [ROOT]: { componentName: 'div' },
      },
      selectedInfo: {
        selectedKey: ROOT,
        domTreeKeys: [ROOT],
        parentKey: '',
        propsConfig: {},
      },
      dragSource: { parentKey: ROOT, dragKey: '1' },
    };
    const state = reducer({ initPage: prevState }, action);
    expect(state).toEqual({
      initPage: { ...prevState, dragSource: null, dropTarget: null },
    });
  });
  test('domTreeKeys.includes(dragKey) 拖拽组件是drop目标的父组件', () => {
    const prevState: StateType = {
      ...legoState,
      pageConfig: { [ROOT]: { componentName: 'h' } },
      selectedInfo: {
        selectedKey: ROOT,
        domTreeKeys: [ROOT, '1'],
        parentKey: '',
        propsConfig: {},
      },
      dragSource: { parentKey: '2', dragKey: '1' },
    };
    const state = reducer({ initPage: prevState }, action);
    expect(state).toEqual({
      initPage: { ...prevState, dragSource: null, dropTarget: null },
    });
  });
  test('pageConfig.0===undefined 没有根节点时', () => {
    const vDOMCollection: PageConfigType = {
      [ROOT]: { componentName: 'a' },
    };
    const prevState: StateType = {
      ...legoState,
      undo: [],
      dragSource: {
        dragKey: ROOT,
        vDOMCollection,
        parentKey: '',
      },
    };
    const state = reducer({ initPage: prevState }, action);
    const expectState: StateType = {
      ...legoState,
      pageConfig: vDOMCollection,
      undo: [{ pageConfig: {} }],
      dragSource: null,
    };
    expect(state).toEqual({ initPage: expectState });
  });
  test('pageConfig.0 有根节点但没有drop目标时', () => {
    const prevState: StateType = {
      ...legoState,
      pageConfig: {
        [ROOT]: { componentName: 'div' },
      },
      dragSource: {
        dragKey: ROOT,
        parentKey: 'w',
      },
    };
    const state = reducer({ initPage: prevState }, action);
    const expectState: StateType = {
      ...prevState,
      dragSource: null,
    };
    expect(state).toEqual({ initPage: expectState });
  });
  describe('父组件约束限制', () => {
    it('当选中的组件没有属性节点时', () => {
      const prevState: StateType = {
        ...legoState,
        pageConfig: {
          [ROOT]: {
            componentName: 'a',
          },
          '1': {
            componentName: 'div',
          },
        },
        dragSource: { dragKey: '1', parentKey: '' },
        dropTarget: { selectedKey: ROOT, domTreeKeys: [] },
      };
      expect(reducer({ initPage: prevState }, action)).toEqual({
        initPage: {
          ...prevState,
          dropTarget: null,
          dragSource: null,
        },
      });
    });
    it('当选中的组件有属性节点时', () => {
      const prevState: StateType = {
        ...legoState,
        pageConfig: {
          [ROOT]: {
            componentName: 'p',
          },
          '1': {
            componentName: 'div',
          },
        },
        dragSource: { dragKey: '1', parentKey: '' },
        dropTarget: {
          selectedKey: ROOT,
          propName: 'children',
          domTreeKeys: [],
        },
      };
      expect(reducer({ initPage: prevState }, action)).toEqual({
        initPage: {
          ...prevState,
          dropTarget: null,
          dragSource: null,
        },
      });
    });
    it('当选中的组件有属性节点时', () => {
      const prevState: StateType = {
        ...legoState,
        pageConfig: {
          [ROOT]: {
            componentName: 'p',
          },
          '1': {
            componentName: 'div',
          },
        },
        dragSource: { dragKey: '1', parentKey: '' },
        dropTarget: {
          selectedKey: ROOT,
          propName: 'children',
          domTreeKeys: [],
        },
      };
      expect(reducer({ initPage: prevState }, action)).toEqual({
        initPage: {
          ...prevState,
          dropTarget: null,
          dragSource: null,
        },
      });
    });
    it('errorCallback错误回调函数', function () {
      setWarn(jest.fn());
      const prevState: StateType = {
        ...legoState,
        pageConfig: {
          [ROOT]: {
            componentName: 'p',
          },
          '1': {
            componentName: 'div',
          },
        },
        dragSource: { dragKey: '1', parentKey: '' },
        dropTarget: {
          selectedKey: ROOT,
          propName: 'children',
          domTreeKeys: [],
        },
      };
      reducer({ initPage: prevState }, action);
      expect(getWarn()).toBeCalled();
      setWarn(null);
    });
  });

  describe('子组件约束限制', () => {
    test('子组件约束限制', () => {
      const prevState: StateType = {
        ...legoState,
        pageConfig: {
          [ROOT]: {
            componentName: 'span',
          },
          '1': {
            componentName: 'img',
          },
        },
        dragSource: { dragKey: '1', parentKey: '' },
        dropTarget: { selectedKey: ROOT, propName: 'test', domTreeKeys: [] },
      };
      expect(reducer({ initPage: prevState }, action)).toEqual({
        initPage: {
          ...prevState,
          dropTarget: null,
          dragSource: null,
        },
      });
    });
    test('没有属性节点配置的子组件约束限制', () => {
      const prevState: StateType = {
        ...legoState,
        pageConfig: {
          [ROOT]: {
            componentName: 'h',
          },
          '1': {
            componentName: 'a',
          },
        },
        dragSource: { dragKey: '1', parentKey: '' },
        dropTarget: { selectedKey: ROOT, domTreeKeys: [] },
      };
      expect(reducer({ initPage: prevState }, action)).toEqual({
        initPage: {
          ...prevState,
          dropTarget: null,
          dragSource: null,
        },
      });
    });
    test('warn', () => {
      setWarn(jest.fn());

      const prevState: StateType = {
        ...legoState,
        pageConfig: {
          [ROOT]: {
            componentName: 'span',
          },
          '1': {
            componentName: 'img',
          },
        },
        dragSource: { dragKey: '1', parentKey: '' },
        dropTarget: { selectedKey: ROOT, propName: 'test', domTreeKeys: [] },
      };
      reducer({ initPage: prevState }, action);
      expect(getWarn()).toBeCalled();
      setWarn(null);
    });
  });
  test('正常添加新组件', () => {
    const pageConfig: PageConfigType = {
      [ROOT]: { componentName: 'div' },
      1: { componentName: 'span' },
    };
    const prevState: StateType = {
      ...legoState,
      undo: [],
      pageConfig,
      dropTarget: {
        selectedKey: ROOT,
        propName: 'children',
        domTreeKeys: [ROOT],
      },
      dragSource: { dragKey: '1', parentKey: '' },
    };
    const state = reducer({ initPage: prevState }, action);
    const expectState: StateType = {
      ...prevState,
      pageConfig: {
        [ROOT]: { componentName: 'div', childNodes: { children: ['1'] } },
        1: { componentName: 'span' },
      },
      dragSource: null,
      dropTarget: null,
    };
    expect(state).toEqual({ initPage: expectState });
  });

  test('跨容器拖拽设计面板中的组件', () => {
    const pageConfig: PageConfigType = {
      [ROOT]: { componentName: 'div', childNodes: { children: ['1'] } },
      1: { componentName: 'a', childNodes: ['2'] },
      2: { componentName: 'img' },
    };
    const prevState: StateType = {
      ...legoState,
      undo: [],
      pageConfig,
      dragSource: { dragKey: '2', parentKey: '1' },
      dropTarget: {
        selectedKey: ROOT,
        domTreeKeys: [ROOT],
        propName: 'children',
      },
    };
    const state = reducer({ initPage: prevState }, action);
    const expectComponentConfigs: PageConfigType = {
      [ROOT]: { componentName: 'div', childNodes: { children: ['1', '2'] } },
      1: { componentName: 'a' },
      2: { componentName: 'img' },
    };
    const expectState: StateType = {
      ...legoState,
      undo: [{ pageConfig }],
      pageConfig: expectComponentConfigs,
      dropTarget: null,
      dragSource: null,
    };
    expect(state).toEqual({ initPage: expectState });
  });
});

describe('copyComponent', () => {
  const action = { type: ACTION_TYPES.copyComponent };
  it('没有选中组件时', () => {
    expect(reducer({ initPage: legoState }, action)).toEqual({
      initPage: legoState,
    });
  });
  it('选中组价为根节点时', () => {
    const state: StateType = {
      ...legoState,
      selectedInfo: {
        selectedKey: ROOT,
        domTreeKeys: [],
        parentKey: '',
        propsConfig: {},
      },
    };
    expect(reducer({ initPage: state }, action)).toEqual({ initPage: state });
  });

  it('复制选中组件', () => {
    const pageConfig: PageConfigType = {
      [ROOT]: { componentName: 'a', childNodes: ['1'] },
      1: { componentName: 'a', childNodes: ['2'] },
      2: {
        componentName: 'span',
        childNodes: {
          children: ['3'],
        },
      },
      3: { componentName: 'p' },
    };
    const prevState: StateType = {
      ...legoState,
      undo: [],
      pageConfig,
      selectedInfo: {
        selectedKey: '1',
        parentKey: ROOT,
        domTreeKeys: [ROOT, '1'],
        propsConfig: {},
      },
    };
    const state = reducer({ initPage: prevState }, action);
    const expectState: StateType = {
      ...prevState,
      undo: [{ pageConfig }],
      pageConfig: {
        ...pageConfig,
        [ROOT]: { componentName: 'a', childNodes: ['1', '4'] },
        4: { componentName: 'a', childNodes: ['5'] },
        5: {
          componentName: 'span',
          childNodes: {
            children: ['6'],
          },
        },
        6: { componentName: 'p' },
      },
    };
    expect(state).toEqual({ initPage: expectState });
  });
});

describe('onLayoutSortChange', () => {
  const action = { type: ACTION_TYPES.onLayoutSortChange };
  it('容器内部排序', () => {
    const pageConfig: PageConfigType = {
      [ROOT]: { componentName: 'a', childNodes: ['1', '2', '3'] },
    };
    const prevState: StateType = {
      ...legoState,
      undo: [],
      pageConfig,
    };
    const payload: LayoutSortPayload = {
      sortKeys: ['2', '1', '3'],
      parentKey: ROOT,
    };
    const state = reducer({ initPage: prevState }, { ...action, payload });
    expect((state.initPage as StateType).pageConfig[ROOT].childNodes).toEqual(
      payload.sortKeys,
    );
    expect((state.initPage as StateType).undo).toEqual([{ pageConfig }]);
  });
  it('跨容器排序', () => {
    const pageConfig: PageConfigType = {
      [ROOT]: {
        componentName: 'a',
        childNodes: ['1'],
      },
      1: { componentName: 'div', childNodes: { children: ['2'] } },
      2: { componentName: 'img' },
    };
    const prevState: StateType = {
      ...legoState,
      undo: [],
      pageConfig,
    };
    const payload: LayoutSortPayload = {
      sortKeys: ['2', '1'],
      parentKey: ROOT,
      dragInfo: { parentKey: '1', parentPropName: 'children', key: '2' },
    };
    const state = reducer({ initPage: prevState }, { ...action, payload });
    const expectComponentConfigs = {
      [ROOT]: {
        componentName: 'a',
        childNodes: ['2', '1'],
      },
      1: { componentName: 'div' },
      2: { componentName: 'img' },
    };
    expect((state.initPage as StateType).pageConfig).toEqual(
      expectComponentConfigs,
    );
    expect((state.initPage as StateType).undo).toEqual([{ pageConfig }]);
  });
});

describe('deleteComponent', () => {
  const action = { type: ACTION_TYPES.deleteComponent };
  it('没有选中组件时', () => {
    expect(reducer({ initPage: legoState }, action)).toEqual({
      initPage: legoState,
    });
  });

  it('删除根节点', () => {
    const pageConfig: PageConfigType = {
      [ROOT]: { componentName: 'img' },
    };
    const selectedInfo: SelectedInfoType = {
      selectedKey: ROOT,
      parentKey: '',
      domTreeKeys: [ROOT],
      propsConfig: {},
    };
    const prevState: StateType = {
      ...legoState,
      undo: [],
      pageConfig,
      selectedInfo,
    };

    const state = reducer({ initPage: prevState }, action);
    const expectState: StateType = {
      ...legoState,
      pageConfig: {},
      undo: [{ pageConfig, selectedInfo }],
      selectedInfo: null,
    };
    expect(state).toEqual({ initPage: expectState });
  });

  it('删除非根节点并且拥有属性节点', () => {
    const pageConfig: PageConfigType = {
      [ROOT]: { componentName: 'a', childNodes: ['1', '2'] },
      1: { componentName: 'div', childNodes: { children: ['3'] } },
      2: { componentName: 'img' },
      3: {
        componentName: 'span',
        childNodes: { children: ['4'], test: ['5'] },
      },
      4: { componentName: 'img' },
      5: { componentName: 'a', childNodes: ['6'] },
      6: { componentName: 'img' },
    };
    const selectedInfo: SelectedInfoType = {
      selectedKey: '1',
      parentKey: ROOT,
      domTreeKeys: [ROOT, '1'],
      propsConfig: {},
    };

    const prevState: StateType = {
      ...legoState,
      undo: [],
      pageConfig,
      selectedInfo,
    };

    const state = reducer({ initPage: prevState }, action);
    const expectState: StateType = {
      ...legoState,
      pageConfig: {
        [ROOT]: { componentName: 'a', childNodes: ['2'] },
        2: { componentName: 'img' },
      },
      undo: [{ pageConfig, selectedInfo }],
      selectedInfo: null,
    };
    expect(state).toEqual({ initPage: expectState });
  });

  it('删除非根节点并且没有属性节点', () => {
    const pageConfig: PageConfigType = {
      [ROOT]: { componentName: 'span', childNodes: { children: ['1', '2'] } },
      1: { componentName: 'div' },
      2: { componentName: 'img' },
    };
    const selectedInfo: SelectedInfoType = {
      selectedKey: '2',
      parentKey: ROOT,
      parentPropName: 'children',
      domTreeKeys: [ROOT, '2'],
      propsConfig: {},
    };
    const prevState: StateType = {
      ...legoState,
      undo: [],
      pageConfig,
      selectedInfo,
    };
    const state = reducer({ initPage: prevState }, action);
    const expectState: StateType = {
      ...legoState,
      pageConfig: {
        [ROOT]: { componentName: 'span', childNodes: { children: ['1'] } },
        1: { componentName: 'div' },
      },
      undo: [{ pageConfig, selectedInfo }],
      selectedInfo: null,
    };
    expect(state).toEqual({ initPage: expectState });
  });
});
describe('clearChildNodes', () => {
  const action = { type: ACTION_TYPES.clearChildNodes };
  it('没有选中组件时', () => {
    expect(reducer({ initPage: legoState }, action)).toEqual({
      initPage: legoState,
    });
  });

  it('清除指定属性的所有子节点', () => {
    const pageConfig: PageConfigType = {
      [ROOT]: {
        componentName: 'span',
        childNodes: { children: ['1'], test: ['2'] },
      },
      1: { componentName: 'div', childNodes: { children: ['3'] } },
      2: { componentName: 'img' },
      3: {
        componentName: 'span',
        childNodes: { children: ['4'], test: ['5'] },
      },
      4: { componentName: 'img' },
      5: { componentName: 'a', childNodes: ['6'] },
      6: { componentName: 'img' },
    };

    const prevState: StateType = {
      ...legoState,
      undo: [],
      pageConfig,
      selectedInfo: {
        selectedKey: ROOT,
        propName: 'children',
        domTreeKeys: [ROOT],
        parentKey: '',
        propsConfig: {},
      },
    };

    const state = reducer({ initPage: prevState }, action);
    const expectState: StateType = {
      ...prevState,
      undo: [{ pageConfig }],
      pageConfig: {
        [ROOT]: { componentName: 'span', childNodes: { test: ['2'] } },
        2: { componentName: 'img' },
      },
    };
    expect(state).toEqual({ initPage: expectState });
  });
  it('清除指定组件的所有子节点', () => {
    const pageConfig: PageConfigType = {
      [ROOT]: {
        componentName: 'span',
        childNodes: { children: ['1'], test: ['2'] },
      },
      1: { componentName: 'div', childNodes: { children: ['3'] } },
      2: { componentName: 'img' },
      3: {
        componentName: 'span',
        childNodes: { children: ['4'], test: ['5'] },
      },
      4: { componentName: 'img' },
      5: { componentName: 'a', childNodes: ['6'] },
      6: { componentName: 'img' },
    };

    const prevState: StateType = {
      ...legoState,
      undo: [],
      pageConfig,
      selectedInfo: {
        selectedKey: ROOT,
        domTreeKeys: [ROOT],
        parentKey: '',
        propsConfig: {},
      },
    };

    const state = reducer({ initPage: prevState }, action);
    const expectState: StateType = {
      ...prevState,
      undo: [{ pageConfig }],
      pageConfig: {
        [ROOT]: { componentName: 'span' },
      },
    };
    expect(state).toEqual({ initPage: expectState });
  });
  it('组件没有子节点触发清除', () => {
    const pageConfig: PageConfigType = {
      [ROOT]: { componentName: 'a' },
    };

    const prevState: StateType = {
      ...legoState,
      undo: [],
      pageConfig,
      selectedInfo: {
        selectedKey: ROOT,
        domTreeKeys: [ROOT],
        parentKey: '',
        propsConfig: {},
      },
    };

    const state = reducer({ initPage: prevState }, action);

    expect(state).toEqual({ initPage: prevState });
  });
  it('组件多属性节点属性节点完全清空', () => {
    const pageConfig: PageConfigType = {
      [ROOT]: { componentName: 'span', childNodes: { children: ['1'] } },
      1: { componentName: 'p' },
    };

    const prevState: StateType = {
      ...legoState,
      undo: [],
      pageConfig,
      selectedInfo: {
        selectedKey: ROOT,
        domTreeKeys: [ROOT],
        propName: 'children',
        parentKey: '',
        propsConfig: {},
      },
    };

    const state = reducer({ initPage: prevState }, action);
    const expectState: StateType = {
      ...prevState,
      undo: [{ pageConfig }],
      pageConfig: {
        [ROOT]: { componentName: 'span' },
      },
    };
    expect(state).toEqual({ initPage: expectState });
  });
});

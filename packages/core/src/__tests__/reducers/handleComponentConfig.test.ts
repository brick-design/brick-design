import { reducer } from '../../reducers';
import ACTION_TYPES from '../../actions/actionTypes';
import { LEGO_BRIDGE, legoState } from '../../store';
import {
  BrickAction,
  ComponentConfigsType,
  PropsConfigSheetType,
  SelectedInfoType,
  StateType,
  UndoRedoType,
} from '../../types';
import config from '../configs';
import { flattenDeepArray } from '../../utils';
import { LayoutSortPayload } from '../../actions';

jest.resetModules();
beforeAll(() => {
  LEGO_BRIDGE.config = config;
  LEGO_BRIDGE.containers = flattenDeepArray(config.CONTAINER_CATEGORY);
});
afterAll(() => {
  LEGO_BRIDGE.config = undefined;
  LEGO_BRIDGE.containers = null;
});
describe('addComponent', () => {
  const action:BrickAction={ type: ACTION_TYPES.addComponent }
  test('dragSource===null', () => {
    const state = reducer(legoState, action);
    expect(state).toBe(legoState);
  });
  test('没有dropTarget或者selectedInfo===null', () => {
    const undo: UndoRedoType[] = [{
      componentConfigs: {
        root: {
          componentName: 'img',
        },
      },
    }];
    const prevState: StateType = {
      ...legoState,
      undo,
      componentConfigs: {
        root: {
          componentName: 'img',
        },
        1: { componentName: 'a' },
      },
      dragSource: { dragKey: '1', parentKey: '' },
    };
    const state = reducer(prevState, action);
    const expectState = {
      ...legoState, componentConfigs: {
        root: {
          componentName: 'img',
        },
      }, dragSource: null,
    };
    expect(state).toEqual(expectState);
  });
  test('parentKey===selectedKey', () => {
    const prevState: StateType = {
      ...legoState,
      selectedInfo: {
        selectedKey: 'root',
        domTreeKeys: ['root'],
        parentKey: '',
        propsConfig: {},
      },
      dragSource: { parentKey: 'root', dragKey: '1' },
    };
    const state = reducer(prevState, action);
    expect(state).toBe(prevState);
  });
  test('domTreeKeys.includes(dragKey!)', () => {
    const prevState: StateType = {
      ...legoState,
      selectedInfo: {
        selectedKey: 'root',
        domTreeKeys: ['root', '1'],
        parentKey: '',
        propsConfig: {},
      },
      dragSource: { parentKey: '2', dragKey: '1' },
    };
    const state = reducer(prevState, action);
    expect(state).toBe(prevState);
  });
  test('componentConfigs.root is undefined', () => {
    const vDOMCollection: ComponentConfigsType = {
      root: { componentName: 'a' },
    };
    const prevState: StateType = {
      ...legoState,
      dragSource: {
        dragKey: 'root',
        vDOMCollection,
        parentKey: '',
      },
    };
    const state = reducer(prevState, action);
    const expectState: StateType = {
      ...legoState,
      componentConfigs: vDOMCollection,
      undo: [{ componentConfigs: {} }],
      dragSource: null,
    };
    expect(state).toEqual(expectState);
  });
  describe('父组件约束限制', () => {
    it('当选中的组件没有属性节点时', () => {
      const prevState: StateType = {
        ...legoState,
        componentConfigs: {
          root: {
            componentName: 'a',
          },
          '1': {
            componentName: 'div',
          },
        },
        dragSource: { dragKey: '1', parentKey: '' },
        dropTarget: { selectedKey: 'root', domTreeKeys: [] },
      };
      expect(() =>
        reducer(prevState, action),
      ).toThrow('div:只允许放入div.children组件或者属性中');
    });
    it('当选中的组件有属性节点时', () => {
      const prevState: StateType = {
        ...legoState,
        componentConfigs: {
          root: {
            componentName: 'p',
          },
          '1': {
            componentName: 'div',
          },
        },
        dragSource: { dragKey: '1', parentKey: '' },
        dropTarget: { selectedKey: 'root', propName: 'children', domTreeKeys: [] },
      };
      expect(() =>
        reducer(prevState, action),
      ).toThrow('div:只允许放入div.children组件或者属性中');
    });
    it('当选中的组件有属性节点时', () => {
      const prevState: StateType = {
        ...legoState,
        componentConfigs: {
          root: {
            componentName: 'p',
          },
          '1': {
            componentName: 'div',
          },
        },
        dragSource: { dragKey: '1', parentKey: '' },
        dropTarget: { selectedKey: 'root', propName: 'children', domTreeKeys: [] },
      };
      expect(() =>
        reducer(prevState, action),
      ).toThrow('div:只允许放入div.children组件或者属性中');
    });
    it('errorCallback', function() {
        LEGO_BRIDGE.errorCallback = jest.fn();
      const prevState: StateType = {
        ...legoState,
        componentConfigs: {
          root: {
            componentName: 'p',
          },
          '1': {
            componentName: 'div',
          },
        },
        dragSource: { dragKey: '1', parentKey: '' },
        dropTarget: { selectedKey: 'root', propName: 'children', domTreeKeys: [] },
      };
      reducer(prevState, action)
      expect(LEGO_BRIDGE.errorCallback).toBeCalled();
      LEGO_BRIDGE.errorCallback=undefined
    });
  });

  describe('子组件约束限制', () => {
    test('子组件约束限制', () => {
      const prevState: StateType = {
        ...legoState,
        componentConfigs: {
          root: {
            componentName: 'span',
          },
          '1': {
            componentName: 'img',
          },
        },
        dragSource: { dragKey: '1', parentKey: '' },
        dropTarget: { selectedKey: 'root', propName: 'test', domTreeKeys: [] },
      };
      expect(() =>
        reducer(prevState, action),
      ).toThrow('test:只允许拖拽a组件');
    });
    test('没有属性节点配置的子组件约束限制',()=>{
      const prevState: StateType = {
        ...legoState,
        componentConfigs: {
          root: {
            componentName: 'h',
          },
          '1': {
            componentName: 'a',
          },
        },
        dragSource: { dragKey: '1', parentKey: '' },
        dropTarget: { selectedKey: 'root', domTreeKeys: [] },
      };
      expect(() =>
        reducer(prevState, action),
      ).toThrow('h:只允许拖拽img组件');

    })
    test('errorCallback', () => {
      LEGO_BRIDGE.errorCallback = jest.fn();

      const prevState: StateType = {
        ...legoState,
        componentConfigs: {
          root: {
            componentName: 'span',
          },
          '1': {
            componentName: 'img',
          },
        },
        dragSource: { dragKey: '1', parentKey: '' },
        dropTarget: { selectedKey: 'root', propName: 'test', domTreeKeys: [] },
      };
      reducer(prevState,action ),
        expect(LEGO_BRIDGE.errorCallback).toBeCalled();
      LEGO_BRIDGE.errorCallback=undefined
    });
  });
  test('正常添加新组建', () => {
    const componentConfigs: ComponentConfigsType = {
      root: { componentName: 'div', childNodes: { children: [] } },
      1: { componentName: 'span', childNodes: { children: [], test: [] } },
    };
    const prevState: StateType = {
      ...legoState,
      undo: [],
      componentConfigs,
      dropTarget: { selectedKey: 'root', propName: 'children', domTreeKeys: ['root'] },
      dragSource: { dragKey: '1', parentKey: '' },
    };
    const state = reducer(prevState, action);
    const expectState: StateType = {
      ...legoState,
      componentConfigs: {
        root: { componentName: 'div', childNodes: { children: ['1'] } },
        1: { componentName: 'span', childNodes: { children: [], test: [] } },
      },
      undo: [{ componentConfigs }],
      dragSource: null,
      dropTarget: null,
    };
    expect(state).toEqual(expectState);
  });

  test('跨容器拖拽设计面板中的组件', () => {
    const componentConfigs: ComponentConfigsType = {
      root: { componentName: 'div', childNodes: { children: ['1'] } },
      1: { componentName: 'a', childNodes: ['2'] },
      2: { componentName: 'img' },
    };
    const prevState: StateType = {
      ...legoState,
      undo: [],
      componentConfigs,
      dragSource: { dragKey: '2', parentKey: '1' },
      dropTarget: { selectedKey: 'root', domTreeKeys: ['root'], propName: 'children' },
    };
    const state = reducer(prevState, action);
    const expectComponentConfigs: ComponentConfigsType = {
      root: { componentName: 'div', childNodes: { children: ['1', '2'] } },
      1: { componentName: 'a', childNodes: [] },
      2: { componentName: 'img' },
    };
    const expectState: StateType = {
      ...legoState,
      undo: [{ componentConfigs }],
      componentConfigs: expectComponentConfigs,
      dropTarget: null,
      dragSource: null,
    };
    expect(state).toEqual(expectState);
  });
});

describe('copyComponent', () => {
  const action={ type: ACTION_TYPES.copyComponent }
  it('if selectedInfo===null', () => {
    expect(reducer(legoState, action)).toEqual(legoState);
  });
  it('if selectedInfo.selectedKey===root', () => {
    const state: StateType = {
      ...legoState,
      selectedInfo: { selectedKey: 'root', domTreeKeys: [], parentKey: '', propsConfig: {} },
    };
    expect(reducer(state, action)).toEqual(state);
  });

  it('复制选中组件', () => {
    const componentConfigs: ComponentConfigsType = {
      root: { componentName: 'a', childNodes: ['1'] },
      1: { componentName: 'a', childNodes: ['2'] },
      2: { componentName: 'span', childNodes: {
          children: ['3'],
          test: [],
        }
      },
      3:{componentName:'p',}
    };
    const propsConfigSheet: PropsConfigSheetType = {
      1: {},
    };
    const prevState: StateType = {
      ...legoState,
      undo: [],
      componentConfigs,
      propsConfigSheet,
      selectedInfo: { selectedKey: '1', parentKey: 'root', domTreeKeys: ['root', '1'], propsConfig: {} },
    };
    const state = reducer(prevState, action);
    expect(state.undo).toEqual([{ componentConfigs, propsConfigSheet }]);
    const childNodes = state.componentConfigs.root.childNodes as string[];
    expect(childNodes?.length).toBe(2);
    expect(state.propsConfigSheet[childNodes[1]]).toBe('1');
  });
});

describe('onLayoutSortChange', () => {
  const action={ type: ACTION_TYPES.onLayoutSortChange,}
  it('容器内部排序', () => {
    const componentConfigs: ComponentConfigsType = {
      root: { componentName: 'a', childNodes: ['1', '2', '3'] },
    };
    const prevState: StateType = {
      ...legoState,
      undo: [],
      componentConfigs,

    };
    const payload: LayoutSortPayload = { sortKeys: ['2', '1', '3'], parentKey: 'root' };
    const state = reducer(prevState, { ...action, payload });
    expect(state.componentConfigs.root.childNodes).toEqual(payload.sortKeys);
    expect(state.undo).toEqual([{ componentConfigs }]);

  });
  it('跨容器排序', () => {
    const componentConfigs: ComponentConfigsType = {
      root: {
        componentName: 'a', childNodes: ['1'],
      },
      1: { componentName: 'div', childNodes: { children: ['2'] } },
      2: { componentName: 'img' },
    };
    const prevState: StateType = {
      ...legoState,
      undo: [],
      componentConfigs,
    };
    const payload: LayoutSortPayload = {
      sortKeys: ['2', '1'],
      parentKey: 'root',
      dragInfo: { parentKey: '1', parentPropName: 'children', key: '2' },
    };
    const state = reducer(prevState, {...action, payload });
    const expectComponentConfigs = {
      root: {
        componentName: 'a', childNodes: ['2', '1'],
      },
      1: { componentName: 'div', childNodes: { children: [] } },
      2: { componentName: 'img' },
    };
    expect(state.componentConfigs).toEqual(expectComponentConfigs);
    expect(state.undo).toEqual([{ componentConfigs }]);

  });
});

describe('deleteComponent', () => {
  const action={ type: ACTION_TYPES.deleteComponent }
  it('if selectedInfo===null', () => {
    expect(reducer(legoState, action)).toEqual(legoState);
  });

  it('删除根节点', () => {
    const componentConfigs: ComponentConfigsType = {
      root: { componentName: 'img' },
    };
    const propsConfigSheet = { 'root': {} };
    const selectedInfo: SelectedInfoType = {
      selectedKey: 'root',
      parentKey: '',
      domTreeKeys: ['root'],
      propsConfig: {},
    };
    const prevState: StateType = {
      ...legoState,
      undo: [],
      componentConfigs,
      propsConfigSheet,
      selectedInfo,
    };

    const state = reducer(prevState, action);
    const expectState: StateType = {
      ...legoState,
      componentConfigs: {},
      undo: [{ componentConfigs, selectedInfo, propsConfigSheet }],
      propsConfigSheet: {},
      selectedInfo: null,
    };
    expect(state).toEqual(expectState);
  });

  it('删除非根节点并且拥有属性节点', () => {
    const componentConfigs: ComponentConfigsType = {
      root: { componentName: 'a', childNodes: ['1', '2'] },
      1: { componentName: 'div', childNodes: { children: ['3'] } },
      2: { componentName: 'img' },
      3: { componentName: 'span', childNodes: { children: ['4'], test: ['5'] } },
      4: { componentName: 'img' },
      5: { componentName: 'a', childNodes: ['6'] },
      6: { componentName: 'img' },
    };
    const propsConfigSheet: PropsConfigSheetType = {
      1: {},
      2: {},
      4: '2',
      6: {},
    };
    const selectedInfo: SelectedInfoType = {
      selectedKey: '1',
      parentKey: 'root',
      domTreeKeys: ['root', '1'],
      propsConfig: {},
    };

    const prevState: StateType = {
      ...legoState,
      undo: [],
      componentConfigs,
      propsConfigSheet,
      selectedInfo,
    };

    const state = reducer(prevState, action);
    const expectState: StateType = {
      ...legoState,
      componentConfigs: {
        root: { componentName: 'a', childNodes: ['2'] },
        2: { componentName: 'img' },
      },
      undo: [{ componentConfigs, selectedInfo, propsConfigSheet }],
      propsConfigSheet: { 2: {} },
      selectedInfo: null,
    };
    expect(state).toEqual(expectState);
  });

  it('删除非根节点并且没有属性节点', () => {
    const componentConfigs: ComponentConfigsType = {
      root: { componentName: 'a', childNodes: ['1', '2'] },
      1: { componentName: 'div', childNodes: { children: [] } },
      2: { componentName: 'img' },

    };
    const propsConfigSheet: PropsConfigSheetType = { 2: {} };
    const selectedInfo: SelectedInfoType = {
      selectedKey: '2',
      parentKey: 'root',
      domTreeKeys: ['root', '2'],
      propsConfig: {},
    };

    const prevState: StateType = {
      ...legoState,
      undo: [],
      componentConfigs,
      propsConfigSheet,
      selectedInfo,
    };
    const state = reducer(prevState, action);
    const expectState: StateType = {
      ...legoState,
      componentConfigs: {
        root: { componentName: 'a', childNodes: ['1'] },
        1: { componentName: 'div', childNodes: { children: [] } },
      },
      propsConfigSheet: {},
      undo: [{ componentConfigs, selectedInfo, propsConfigSheet }],
      selectedInfo: null,
    };
    expect(state).toEqual(expectState);
  });
});
describe('clearChildNodes', () => {
  const action={ type: ACTION_TYPES.clearChildNodes }
  it('if selectedInfo===null', () => {
    expect(reducer(legoState, action)).toEqual(legoState);
  });

  it('清除子节点', () => {
    const componentConfigs: ComponentConfigsType = {
      root: { componentName: 'span', childNodes: { children: ['1'], test: ['2'] } },
      1: { componentName: 'div', childNodes: { children: ['3'] } },
      2: { componentName: 'img' },
      3: { componentName: 'span', childNodes: { children: ['4'], test: ['5'] } },
      4: { componentName: 'img' },
      5: { componentName: 'a', childNodes: ['6'] },
      6: { componentName: 'img' },
    };

    const propsConfigSheet: PropsConfigSheetType = {
      1: {},
      2: {},
      4: '2',
      6: {},
    };
    const prevState: StateType = {
      ...legoState,
      undo: [],
      componentConfigs,
      selectedInfo: {
        selectedKey: 'root',
        propName: 'children',
        domTreeKeys: ['root'],
        parentKey: '',
        propsConfig: {},
      },
      propsConfigSheet,
    };

    const state = reducer(prevState, action);
    const expectState: StateType = {
      ...prevState,
      undo: [{ componentConfigs, propsConfigSheet }],
      componentConfigs: {
        root: { componentName: 'span', childNodes: { children: [], test: ['2'] } },
      },
      propsConfigSheet: {},
    };
    expect(state).toEqual(expectState);
  });
});

import { reducer } from '../../reducers';
import ACTION_TYPES from '../../actions/actionTypes';
import { LEGO_BRIDGE, legoState } from '../../store';
import { ComponentConfigsType, PropsSettingType, SelectedInfoType, StateType, UndoRedoType } from '../../types';
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
  test('dragSource===null', () => {
    const state = reducer(legoState, { type: ACTION_TYPES.addComponent });
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
    const state = reducer(prevState, { type: ACTION_TYPES.addComponent });
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
      },
      dragSource: { parentKey: 'root', dragKey: '1' },
    };
    const state = reducer(prevState, { type: ACTION_TYPES.addComponent });
    expect(state).toBe(prevState);
  });
  test('domTreeKeys.includes(dragKey!)', () => {
    const prevState: StateType = {
      ...legoState,
      selectedInfo: {
        selectedKey: 'root',
        domTreeKeys: ['root', '1'],
        parentKey: '',
      },
      dragSource: { parentKey: '2', dragKey: '1' },
    };
    const state = reducer(prevState, { type: ACTION_TYPES.addComponent });
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
    const state = reducer(prevState, { type: ACTION_TYPES.addComponent });
    const expectState: StateType = {
      ...legoState,
      componentConfigs: vDOMCollection,
      undo: [{ componentConfigs: {} }],
      dragSource: null,
    };
    expect(state).toEqual(expectState);
  });
  describe('父组件约束限制',()=>{
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
        reducer(prevState, { type: ACTION_TYPES.addComponent }),
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
        dropTarget: { selectedKey: 'root',propName:'children', domTreeKeys: [] },
      };
      expect(() =>
        reducer(prevState, { type: ACTION_TYPES.addComponent }),
      ).toThrow('div:只允许放入div.children组件或者属性中');
    });
  })

 describe('子组件约束限制',()=>{
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
       reducer(prevState, { type: ACTION_TYPES.addComponent }),
     ).toThrow('test:只允许拖拽a组件');
   });
 })
  test('正常添加新组建', () => {
    const componentConfigs: ComponentConfigsType = {
      root: { componentName: 'div', childNodes: { children: []}},
      1: { componentName: 'span', childNodes: { children: [], test: [] } },
    };
    const prevState: StateType = {
      ...legoState,
      undo:[],
      componentConfigs,
      dropTarget: { selectedKey: 'root', propName: 'children', domTreeKeys: ['root'] },
      dragSource: { dragKey: '1', parentKey: ''},
    };
    const state = reducer(prevState, { type: ACTION_TYPES.addComponent });
    const expectState: StateType = {
      ...legoState,
      componentConfigs: {
        root: { componentName: 'div', childNodes: { children: ['1'], }},
        1: { componentName: 'span', childNodes: { children: [], test: [] } },
      },
      undo: [{componentConfigs}],
      dragSource: null,
      dropTarget: null,
    };
    expect(state).toEqual(expectState);
  });

  test('跨容器拖拽设计面板中的组件',()=>{
    const componentConfigs:ComponentConfigsType={
      root:{componentName:'div',childNodes:{children:['1']}},
      1:{componentName:'a',childNodes:['2']},
      2:{componentName:'img'}
    }
    const prevState:StateType={
      ...legoState,
      undo:[],
      componentConfigs,
      dragSource:{dragKey:'2',parentKey:'1'},
      dropTarget:{selectedKey:'root',domTreeKeys:['root'],propName:'children'}
    }
    const state=reducer(prevState,{type:ACTION_TYPES.addComponent})
    const expectComponentConfigs:ComponentConfigsType={
      root:{componentName:'div',childNodes:{children:['1',"2"]}},
      1:{componentName:'a',childNodes:[]},
      2:{componentName:'img'}}
    const expectState:StateType={
      ...legoState,
      undo:[{componentConfigs}],
      componentConfigs:expectComponentConfigs,
      dropTarget:null,
      dragSource:null
  }
  expect(state).toEqual(expectState)
  })
});

describe('copyComponent',()=>{
  it('if selectedInfo===null',()=>{
    expect(reducer(legoState,{type:ACTION_TYPES.copyComponent})).toEqual(legoState)
  })
  it('if selectedInfo.selectedKey===root',()=>{
    const state:StateType={
      ...legoState,
      selectedInfo:{selectedKey:'root',domTreeKeys:[],parentKey:''}
    }
    expect(reducer(state,{type:ACTION_TYPES.copyComponent})).toEqual(state)
  })

  it('复制选中组件',()=>{
    const componentConfigs:ComponentConfigsType={
      root:{componentName:'a',childNodes:['1']},
      1:{componentName:'img'}
    }
    const prevState:StateType={
      ...legoState,
      undo:[],
      componentConfigs,
      selectedInfo:{selectedKey:'1',parentKey:'root',domTreeKeys:['root','1']}
    }
    const state=reducer(prevState,{type:ACTION_TYPES.copyComponent})
    expect(state.undo).toEqual([{componentConfigs}])
    expect(state.componentConfigs.root.childNodes?.length).toBe(2)
  })
})

describe('onLayoutSortChange',()=>{
  it('容器内部排序',()=>{
    const componentConfigs:ComponentConfigsType={
      root:{componentName:'a',childNodes:['1','2','3']},
    }
    const prevState:StateType={
      ...legoState,
      undo:[],
      componentConfigs

    }
      const payload:LayoutSortPayload={sortKeys:['2','1','3'],parentKey:'root'}
    const  state=reducer(prevState,{type:ACTION_TYPES.onLayoutSortChange,payload})
    expect(state.componentConfigs.root.childNodes).toEqual(payload.sortKeys)
    expect(state.undo).toEqual([{componentConfigs}])

  })
  it('跨容器排序',()=>{
    const componentConfigs:ComponentConfigsType={
      root:{
        componentName:'a',childNodes:['1']
      },
      1:{componentName:'div',childNodes:{children:['2']}},
      2:{componentName:'img'}
    }
    const prevState:StateType={
      ...legoState,
      undo:[],
      componentConfigs,
    }
    const payload:LayoutSortPayload={sortKeys:['2','1'],parentKey:'root',dragInfo:{parentKey:'1',parentPropName:'children',key:'2'}}
    const  state=reducer(prevState,{type:ACTION_TYPES.onLayoutSortChange,payload})
    const expectComponentConfigs={root:{
        componentName:'a',childNodes:['2','1']
      },
      1:{componentName:'div',childNodes:{children:[]}},
      2:{componentName:'img'}}
    expect(state.componentConfigs).toEqual(expectComponentConfigs)
    expect(state.undo).toEqual([{componentConfigs}])

  })
})

describe('deleteComponent',()=>{
  it('if selectedInfo===null',()=>{
    expect(reducer(legoState,{type:ACTION_TYPES.deleteComponent})).toEqual(legoState)
  })

  it('删除根节点',()=>{
    const componentConfigs:ComponentConfigsType={
      root:{componentName:'img'}
    }
    const selectedInfo:SelectedInfoType={
      selectedKey:'root',
      parentKey:'',
      domTreeKeys:['root']
    }
    const propsSetting:PropsSettingType={
      mergePropsConfig:{},
      props:{},
      addPropsConfig:{},
      propsConfig:{}
    }
    const prevState:StateType={
      ...legoState,
      undo:[],
      componentConfigs,
      selectedInfo,
      propsSetting
    }

    const  state=reducer(prevState,{type:ACTION_TYPES.deleteComponent})
    const expectState:StateType={
      ...legoState,
      componentConfigs:{},
      undo:[{componentConfigs,selectedInfo,propsSetting}],
      selectedInfo:null,
      propsSetting:null,
    }
    expect(state).toEqual(expectState)
  })
  it('删除非根节点',()=>{
    const componentConfigs:ComponentConfigsType={
      root:{componentName:'a',childNodes:['1','2']},
      1:{componentName: 'div',childNodes:{children:['3']}},
      2:{componentName:'img'},
      3:{componentName:'span',childNodes:{children:['4'],test:['5']}},
      4:{componentName:'img'},
      5:{componentName:'a',childNodes:['6']},
      6:{componentName:'img'}
    }
    const selectedInfo:SelectedInfoType={
      selectedKey:'1',
      parentKey:'root',
      domTreeKeys:['root','1']
    }
    const propsSetting:PropsSettingType={
      mergePropsConfig:{},
      props:{},
      addPropsConfig:{},
      propsConfig:{}
    }
    const prevState:StateType={
      ...legoState,
      undo:[],
      componentConfigs,
      selectedInfo,
      propsSetting
    }

    const  state=reducer(prevState,{type:ACTION_TYPES.deleteComponent})
    const expectState:StateType={
      ...legoState,
      componentConfigs:{
        root:{componentName:'a',childNodes:['2']},
        2:{componentName:'img'},
      },
      undo:[{componentConfigs,selectedInfo,propsSetting}],
      selectedInfo:null,
      propsSetting:null,
    }
    expect(state).toEqual(expectState)
  })
})
describe('clearChildNodes',()=>{
  it('if selectedInfo===null',()=>{
    expect(reducer(legoState,{type:ACTION_TYPES.clearChildNodes})).toEqual(legoState)
  })

  it('should', ()=> {
    const componentConfigs:ComponentConfigsType={
      root:{componentName:'span',childNodes:{children:['1'],test:['2']}},
      1:{componentName: 'div',childNodes:{children:['3']}},
      2:{componentName:'img'},
      3:{componentName:'span',childNodes:{children:['4'],test:['5']}},
      4:{componentName:'img'},
      5:{componentName:'a',childNodes:['6']},
      6:{componentName:'img'}
    }

    const prevState:StateType={
      ...legoState,
      undo:[],
      componentConfigs,
      selectedInfo:{selectedKey:'root',propName:'children',domTreeKeys:['root'],parentKey:''}
    }

    const state=reducer(prevState,{type:ACTION_TYPES.clearChildNodes})
    const expectState:StateType={
      ...prevState,
      undo:[{componentConfigs}],
      componentConfigs:{
        root:{componentName:'span',childNodes:{children:[],test:['2']}}
      }
    }
    expect(state).toEqual(expectState)
  });
})

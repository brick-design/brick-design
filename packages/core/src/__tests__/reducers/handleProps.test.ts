import { reducer } from '../../reducers';
import { LEGO_BRIDGE, legoState } from '../../store';
import ACTION_TYPES from '../../actions/actionTypes';
import config from '../configs';

import {
  ComponentConfigsType,
  PROPS_TYPES,
  PropsConfigSheetType,
  PropsConfigType,
  SelectedInfoType,
  StateType,
} from '../../types';
import { AddPropsConfigPayload, ChangePropsPayload, DeletePropsConfigPayload } from '../../actions';
import { merge } from 'lodash';

beforeAll(()=>{
  LEGO_BRIDGE.config=config
})
describe('addPropsConfig', () => {
  it('selectedInfo===null', () => {
    expect(reducer(legoState, { type: ACTION_TYPES.addPropsConfig })).toEqual(legoState);
  });

  it('添加object属性配置', () => {
    const propsConfig: PropsConfigType = {
      a: {
        label: 'a',
        type: PROPS_TYPES.object,
        childPropsConfig: {
          b: {
            type: PROPS_TYPES.object,
          },
        },
      },
    };
    const selectedInfo: SelectedInfoType = {
      selectedKey: 'root',
      propsConfig,
      parentKey: '',
      domTreeKeys: [],
    };
    const prevState: StateType = {
      ...legoState,
      undo: [],
      propsConfigSheet: {},
      selectedInfo,
    };
    const payload: AddPropsConfigPayload = {
      fatherFieldLocation: 'a.childPropsConfig.b.childPropsConfig',
      newPropField: 'c',
      propType: PROPS_TYPES.number,
    };

    const state = reducer(prevState, { type: ACTION_TYPES.addPropsConfig, payload });
    const expectState: StateType = {
      ...prevState,
      undo: [{ selectedInfo, propsConfigSheet: {} }],
      selectedInfo: {
        ...selectedInfo,
        propsConfig: {
          a: {
            label: 'a',
            type: PROPS_TYPES.object,
            childPropsConfig: {
              b: {
                type: PROPS_TYPES.object,
                childPropsConfig: {
                  c: {
                    type: PROPS_TYPES.number,
                    isAdd: true,
                  },
                },
              },
            },
          },
        },
      },
      propsConfigSheet: {
        'root': {
          a: {
            childPropsConfig: {
              b: {
                childPropsConfig: {
                  c: {
                    type: PROPS_TYPES.number,
                    isAdd: true,
                  },
                },
              },
            },
          },
        },
      },
    };
    expect(state).toEqual(expectState);
  });
  it('添加object重复属性配置', () => {
    const propsConfigSheet: PropsConfigSheetType = {
      root:{
        a: {
          label: 'a',
          type: PROPS_TYPES.object,
          childPropsConfig: {
            b: {
              type: PROPS_TYPES.objectArray,
            },
          },
        },
      }
    };
    const selectedInfo: SelectedInfoType = {
      selectedKey: 'root',
      propsConfig:{},
      parentKey: '',
      domTreeKeys: [],
    };
    const prevState: StateType = {
      ...legoState,
      undo: [],
      propsConfigSheet,
      selectedInfo,
    };
    const payload: AddPropsConfigPayload = {
      fatherFieldLocation: 'a.childPropsConfig',
      newPropField: 'b',
      propType: PROPS_TYPES.object,
    };

    const state = reducer(prevState, { type: ACTION_TYPES.addPropsConfig, payload });
    expect(state).toEqual(prevState);
  });

  it('添加objectArray属性配置', () => {
    const propsConfig: PropsConfigType = {
      a: {
        label: 'a',
        type: PROPS_TYPES.object,
        childPropsConfig: {
          b: {
            type: PROPS_TYPES.objectArray,
          },
        },
      },
    };
    const selectedInfo: SelectedInfoType = {
      selectedKey: 'root',
      propsConfig,
      parentKey: '',
      domTreeKeys: [],
    };
    const prevState: StateType = {
      ...legoState,
      undo: [],
      propsConfigSheet: {},
      selectedInfo,
    };
    const payload: AddPropsConfigPayload = {
      fatherFieldLocation: 'a.childPropsConfig.b.childPropsConfig',
      childPropsConfig:[{
        c: {
          type: PROPS_TYPES.number,
          isAdd: true,
        },
      }]
    };

    const state = reducer(prevState, { type: ACTION_TYPES.addPropsConfig, payload });
    const expectState: StateType = {
      ...prevState,
      undo: [{ selectedInfo, propsConfigSheet: {} }],
      selectedInfo: {
        ...selectedInfo,
        propsConfig: {
          a: {
            label: 'a',
            type: PROPS_TYPES.object,
            childPropsConfig: {
              b: {
                type: PROPS_TYPES.objectArray,
                childPropsConfig: [{
                  c: {
                    type: PROPS_TYPES.number,
                    isAdd: true,
                  },
                }],
              },
            },
          },
        },
      },
      propsConfigSheet: {
        'root': {
          a: {
            childPropsConfig: {
              b: {
                childPropsConfig: [{
                  c: {
                    type: PROPS_TYPES.number,
                    isAdd: true,
                  },
                }],
              },
            },
          },
        },
      },
    };
    expect(state).toEqual(expectState);
  });
});

describe('deletePropsConfig',()=>{
  it('selectedInfo===null', () => {
    expect(reducer(legoState, { type: ACTION_TYPES.deletePropsConfig })).toEqual(legoState);
  });

  it('props有值，删除属性配置',()=>{
    const selectedInfo:SelectedInfoType={
      selectedKey:'1',
      domTreeKeys:['root','1'],
      parentKey:'root',
      propsConfig:{}
    }
    const componentConfigs:ComponentConfigsType={
      root:{
        componentName:'a',
        childNodes:['1'],
      },
      1:{componentName:'img',
        props:{a:{b:"1"}}
      }
    }
    const propsConfigSheet:PropsConfigSheetType={
      root:{a:{childPropsConfig:{b:{type:PROPS_TYPES.string}}}},
      1:'root'
    }
    const prevState:StateType={
      ...legoState,
      undo:[],
      componentConfigs,
      propsConfigSheet,
      selectedInfo
    }
    const payload:DeletePropsConfigPayload={
      fatherFieldLocation:'a.childPropsConfig',
      field:'b'
    }
    const state =reducer(prevState,{type:ACTION_TYPES.deletePropsConfig,payload})
    const expectState:StateType={
      ...prevState,
      undo:[{selectedInfo,componentConfigs,propsConfigSheet}],
      componentConfigs:{
        ...componentConfigs,
        1:{componentName:'img', props:{a:{}}}
      },
      propsConfigSheet:{
        ...propsConfigSheet,
        1:{a:{childPropsConfig:{}}}
      },
      selectedInfo:{
        ...selectedInfo,
        propsConfig:merge(config.AllComponentConfigs['img'].propsConfig,{a:{childPropsConfig:{}}})
      }
    }
    expect(state).toEqual(expectState)
  })
  it('props没有值，删除属性配置',()=>{
    const selectedInfo:SelectedInfoType={
      selectedKey:'root',
      domTreeKeys:[],
      parentKey:'',
      propsConfig:{}
    }
    const componentConfigs:ComponentConfigsType={
      root:{
        componentName:'img',
        props:{a:{}}
      }
    }
    const propsConfigSheet:PropsConfigSheetType={
      root:{a:{childPropsConfig:{b:{type:PROPS_TYPES.string}}}}
    }
    const prevState:StateType={
      ...legoState,
      undo:[],
      componentConfigs,
      propsConfigSheet,
      selectedInfo
    }
    const payload:DeletePropsConfigPayload={
      fatherFieldLocation:'a.childPropsConfig',
      field:'b'
    }
    const state =reducer(prevState,{type:ACTION_TYPES.deletePropsConfig,payload})
    const expectState:StateType={
      ...prevState,
      undo:[{selectedInfo,componentConfigs,propsConfigSheet}],
      propsConfigSheet:{
        root:{a:{childPropsConfig:{}}}
      },
      selectedInfo:{
        ...selectedInfo,
        propsConfig:merge(config.AllComponentConfigs['img'].propsConfig,{a:{childPropsConfig:{}}})
      }
    }
    expect(state).toEqual(expectState)
  })
})

describe('changeProps',()=>{
  it('selectedInfo===null', () => {
    expect(reducer(legoState, { type: ACTION_TYPES.changeProps })).toEqual(legoState);
  });
  it('changeProps and style===undefined',()=>{
    const componentConfigs:ComponentConfigsType={
      root:{componentName:'img',props:{a:1}}
    }
    const prevState:StateType={
      ...legoState,
      undo:[],
      componentConfigs,
      selectedInfo:{
        selectedKey:'root',
        domTreeKeys:['root'],
        parentKey:'',
        propsConfig:{}
      }
    }
    const payload:ChangePropsPayload={props:{b:2}}
    const state=reducer(prevState,{type:ACTION_TYPES.changeProps,payload})
    const expectState:StateType={
      ...prevState,
      undo:[{componentConfigs}],
      componentConfigs:{
        root:{componentName:'img',props:{b:2}}
      }
    }

    expect(state).toEqual(expectState)
  })
  it('changeProps and style',()=>{
    const componentConfigs:ComponentConfigsType={
      root:{componentName:'img',props:{style:{a:1}}}
    }
    const prevState:StateType={
      ...legoState,
      undo:[],
      componentConfigs,
      selectedInfo:{
        selectedKey:'root',
        domTreeKeys:['root'],
        parentKey:'',
        propsConfig:{}
      }
    }
    const payload:ChangePropsPayload={props:{b:2}}
    const state=reducer(prevState,{type:ACTION_TYPES.changeProps,payload})
    const expectState:StateType={
      ...prevState,
      undo:[{componentConfigs}],
      componentConfigs:{
        root:{componentName:'img',props:{b:2,style:{a:1}}}
      }
    }

    expect(state).toEqual(expectState)
  })
})

describe('resetProps',()=>{
  it('selectedInfo===null', () => {
    expect(reducer(legoState, { type: ACTION_TYPES.resetProps })).toEqual(legoState);
  });
  it('selectedInfo!==null and style===undefined', () => {
    const componentConfigs:ComponentConfigsType={
      root:{componentName:'img',props:{a:3}}
    }
    const prevState:StateType={
      ...legoState,
      undo:[],
      componentConfigs,
      selectedInfo:{
        selectedKey:'root',
        domTreeKeys:[],
        parentKey:'',
        propsConfig:{},
        props:{b:2}
      }
    }
    const state=reducer(prevState, { type: ACTION_TYPES.resetProps })
    const expectState:StateType={
      ...prevState,
      undo:[{componentConfigs}],
      componentConfigs:{
        root:{componentName:'img',props:{b:2}}
      }
    }
    expect(state).toEqual(expectState);
  });
  it('selectedInfo!==null and style!==undefined', () => {
    const componentConfigs:ComponentConfigsType={
      root:{componentName:'img',props:{a:1,style:{c:3}}}
    }
    const prevState:StateType={
      ...legoState,
      undo:[],
      componentConfigs,
      selectedInfo:{
        selectedKey:'root',
        domTreeKeys:[],
        parentKey:'',
        propsConfig:{},
        props:{b:2}
      }
    }
    const state=reducer(prevState, { type: ACTION_TYPES.resetProps })
    const expectState:StateType={
      ...prevState,
      undo:[{componentConfigs}],
      componentConfigs:{
        root:{componentName:'img',props:{b:2,style:{c:3}}}
      }
    }
    expect(state).toEqual(expectState);
  });

})

import { reducer } from '../../reducers';
import ACTION_TYPES from '../../actions/actionTypes';
import { LEGO_BRIDGE, legoState } from '../../store';
import {  SelectedInfoType, StateType } from '../../types';
import config from '../configs'
import { SelectComponentPayload } from '../../actions';
jest.resetModules()
beforeAll(()=>{
  LEGO_BRIDGE.config=config
})
afterAll(()=>{
  LEGO_BRIDGE.config=undefined
})
describe('selectInfo',()=>{
  test('如果 selectedInfo===null ',()=>{
    const prevState:StateType={
      ...legoState,
      componentConfigs:{
        root:{
          componentName:'span',
          childNodes:{
            children:['1'],
            test:[]
          }
        }
      }
    }
    const payload:SelectComponentPayload={
      key:'root',
      parentKey:'',
      domTreeKeys:['root'],
      propName:'test'
    }

    const state=reducer(prevState,{type:ACTION_TYPES.selectComponent,payload})
    const expectState:StateType={
      ...prevState,
      selectedInfo:{
        selectedKey:'root',
        propsConfig:config.AllComponentConfigs['span'].propsConfig,
        propName:'test',
        domTreeKeys:['root','roottest'],
        parentKey:''
      }

    }
    expect(state).toEqual(expectState)
  })
  test('选中没有属性节点的组件组件',()=>{
    const selectedInfo:SelectedInfoType={
      selectedKey:'root',
      domTreeKeys:['root','roottest'],
      parentKey:'',
      propsConfig:{}
    }
    const prevState:StateType={
      ...legoState,
      undo:[],
      selectedInfo,
      dropTarget: {selectedKey:'',domTreeKeys:[]},
      componentConfigs:{
        root:{
          componentName:'span',
          childNodes:{
            children:[],
            test:['1']
          }
        },
        1:{componentName:'img'}
      }
    }
    const payload:SelectComponentPayload={
      key:'1',
      parentKey:'root',
      domTreeKeys:['root','roottest','1'],
      parentPropName:'test'
    }
    const state=reducer(prevState,{type:ACTION_TYPES.selectComponent,payload})
    const expectState:StateType={
      ...prevState,
      undo:[{selectedInfo}],
      dropTarget:null,
      selectedInfo:{
        selectedKey:'1',
        parentKey:'root',
        domTreeKeys:['root','roottest','1'],
        parentPropName:'test',
        propsConfig:config!.AllComponentConfigs['img'].propsConfig
      },
    }
    expect(state).toEqual(expectState)
  })

  test('选中有属性节点的组件',()=>{
    const selectedInfo:SelectedInfoType={
      selectedKey:'1',
      domTreeKeys:['root','1'],
      parentKey:'root',
      propsConfig:{}
    }
    const prevState:StateType={
      ...legoState,
      undo:[],
      selectedInfo,
      dropTarget: {selectedKey:'',domTreeKeys:[]},
      componentConfigs:{
        root:{
          componentName:'span',
          childNodes:{
            children:[],
            test:['1']
          }
        },
        1:{componentName:'img'}
      }
    }
    const payload:SelectComponentPayload={
      key:'root',
      parentKey:'',
      domTreeKeys:['root'],
      propName:'children'
    }
    const state=reducer(prevState,{type:ACTION_TYPES.selectComponent,payload})
    const expectState:StateType={
      ...prevState,
      undo:[{selectedInfo}],
      dropTarget:null,
      selectedInfo:{
        selectedKey:'root',
        domTreeKeys:['root',"rootchildren"],
        propName:'children',
        parentKey:'',
        propsConfig:LEGO_BRIDGE.config!.AllComponentConfigs['span'].propsConfig
      },
    }
    expect(state).toEqual(expectState)
  })
  test('如果 selectedInfo.selectedKey===key 并且属性节点非空 ',()=>{
    const prevState:StateType={...legoState,
      selectedInfo:{selectedKey:'root',domTreeKeys:['root'],propName:'children',parentKey:'',propsConfig:{}},
      componentConfigs:{root:{
        componentName:'span',
          props:{},
          childNodes:{
          children:[],
            test:[]
          }
        }}
    }
    const payload:SelectComponentPayload={
      key:'root',
      parentKey:'',
      domTreeKeys:['root'],
      propName:'test'
    }

    const state=reducer(prevState,{type:ACTION_TYPES.selectComponent,payload})
    expect(state).toBe(prevState)
  })
  test('如果 selectedInfo.selectedKey===key 并且属性节点相同 ',()=>{
    const prevState:StateType={...legoState,
      selectedInfo:{selectedKey:'root',domTreeKeys:['root'],propName:'children',parentKey:'',propsConfig:{}},
      componentConfigs:{
      root:{
          componentName:'span',
          childNodes:{
            children:[],
            test:[]
          }
        }}
    }
    const payload:SelectComponentPayload={
      key:'root',
      parentKey:'',
      domTreeKeys:['root'],
      propName:'children'
    }

    const state=reducer(prevState,{type:ACTION_TYPES.selectComponent,payload})
    expect(state).toBe(prevState)
  })
  test('如果 selectedInfo.selectedKey===key 并且属性节点不同',()=>{
    const selectedInfo:SelectedInfoType={
        selectedKey:'root',
        domTreeKeys:['root','rootchildren'],
        propName:'children',
        parentKey:'',
        propsConfig:{}
      }
    const prevState:StateType={
      ...legoState,
      selectedInfo,
      componentConfigs:{
      root:{
          componentName:'span',
          childNodes:{
            children:['1'],
            test:[]
          }
        }
      }
    }
    const payload:SelectComponentPayload={
      key:'root',
      parentKey:'',
      domTreeKeys:['root'],
      propName:'test'
    }

    const state=reducer(prevState,{type:ACTION_TYPES.selectComponent,payload})
    const expectState:StateType={
      ...prevState,
      selectedInfo:{
        ...selectedInfo,
        propName:'test',
        domTreeKeys:['root','roottest']
      }

    }
    expect(state).toEqual(expectState)
  })
})

describe('清除选中',()=>{
  test('当没有选中组件时',()=>{
    const state=reducer(legoState,{type:ACTION_TYPES.clearSelectedStatus})
    expect(state).toEqual(legoState)
  })

  test('当选中组件的属性节点为必填非空组件时',()=>{
    const prevState:StateType={...legoState,
      selectedInfo:{selectedKey:'root',domTreeKeys:['root'],propName:'children',parentKey:'',propsConfig:{}},
      componentConfigs:{
      root:{
          componentName:'span',
          props:{},
          childNodes:{
            children:[],
            test:[]
          }
        }}
    }
    const state=reducer(prevState,{type:ACTION_TYPES.clearSelectedStatus})
    expect(state).toEqual(prevState)
  })

  test('正常清除',()=>{
    const prevState:StateType={...legoState,
      selectedInfo:{selectedKey:'root',domTreeKeys:['root'],parentKey:'',propsConfig:{}},
      componentConfigs:{
        root:{
          componentName:'img',
          props:{}
        }}
    }
    const state=reducer(prevState,{type:ACTION_TYPES.clearSelectedStatus})
    expect(state.selectedInfo).toBeNull()
  })
})


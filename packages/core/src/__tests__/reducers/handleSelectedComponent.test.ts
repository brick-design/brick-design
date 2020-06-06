import { reducer } from '../../reducers';
import ACTION_TYPES from '../../actions/actionTypes';
import { LEGO_BRIDGE, legoState } from '../../store';
import { StateType } from '../../types';
import config from '../configs'
import { SelectComponentType } from '../../actions';
jest.resetModules()
beforeAll(()=>{
  LEGO_BRIDGE.config=config
})
afterAll(()=>{
  LEGO_BRIDGE.config=undefined
})
describe('selectInfo',()=>{

  test('选中组件',()=>{
    const prevState:StateType={
      ...legoState,
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
    const payload:SelectComponentType={
      key:'root',
      parentKey:'',
      domTreeKeys:['root'],
      propName:'test'
    }
    const state=reducer(prevState,{type:ACTION_TYPES.selectComponent,payload})
    expect(state.selectedInfo?.selectedKey).toBe('root')
  })
  test('当选中组件的属性节点为必填非空组件时',()=>{
    const prevState:StateType={...legoState,
      selectedInfo:{selectedKey:'root',domTreeKeys:['root'],propName:'children',parentKey:''},
      componentConfigs:{root:{
        componentName:'span',
          props:{},
          childNodes:{
          children:[],
            test:[]
          }
        }}
    }
    const payload:SelectComponentType={
      key:'root',
      parentKey:'',
      domTreeKeys:['root'],
      propName:'test'
    }

    const state=reducer(prevState,{type:ACTION_TYPES.selectComponent,payload})
    expect(state).toBe(prevState)
  })

  test('当选中组件与上次选中组件为同一组件只是属性节点不同时',()=>{
    const prevState:StateType={
      ...legoState,
      selectedInfo:{
        selectedKey:'root',
        domTreeKeys:['root'],
        propName:'children',
        parentKey:''
      },
      componentConfigs:{
      root:{
          componentName:'span',
          props:{},
          childNodes:{
            children:['1'],
            test:[]
          }
        }
      }
    }
    const payload:SelectComponentType={
      key:'root',
      parentKey:'',
      domTreeKeys:['root'],
      propName:'test'
    }

    const state=reducer(prevState,{type:ACTION_TYPES.selectComponent,payload})
    expect(state.selectedInfo?.propName).toBe('test')
  })
})

describe('清除选中',()=>{
  test('当没有选中组件时',()=>{
    const state=reducer(legoState,{type:ACTION_TYPES.clearSelectedStatus})
    expect(state).toEqual(legoState)
  })

  test('当选中组件的属性节点为必填非空组件时',()=>{
    const prevState:StateType={...legoState,
      selectedInfo:{selectedKey:'root',domTreeKeys:['root'],propName:'children',parentKey:''},
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
      selectedInfo:{selectedKey:'root',domTreeKeys:['root'],parentKey:''},
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


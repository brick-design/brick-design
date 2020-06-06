import {reducer} from '../../reducers';
import ACTION_TYPES from '../../actions/actionTypes';
import { DragSourcePayload, DropTargetPayload } from '../../actions';
import { LEGO_BRIDGE, legoState } from '../../store';
import config from '../configs'
import { flattenDeepArray } from '../../utils';
import { ComponentConfigsType, StateType } from '../../types';
beforeAll(()=>{
  LEGO_BRIDGE.config=config
  LEGO_BRIDGE.containers=flattenDeepArray(config.CONTAINER_CATEGORY)
})

afterAll(()=>{
  LEGO_BRIDGE.config=undefined
  LEGO_BRIDGE.containers=null
})



describe("drag测试",()=>{
  const payload:DragSourcePayload={componentName:'a'}
  const action={type:ACTION_TYPES.getDragSource,payload}
  it('当componentConfigs没有root节点',()=>{
       const state= reducer(legoState,action)
        expect(state.dragSource).toEqual({vDOMCollection:{root:{componentName:'a',childNodes:[]}}})
    })
  it('当componentConfigs有root节点',()=>{
    const componentConfigs:ComponentConfigsType={root:{componentName:'a'}}
    const state= reducer({...legoState,componentConfigs},action)
    expect(state.dragSource?.dragKey).not.toBeUndefined()
    expect(state.undo).toEqual([{componentConfigs}])
  })
  it('拖拽设计面板中的组建',()=>{
    const prevState:StateType={
      ...legoState,
      componentConfigs:{
        root:{componentName:'a',props:{},childNodes:['1']},
        1:{componentName:'a',props:{},childNodes:[]}
      }
    }
    const payload:DragSourcePayload={dragKey:'1',parentKey:'root'}
    const nextState= reducer(prevState,{...action,payload})
    expect(nextState.dragSource?.dragKey).toBe('1')

  })
})

describe("drop测试",()=>{
  const payload:DropTargetPayload={selectedKey:"1"}
  const action={type:ACTION_TYPES.getDropTarget,payload}
  it('如果拖拽组件(非容器)与drop组件是同一个',()=>{
    const prevState:StateType={
      ...legoState,
      componentConfigs:{
        root:{componentName:"a",props:{},childNodes:['1']},
        1:{componentName:'img',props:{}}
      },
      dragSource:{dragKey:"1",parentKey:'root'}
    }

    const nextState=reducer(prevState,action)
    expect(nextState).toBe(prevState)
  })

  it('当有选中组件时触发dop',()=>{
    const prevState:StateType={...legoState,selectedInfo:{selectedKey:'1',domTreeKeys:[],parentKey:''}}
    const nextState=reducer(prevState,action)
    expect(nextState).toBe(prevState)
  })

  it('当drop组件为非容器组件',()=>{
    const prevState:StateType={...legoState,dropTarget:{selectedKey:'2',domTreeKeys:[]}}
    const nextState=reducer(prevState,action)
    expect(nextState.dropTarget).toBeNull()
  })

  it("当drop组件为容器组件",()=>{
    const payload:DropTargetPayload={selectedKey:'1',domTreeKeys:['root']}
    const nextState=reducer(legoState,{...action,payload})
    expect(nextState).toEqual({...legoState,dropTarget:payload,hoverKey:"1"})
  })
})

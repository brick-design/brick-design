import React from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import { LegoProvider, StateType,LEGO_BRIDGE } from 'brickd-core';
import { useChildNodes, UseChildNodeType } from '../../hooks/useChildNodes';
import config from '../configs';
afterEach(()=>{
  LEGO_BRIDGE.config=undefined;
  LEGO_BRIDGE.store=null
})
describe('useChildNodes',()=>{

  it('childNodes===undefined',()=>{
    const mockData:UseChildNodeType={
      specialProps:{key:'root',parentKey:'',domTreeKeys:['root']},
      componentName:'span'
    }
    renderHook(()=>useChildNodes(mockData),{
      // eslint-disable-next-line react/display-name
      wrapper:props=><LegoProvider {...props} config={config}/>
    })

    // expect(result.current)
  })

  it('childNodes is array and isRequired',()=>{
    const mockData:UseChildNodeType={
      specialProps:{key:'root',parentKey:'',domTreeKeys:['root']},
      componentName:'h',
      childNodes:[]
    }

    const initState:Partial<StateType>={
      componentConfigs:{root:{
          componentName:'h'
        }}
    }

    renderHook(()=>useChildNodes(mockData),{
      // eslint-disable-next-line react/display-name
      wrapper:props=><LegoProvider {...props} initState={initState} config={config}/>
    })

    // expect(result.current)
  })

  it('childNodes is object and isRequired',()=>{
    const mockData:UseChildNodeType={
      specialProps:{key:'root',parentKey:'',domTreeKeys:['root']},
      componentName:'span',
      childNodes:{
        children:[],
        test:[]
      }
    }
    const initState:Partial<StateType>={
      componentConfigs:{
        root:{
          componentName:'span'
        }
      }
    }

    renderHook(()=>useChildNodes(mockData),{
      // eslint-disable-next-line react/display-name
      wrapper:props=><LegoProvider {...props} initState={initState} config={config}/>
    })

    // expect(result.current)
  })

  it('childNodes is array',()=>{
    const mockData:UseChildNodeType={
      specialProps:{key:'root',parentKey:'',domTreeKeys:['root']},
      componentName:'a',
      childNodes:['1']
    }

    renderHook(()=>useChildNodes(mockData),{
      // eslint-disable-next-line react/display-name
      wrapper:props=><LegoProvider {...props} config={config}/>
    })

    // expect(result.current)
  })
  it('childNodes is object',()=>{
    const mockData:UseChildNodeType={
      specialProps:{key:'root',parentKey:'',domTreeKeys:['root']},
      componentName:'span',
      childNodes:{
        children:['1'],
        test:[]
      }
    }

    renderHook(()=>useChildNodes(mockData),{
      // eslint-disable-next-line react/display-name
      wrapper:props=><LegoProvider {...props} config={config}/>
    })

    // expect(result.current)
  })

})

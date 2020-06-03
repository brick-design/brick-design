import {createLegStore,LEGO_BRIDGE} from '../store'
import {LegoProvider} from '../components/LegoProvider'

import config from './configs'



describe('未初始化 config',()=>{
  test("Error",()=>{
    expect(LegoProvider).toThrow('config未初始化')
    expect(LEGO_BRIDGE.store).toBeNull()
  })
})
describe('初始化 config', () => {

  test('初始化 LEGO_BRIDGE',()=>{
    const actions={type:'a'}
    jest.resetModules()
    expect(LEGO_BRIDGE.dispatch(actions)).toBe(actions)
    LegoProvider({config})
    expect(LEGO_BRIDGE.config).toBe(config)
    expect(LEGO_BRIDGE.store).not.toBeNull()
    expect(LEGO_BRIDGE.containers).toEqual(expect.arrayContaining(['div']))
  })
  test('测试 store 为单例',()=>{
    expect(createLegStore()).toBe(LEGO_BRIDGE.store)
  })
})

import { createLegStore, LEGO_BRIDGE } from '../store';
import { LegoProvider } from '../components/LegoProvider';

import config from './configs';


describe('未初始化 config', () => {
  test('Error', () => {
    expect(LegoProvider).toThrow('config未初始化');
    expect(LEGO_BRIDGE.store).toBeNull();
  });
});
describe('初始化 config', () => {

  test('初始化 LEGO_BRIDGE', () => {
    jest.resetModules();
    LegoProvider({ config });
    expect(LEGO_BRIDGE.config).toBe(config);
    expect(LEGO_BRIDGE.store).not.toBeNull();
  });
  test('测试 store 为单例', () => {
    expect(createLegStore()).toBe(LEGO_BRIDGE.store);
  });
});

import { getComponentConfig, isContainer, setBrickdConfig } from '../../utils';
import config from '../configs';

describe('getComponentConfig', () => {
  it('如果没有配置组件配置信息集报错', () => {
    console.error = jest.fn();
    expect(getComponentConfig).toThrow();
  });

  it('未找到指定组件的配置信息', () => {
    setBrickdConfig(config);
    console.warn = jest.fn();
    getComponentConfig('table');
    expect(console.warn).toBeCalled();
  });
});

describe('isContainer', () => {
  it('未找到指定组件的配置信息', () => {
    setBrickdConfig(config);
    expect(isContainer('a')).toBeTruthy();
  });
});

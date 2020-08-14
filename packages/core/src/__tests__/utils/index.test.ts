import { getComponentConfig, isContainer } from '../../utils';
import { LEGO_BRIDGE } from '../../store';
import config from '../configs';

describe('getComponentConfig', () => {
	it('如果没有配置组件配置信息集报错', () => {
		console.error = jest.fn();
		expect(getComponentConfig).toThrow();
	});

	it('未找到指定组件的配置信息', () => {
		LEGO_BRIDGE.config = config;
		console.warn = jest.fn();
		getComponentConfig('table');
		expect(console.warn).toBeCalled();
	});
});

describe('isContainer', () => {
	it('如果没有配置容器信息集报错', () => {
		LEGO_BRIDGE.config = undefined;
		console.error = jest.fn();
		expect(isContainer).toThrow();
	});

	it('未找到指定组件的配置信息', () => {
		LEGO_BRIDGE.config = config;
		expect(isContainer('a')).toBeTruthy();
	});
});

import config from './configs';
import { createLegStore, LEGO_BRIDGE } from '../store';


describe('初始化 config', () => {
	test('初始化 LEGO_BRIDGE', () => {
		jest.resetModules();
		createLegStore(undefined, config);
		expect(LEGO_BRIDGE.config).toBe(config);
		expect(LEGO_BRIDGE.store).not.toBeNull();
	});
	test('测试 store 为单例', () => {
		expect(createLegStore(undefined, config)).toBe(LEGO_BRIDGE.store);
	});
});

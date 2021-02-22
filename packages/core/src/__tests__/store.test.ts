import config from './configs';
import { createLegStore} from '../store';
import { getBrickdConfig, getStore } from '../utils';


describe('初始化 config', () => {
	test('初始化 LEGO_BRIDGE', () => {
		jest.resetModules();
		const  store=createLegStore(config);
		expect(getBrickdConfig()).toBe(config);
		expect(getStore()).not.toBe(store);
	});
	test('测试 store 为单例', () => {
		expect(createLegStore(config)).toBe(getStore());
	});
});

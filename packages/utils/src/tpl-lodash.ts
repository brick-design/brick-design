/**
 * 代码来源于amis
 * https://github.com/baidu/amis
 */
import moment from 'moment';
import { template } from 'lodash';
import { Enginer } from './tpl';
import { getFilters } from './tpl-builtin';

const imports = {
  default: undefined,
  moment: moment,
  countDown: (end: any) => {
    if (!end) {
      return '--';
    }

    const date = new Date(parseInt(end, 10) * 1000);
    const now = Date.now();

    if (date.getTime() < now) {
      return '已结束';
    }

    return Math.ceil((date.getTime() - now) / (1000 * 60 * 60 * 24)) + '天';
  },
  formatDate: (value: any, format = 'LLL', inputFormat = '') =>
    moment(value, inputFormat).format(format),
};

// 缓存一下提升性能
const EVAL_CACHE: { [key: string]: Function } = {};

function lodashCompile(str: string, data: object) {
  try {
    const filters = getFilters();
    const finnalImports = {
      ...filters,
      formatTimeStamp: filters.date,
      formatNumber: filters.number,
      defaultValue: filters.defaut,
      ...imports,
    };
    delete finnalImports.default; // default 是个关键字，不能 imports 到 lodash 里面去。
    const fn =
      EVAL_CACHE[str] ||
      (EVAL_CACHE[str] = template(str, {
        imports: finnalImports,
        variable: 'data',
      }));

    return fn.call(data, data);
  } catch (e) {
    return `<span class="text-danger">${e.message}</span>`;
  }
}

export function registerLodash(): Enginer & { name: string } {
  return {
    name: 'lodash',
    test: (str: string) => !!str.includes('<%'),
    compile: (str: string, data: object) => lodashCompile(str, data),
  };
}

/**
 * 代码来源于amis
 * https://github.com/baidu/amis
 */
import qs from 'qs';
import { isObject, has, merge, isArray, map, get } from 'lodash';
import { tokenize, dataMapping } from './tpl-builtin';
import { evalExpression } from './tpl';
import {
  isObjectShallowModified,
  hasFile,
  object2formData,
  qsstringify,
  cloneObject,
  createObject,
} from './helper';
import { Api, ApiObject, Payload, FetcherType, ApiType } from './types';

const rSchema = /(?:^|raw\:)(get|post|put|delete|patch|options|head):/i;

interface ApiCacheConfig extends ApiObject {
  result: any;
  requestTime: number;
}

const apiCaches: Array<ApiCacheConfig> = [];

export function normalizeApi(api: Api, defaultMethod?: string): ApiObject {
  if (typeof api === 'string') {
    const method = rSchema.test(api) ? RegExp.$1 : '';
    method && (api = api.replace(method + ':', ''));
    api = {
      method: (method || defaultMethod) as any,
      url: api,
    };
  }
  return api;
}

export function buildApi(
  api: Api,
  data?: object,
  options: {
    autoAppend?: boolean;
    ignoreData?: boolean;
    [propName: string]: any;
  } = {},
): ApiObject {
  api = normalizeApi(api, options.method);
  const { autoAppend, ignoreData, ...rest } = options;

  api.config = {
    ...rest,
  };
  api.method = (api.method || (options as any).method || 'get').toLowerCase();

  if (!data) {
    return api;
  } else if (
    data instanceof FormData ||
    data instanceof Blob ||
    data instanceof ArrayBuffer
  ) {
    api.data = data;
    return api;
  }

  const raw = api.url || '';
  const idx = api.url.indexOf('?');

  if (~idx) {
    const hashIdx = api.url.indexOf('#');
    const params = qs.parse(
      api.url.substring(idx + 1, ~hashIdx ? hashIdx : undefined),
    );
    api.url =
      tokenize(api.url.substring(0, idx + 1), data, '| urlEncode') +
      qsstringify((api.query = dataMapping(params, data))) +
      (~hashIdx ? api.url.substring(hashIdx) : '');
  } else {
    api.url = tokenize(api.url, data, '| urlEncode');
  }

  if (ignoreData) {
    return api;
  }

  if (api.data) {
    api.body = api.data = dataMapping(api.data, data);
  } else if (api.method === 'post' || api.method === 'put') {
    api.body = api.data = cloneObject(data);
  }

  // get 类请求，把 data 附带到 url 上。
  if (api.method === 'get') {
    if (!raw.includes('$') && !api.data && autoAppend) {
      api.query = api.data = data;
    } else if (
      api.attachDataToQuery === false &&
      api.data &&
      !raw.includes('$') &&
      autoAppend
    ) {
      const idx = api.url.indexOf('?');
      if (~idx) {
        const params = (api.query = {
          ...qs.parse(api.url.substring(idx + 1)),
          ...data,
        });
        api.url = api.url.substring(0, idx) + '?' + qsstringify(params);
      } else {
        api.query = data;
        api.url += '?' + qsstringify(data);
      }
    }

    if (api.data && api.attachDataToQuery !== false) {
      const idx = api.url.indexOf('?');
      if (~idx) {
        const params = (api.query = {
          ...qs.parse(api.url.substring(idx + 1)),
          ...api.data,
        });
        api.url = api.url.substring(0, idx) + '?' + qsstringify(params);
      } else {
        api.query = api.data;
        api.url += '?' + qsstringify(api.data);
      }
      delete api.data;
    }
  }

  if (api.headers) {
    api.headers = dataMapping(api.headers, data);
  }

  if (api.requestAdaptor && typeof api.requestAdaptor === 'string') {
    api.requestAdaptor = str2function(api.requestAdaptor, 'api') as any;
  }

  if (api.adaptor && typeof api.adaptor === 'string') {
    api.adaptor = str2function(
      api.adaptor,
      'payload',
      'response',
      'api',
    ) as any;
  }

  return api;
}

function str2function(
  contents: string,
  ...args: Array<string>
): Function | null {
  try {
    const fn = new Function(...args, contents);
    return fn;
  } catch (e) {
    console.warn(e);
    return null;
  }
}

function responseAdaptor(ret: any, api: ApiObject) {
  let hasStatusField = true;
  if (!ret) {
    throw new Error('Response is empty!');
  } else if (!has(ret, 'status')) {
    hasStatusField = false;
  }
  const result = ret.data || ret.result;
  const payload: Payload = {
    ok: hasStatusField === false || ret.status == 0,
    status: hasStatusField === false ? 0 : ret.status,
    msg: ret.msg || ret.message,
    msgTimeout: ret.msgTimeout,
    data: Array.isArray(result) ? { items: result } : result, // 兼容直接返回数据的情况
    isNotState: api.isNotState,
    isPageState: api.isPageState,
  };

  if (payload.status == 422) {
    payload.errors = ret.errors;
  }

  if (payload.ok && api.responseData) {
    payload.data = dataMapping(
      api.responseData,
      createObject({ api }, payload.data || {}),
    );
  }
  return payload;
}
export const defaultFetcher = async (api: any) => {
  const { url, ...rest } = api;
  const result = await fetch(url, rest);
  return result.json();
};

export function wrapFetcher(
  fn: FetcherType = defaultFetcher,
): (api: Api, data: object, options?: object) => Promise<Payload | void> {
  return async function (api, data, options) {
    api = buildApi(api, data, options) as ApiObject;
    api.requestAdaptor && (api = api.requestAdaptor(api));

    if (api.data && (hasFile(api.data) || api.dataType === 'form-data')) {
      api.data = object2formData(api.data, api.qsOptions);
    } else if (
      api.data &&
      typeof api.data !== 'string' &&
      api.dataType === 'form'
    ) {
      api.data = qsstringify(api.data, api.qsOptions) as any;
      api.headers = api.headers || (api.headers = {});
      api.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    } else if (
      api.data &&
      typeof api.data !== 'string' &&
      api.dataType === 'json'
    ) {
      api.data = JSON.stringify(api.data) as any;
      api.headers = api.headers || (api.headers = {});
      api.headers['Content-Type'] = 'application/json';
    }

    const result = await fn(api);
    if (typeof api.cache === 'number' && api.cache > 0) {
      const apiCache = getApiCache(api);
      return wrapAdaptor(
        apiCache
          ? (apiCache as ApiCacheConfig).result
          : setApiCache(api, result),
        api,
      );
    }
    return wrapAdaptor(result, api);
  };
}

export async function wrapAdaptor(result: any, api: ApiObject) {
  const adaptor = api.adaptor;
  return responseAdaptor(adaptor ? adaptor(result, api) : result, api);
}

export function isApiOutdated(
  prevApi: Api | undefined,
  nextApi: Api | undefined,
  prevData: any,
  nextData: any,
  isFirst?: boolean,
): nextApi is Api {
  const nextUrl: string = get(nextApi, 'url', nextApi);
  const prevUrl: string = get(prevApi, 'url', prevApi);

  if (nextUrl !== prevUrl && isValidApi(nextUrl)) return true;
  if (!isFirst && get(nextApi, 'autoRefresh') === false) {
    return false;
  }

  if (typeof nextUrl === 'string' && nextUrl.includes('$')) {
    prevApi = buildApi(prevApi as Api, prevData as object, {
      ignoreData: true,
    });
    nextApi = buildApi(nextApi as Api, nextData as object, {
      ignoreData: true,
    });

    return !!(
      prevApi.url !== nextApi.url &&
      isValidApi(nextApi.url) &&
      (!nextApi.sendOn || evalExpression(nextApi.sendOn, nextData))
    );
  }

  return false;
}

export function isValidApi(api: string) {
  return (
    api &&
    /^(?:(https?|wss?|taf):\/\/[^\/]+)?(\/?[^\s\/\?]*){1,}(\?.*)?$/.test(api)
  );
}

export function isEffectiveApi(
  api?: Api,
  data?: any,
  initFetch?: boolean,
  initFetchOn?: string,
): api is Api {
  if (!api) {
    return false;
  }
  if (initFetch === false) {
    return false;
  }
  if (initFetchOn && data && !evalExpression(initFetchOn, data)) {
    return false;
  }
  if (typeof api === 'string' && api.length) {
    return true;
  } else if (isObject(api) && (api as ApiObject).url) {
    if (
      (api as ApiObject).sendOn &&
      data &&
      !evalExpression((api as ApiObject).sendOn as string, data)
    ) {
      return false;
    }
    return true;
  }
  return false;
}

export function isSameApi(
  apiA: ApiObject | ApiCacheConfig,
  apiB: ApiObject | ApiCacheConfig,
): boolean {
  return (
    apiA.method === apiB.method &&
    apiA.url === apiB.url &&
    !isObjectShallowModified(apiA.data, apiB.data, false)
  );
}

export function getApiCache(api: ApiObject): ApiCacheConfig | undefined {
  // 清理过期cache
  const now = Date.now();
  let result: ApiCacheConfig | undefined;

  for (let idx = 0, len = apiCaches.length; idx < len; idx++) {
    const apiCache = apiCaches[idx];

    if (now - apiCache.requestTime > (apiCache.cache as number)) {
      apiCaches.splice(idx, 1);
      len--;
      idx--;
      continue;
    }

    if (isSameApi(api, apiCache)) {
      result = apiCache;
      break;
    }
  }

  return result;
}

export function setApiCache(api: ApiObject, result: any) {
  apiCaches.push({
    ...api,
    result,
    requestTime: Date.now(),
  });
  return result;
}

export const handleResponseState = (response: Payload) => {
  const state = {};
  const { isPageState, isNotState, data, status } = response;
  if (!isNotState && status === 0) {
    if (isPageState) {
      merge(state, { pageState: data });
    } else {
      merge(state, { state: data });
    }
  }
  return state;
};

export const fetchData = async (
  fetcher: FetcherType | undefined,
  prevApi: ApiType | undefined,
  nextApi: ApiType | undefined,
  prevData: any,
  nextData: any,
  isFirst?: boolean,
  options?: object,
) => {
  if (fetcher && nextApi) {
    if (isArray(nextApi)) {
      const stateArr = await Promise.allSettled(
        map(nextApi, (api, i) => {
          if (
            isApiOutdated(get(prevApi, i), api, prevData, nextData, isFirst)
          ) {
            return wrapFetcher(fetcher)(api, nextData, options);
          }
        }),
      );
      for (const result of stateArr) {
        if (get(result, 'value')) {
          return handleResponseState(get(result, 'value'));
        }
      }
    } else {
      if (isApiOutdated(prevApi as Api, nextApi, prevData, nextData, isFirst)) {
        const result = await wrapFetcher(fetcher)(nextApi, nextData, options);
        if (result) {
          return handleResponseState(result);
        }
      }
    }
  }
};
export function clearApiCache() {
  apiCaches.splice(0, apiCaches.length);
}

// window.apiCaches = apiCaches;

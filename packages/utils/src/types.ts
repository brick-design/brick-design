import { CSSProperties } from 'react';

export interface SchemaApiObject {
  /**
   * API 发送类型
   */
  method?: 'get' | 'post' | 'put' | 'delete' | 'patch';

  /**
   * API 发送目标地址
   */
  url: string;

  /**
   * 用来控制携带数据. 当key 为 `&` 值为 `$$` 时, 将所有原始数据打平设置到 data 中. 当值为 $$ 将所有原始数据赋值到对应的 key 中. 当值为 $ 打头时, 将变量值设置到 key 中.
   */
  data?: PlainObject;

  /**
   * 用来做接口返回的数据映射。
   */
  responseData?: PlainObject;

  /**
   * 如果 method 为 get 的接口，设置了 data 信息。
   * 默认 data 会自动附带在 query 里面发送给后端。
   *
   * 如果想通过 body 发送给后端，那么请把这个配置成 false。
   *
   * 但是，浏览器还不支持啊，设置了只是摆设。
   */
  attachDataToQuery?: boolean;

  /**
   * 发送体的格式
   */
  dataType?: 'json' | 'form-data' | 'form';

  /**
   * 如果是文件下载接口，请配置这个。
   */
  responseType?: 'blob';

  /**
   * 携带 headers，用法和 data 一样，可以用变量。
   */
  headers?: {
    [propName: string]: string | number;
  };

  /**
   * 设置发送条件
   */
  sendOn?: string;

  /**
   * 默认都是追加模式，如果想完全替换把这个配置成 true
   */
  replaceData?: boolean;

  /**
   * 是否自动刷新，当 url 中的取值结果变化时，自动刷新数据。
   */
  autoRefresh?: boolean;

  /**
   * 如果设置了值，同一个接口，相同参数，指定的时间（单位：ms）内请求将直接走缓存。
   */
  cache?: number;

  /**
   * qs 配置项
   */
  qsOptions?: {
    arrayFormat?: 'indices' | 'brackets' | 'repeat' | 'comma';
    indices?: boolean;
    allowDots?: boolean;
  };
}
export interface ApiObject extends SchemaApiObject {
  config?: {
    withCredentials?: boolean;
    cancelExecutor?: (cancel: Function) => void;
  };
  body?: PlainObject;
  query?: PlainObject;
  adaptor?: (response: any, api: ApiObject) => any;
  requestAdaptor?: (api: ApiObject) => ApiObject;
  isNotState?: boolean;
  isPageState?: boolean;
}

export type Api = string | ApiObject;

export interface Payload {
  ok: boolean;
  msg: string;
  msgTimeout?: number;
  data: any;
  status: number;
  errors?: {
    [propName: string]: string;
  };
  isPageState?: boolean;
  isNotState?: boolean;
}

export type ApiType = Api[] | Api;

export interface ActionType {
  actionType?: string;
  api?: Api;
  asyncApi?: Api;
  payload?: any;
  to?: string;
  target?: string;
  link?: string;
  url?: string;
  mergeData?: boolean;
  reload?: string;
  messages?: {
    success?: string;
    failed?: string;
  };
  feedback?: any;
  required?: Array<string>;
  [propName: string]: any;
}

export interface Location {
  pathname: string;
  search: string;
  state: any;
  hash: string;
  key?: string;
  query?: any;
}

export interface PlainObject {
  [propsName: string]: any;
}

export interface RendererData {
  [propsName: string]: any;
  __prev?: RendererDataAlias;
  __super?: RendererData;
}
type RendererDataAlias = RendererData;

export type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];

export interface FetcherConfig {
  url: string;
  method?: 'get' | 'post' | 'put' | 'patch' | 'delete';
  data?: any;
  config?: any;
}

export type FetcherType = (config: FetcherConfig) => Promise<any>;
export type PropsNodeType = {
  [propName: string]: string[] | undefined;
};

export type ChildNodesType = string[] | PropsNodeType;

export type PropsType = {
  style?:CSSProperties
  [propName: string]: ActionType | any;
};

export interface VirtualDOMType {
  componentName: string;
  props?: PropsType;
  childNodes?: ChildNodesType;
  api?: ApiType;
  state?: PlainObject;
  condition?: string;
  isStateDomain?: boolean;
  propFields?: string[];
  methods?: {
    [key: string]: string;
  };
  loop?: string | any[];
  fileName?: string;
  [custom: string]: any;
}

export interface PageConfigType {
  [key: string]: VirtualDOMType;
}

export type CommonPropsType = {
  renderKey: string;
  [propName: string]: any;
};

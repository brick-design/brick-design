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
	adaptor?: (payload: object, response: FetcherResult, api: ApiObject) => any;
	requestAdaptor?: (api: ApiObject) => ApiObject;
}

export type Api = string | ApiObject;

export interface FetcherResult {
	data?: {
		data: object;
		status: number;
		msg: string;
		msgTimeout?: number;
		errors?: {
			[propName: string]: string;
		};
	};
	status: number;
	headers: object;
}

export interface FetcherResult {
	method?: 'get' | 'post' | 'put' | 'patch' | 'delete';
	successMessage?: string;
	errorMessage?: string;
	autoAppend?: boolean;
	beforeSend?: (data: any) => any;
	onSuccess?: (json: Payload) => any;
	silent?: boolean;
	[propName: string]: any;
}

export interface Payload {
	ok: boolean;
	msg: string;
	msgTimeout?: number;
	data: any;
	status: number;
	errors?: {
		[propName: string]: string;
	};
}


export interface ActionType{
	actionType?:
		| 'submit'
		| 'copy'
		| 'reload'
		| 'ajax'
		| 'dialog'
		| 'drawer'
		| 'jump'
		| 'link'
		| 'url'
		| 'close'
		| 'confirm'
		| 'add'
		| 'remove'
		| 'delete'
		| 'edit'
		| 'cancel'
		| 'next'
		| 'prev'
		| 'reset'
		| 'reset-and-submit'
		| 'clear'
		| 'clear-and-submit';
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

export type FetcherType=(config: FetcherConfig) => Promise<FetcherResult>

//----------------------
// <auto-generated>
//     Generated using the NSwag toolchain v13.17.0.0 (NJsonSchema v10.8.0.0 (Newtonsoft.Json v13.0.0.0)) (http://NSwag.org)
// </auto-generated>
//----------------------

/* tslint:disable */
/* eslint-disable */
// ReSharper disable InconsistentNaming

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, CancelToken } from "axios";
import axios, { AxiosError } from "axios";

export class BurgerClient {
	protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;
	private instance: AxiosInstance;
	private baseUrl: string;

	constructor(baseUrl?: string, instance?: AxiosInstance) {

		this.instance = instance ? instance : axios.create();

		this.baseUrl = baseUrl !== undefined && baseUrl !== null ? baseUrl : "http://localhost:4000";

	}

	getAll(cancelToken?: CancelToken | undefined): Promise<Burger[]> {
		let url_ = this.baseUrl + "/api/burgers";
		url_ = url_.replace(/[?&]$/, "");

		let options_: AxiosRequestConfig = {
			method: "GET",
			url: url_,
			headers: {
				"Accept": "application/json",
			},
			cancelToken,
		};

		return this.instance.request(options_).catch((_error: any) => {
			if (isAxiosError(_error) && _error.response) {
				return _error.response;
			} else {
				throw _error;
			}
		}).then((_response: AxiosResponse) => {
			return this.processGetAll(_response);
		});
	}

	protected processGetAll(response: AxiosResponse): Promise<Burger[]> {
		const status = response.status;
		let _headers: any = {};
		if (response.headers && typeof response.headers === "object") {
			for (let k in response.headers) {
				if (response.headers.hasOwnProperty(k)) {
					_headers[k] = response.headers[k];
				}
			}
		}
		if (status === 200) {
			const _responseText = response.data;
			let result200: any = null;
			let resultData200 = _responseText;
			result200 = JSON.parse(resultData200);
			return Promise.resolve<Burger[]>(result200);

		} else if (status !== 200 && status !== 204) {
			const _responseText = response.data;
			return throwException("An unexpected server error occurred.", status, _responseText, _headers);
		}
		return Promise.resolve<Burger[]>(null as any);
	}
}

export class OrderClient {
	protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;
	private instance: AxiosInstance;
	private baseUrl: string;

	constructor(baseUrl?: string, instance?: AxiosInstance) {

		this.instance = instance ? instance : axios.create();

		this.baseUrl = baseUrl !== undefined && baseUrl !== null ? baseUrl : "http://localhost:4000";

	}

	getAll2(cancelToken?: CancelToken | undefined): Promise<Order[]> {
		let url_ = this.baseUrl + "/api/orders";
		url_ = url_.replace(/[?&]$/, "");

		let options_: AxiosRequestConfig = {
			method: "GET",
			url: url_,
			headers: {
				"Accept": "application/json",
			},
			cancelToken,
		};

		return this.instance.request(options_).catch((_error: any) => {
			if (isAxiosError(_error) && _error.response) {
				return _error.response;
			} else {
				throw _error;
			}
		}).then((_response: AxiosResponse) => {
			return this.processGetAll2(_response);
		});
	}

	protected processGetAll2(response: AxiosResponse): Promise<Order[]> {
		const status = response.status;
		let _headers: any = {};
		if (response.headers && typeof response.headers === "object") {
			for (let k in response.headers) {
				if (response.headers.hasOwnProperty(k)) {
					_headers[k] = response.headers[k];
				}
			}
		}
		if (status === 200) {
			const _responseText = response.data;
			let result200: any = null;
			let resultData200 = _responseText;
			result200 = JSON.parse(resultData200);
			return Promise.resolve<Order[]>(result200);

		} else if (status !== 200 && status !== 204) {
			const _responseText = response.data;
			return throwException("An unexpected server error occurred.", status, _responseText, _headers);
		}
		return Promise.resolve<Order[]>(null as any);
	}
}

export interface Burger {
	ingredients: string[];
	name: string;
}

export interface OrderBase {
	burgers: BurgerRecord[];
	user: string;
	date: string;
}

export interface Order extends OrderBase {
	id?: string;
}

export interface BurgerRecord {
	fries?: Fries | undefined;
	drink?: Drink | undefined;
	name: string;
	excluded: string[];
	vegetarian: boolean;
	xl: boolean;
	comment: string;
}

export interface Fries {
	sauces: Sauce[];
}

export enum Sauce {
	Ketchup = "Ketchup",
	Mayo = "Mayo",
}

export enum Drink {
	Coca = "Coca",
	CocaZero = "CocaZero",
	IceTea = "IceTea",
	Limonade = "Limonade",
}

export class ApiException extends Error {
	override message: string;
	status: number;
	response: string;
	headers: { [key: string]: any; };
	result: any;
	protected isApiException = true;

	constructor(message: string, status: number, response: string, headers: { [key: string]: any; }, result: any) {
		super();

		this.message = message;
		this.status = status;
		this.response = response;
		this.headers = headers;
		this.result = result;
	}

	static isApiException(obj: any): obj is ApiException {
		return obj.isApiException === true;
	}
}

function throwException(message: string, status: number, response: string, headers: { [key: string]: any; }, result?: any): any {
	if (result !== null && result !== undefined)
		throw result;
	else
		throw new ApiException(message, status, response, headers, null);
}

function isAxiosError(obj: any | undefined): obj is AxiosError {
	return obj && obj.isAxiosError === true;
}
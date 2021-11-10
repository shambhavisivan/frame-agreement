import axios, { AxiosInstance } from 'axios';
import { ERROR_DISPATCHER_URL_MISSING } from '../../constants/errors';
import { remoteActions } from '../remote-actions-salesforce';
import {
	CategoriesInCatalogueResponse,
	ProductsByIdsResponse,
	ProductsInCatalogueResponse,
	ProductsInCategoryResponse
} from './interface';

export interface DispatcherToken {
	token: string;
	userAgent: string;
	expires: number;
	orgId: string;
}

export type GraphQLData =
	| ProductsInCatalogueResponse
	| CategoriesInCatalogueResponse
	| ProductsInCategoryResponse
	| ProductsByIdsResponse
	| undefined;

export interface GraphQLResponse {
	data?: GraphQLData;
	errorMessage?: string[];
	isSuccess: boolean;
}

interface RequestParams {
	method: 'post' | 'get';
	url: string;
	headers?: Record<string, unknown>;
	data?: Record<string, unknown>;
}

export const graphQlEndpoint: RequestParams = {
	method: 'post',
	url: `/pre/graphql`
};

export class DispatcherService {
	private _connection: AxiosInstance;
	private _authToken: DispatcherToken | undefined = undefined;

	constructor(dispatcherServiceUrl: string | undefined) {
		if (!dispatcherServiceUrl) {
			throw Error(ERROR_DISPATCHER_URL_MISSING);
		}
		this._connection = this._getConnection(dispatcherServiceUrl);
	}

	private _getConnection(dispatcherServiceUrl: string): AxiosInstance {
		if (!this._connection) {
			this._connection = axios.create({
				baseURL: dispatcherServiceUrl,
				timeout: 20000
			});
		}

		return this._connection;
	}

	private async _getAuthToken(): Promise<DispatcherToken> {
		if (this._authToken?.expires && this._authToken?.expires > Date.now()) {
			return this._authToken;
		}

		try {
			this._authToken = await remoteActions.getDispatcherAuthToken(navigator.userAgent);
		} catch (error) {
			throw new Error(error.message);
		}

		return this._authToken;
	}

	async queryData(
		query: string,
		variables: Record<string, unknown>,
		requestParams: RequestParams = graphQlEndpoint
	): Promise<GraphQLResponse> {
		if (!query) {
			throw new Error('query cannot be empty!');
		}

		const authToken = await this._getAuthToken();

		if (!requestParams.headers) {
			requestParams.headers = {};
		}
		requestParams.headers['Authorization'] = 'Bearer ' + authToken.token;
		requestParams.headers['Logging'] = true;
		requestParams.headers['Content-Type'] = 'application/json';
		requestParams.headers['User-Agent'] = authToken.userAgent;
		requestParams.data = {};
		requestParams.data.query = query;
		requestParams.data.variables = variables;

		const response = await this._connection.request(requestParams);
		if (response.data.errors) {
			return { errorMessage: response.data.errors, isSuccess: false };
		}

		return {
			data: response.data.data,
			isSuccess: true
		};
	}
}

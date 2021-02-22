"use strict";
const axios = require("axios");
let authTokenCache = null;

/**
 * method helps in getting the authorisation token for PRE requests
 */
const getAuthToken = async () => {
	try {
		if (authTokenCache && authTokenCache.expires > Date.now()) {
			return authTokenCache;
		}

		authTokenCache = await window.SF.invokeAction(
			"getDispatcherAuthToken",
			[navigator.userAgent]
		);
		return authTokenCache;
	} catch (error) {
		throw new Error(error.message);
	}
};

const graphQlEndpoint = {
	method: "post",
	url: `/pre/graphql`,
};

const createConnection = async () => {
	const appSettings = await window.SF.invokeAction("getAppSettings", [
		window.SF.param.account,
	]);
	return axios.create({
		baseURL: appSettings.FACSettings.dispatcherServiceUrl,
		timeout: 5000,
	});
};

/**
 * method helps in establishing rest call to graphql PRE service
 * @param {string} query graphQl query to fetch the required data
 * @param {var1: value} variables supporting query variables map
 * @param { method : 'post', url: '/pre/graphql'} requestParams
 */
export const invokeGraphQLService = async (
	query,
	variables,
	requestParams = graphQlEndpoint
) => {
	if (!query) {
		throw new Error("query cannot be empty!");
	}

	const authToken = await getAuthToken();

	if (!requestParams.headers) {
		requestParams.headers = {};
	}
	requestParams.headers["Authorization"] = "Bearer " + authToken.token;
	requestParams.headers["Logging"] = true;
	requestParams.headers["Content-Type"] = "application/json";
	requestParams.headers["User-Agent"] = authToken.userAgent;
	requestParams.data = {
		query: query,
		variables,
	};

	try {
		const connection = !connection && (await createConnection());
		const response = await connection.request(requestParams);
		if (response.data.errors) {
			return { error: response.data.errors, isSuccess: false };
		}

		return {
			data: response.data.data,
			isSuccess: true,
		};
	} catch (error) {
		throw new Error(error.message);
	}
};

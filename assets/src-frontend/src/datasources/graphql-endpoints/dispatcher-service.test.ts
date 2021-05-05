import { DispatcherService } from './dispatcher-service';
import { mockDispatcherAuthToken } from '../mock-data';
import * as remoteModule from '../remote-actions-salesforce';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

jest.mock('../remote-actions-salesforce', () => ({
	remoteActions: {
		getDispatcherAuthToken: jest.fn()
	}
}));

/* eslint-disable @typescript-eslint/no-explicit-any */
// TODO: ts throwing weird errors should remove eslint rule again.
export function mockFunction<T extends (...args: any[]) => any>(fn: T): jest.MockedFunction<T> {
	return fn as jest.MockedFunction<T>;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

describe('dispatcher service', () => {
	const axiosMock = new MockAdapter(axios);
	const mockGetDispatcherToken = mockFunction(remoteModule.remoteActions.getDispatcherAuthToken);
	const SAMLPLE_DISPATCHER_URL = 'https://cs-messaging-dispatcher-eu-dev.herokuapp.com';
	mockGetDispatcherToken.mockReturnValue(Promise.resolve(mockDispatcherAuthToken));

	const dispatcherService = new DispatcherService(SAMLPLE_DISPATCHER_URL);
	const dispatcherSpy = jest.spyOn(remoteModule.remoteActions, 'getDispatcherAuthToken');

	afterEach(() => {
		jest.clearAllMocks();
		axiosMock.reset();
	});

	test('should call getDispatcherService and return the mocked response', async () => {
		axiosMock.onPost().replyOnce(200, { data: { data: 'sample' } });
		const response = await dispatcherService.queryData(
			'sample-query',
			{ variable1: 'p' },
			{
				method: 'post',
				url: '/graphql/endpoint',
				headers: { sampleheader: 'value' },
				data: {}
			}
		);
		const expected = { data: { data: 'sample' }, isSuccess: true };

		expect(dispatcherSpy).toHaveBeenCalledTimes(1);
		expect(response).toEqual(expected);
	});

	test('should respond with error when the request fails', async () => {
		axiosMock.onPost().replyOnce(200, { errors: ['cannot get data', 'wrong query'] });
		const response = await dispatcherService.queryData(
			'sample-query',
			{ variable1: 'p' },
			{
				method: 'post',
				url: '/graphql/endpoint',
				headers: { sampleheader: 'value' },
				data: {}
			}
		);
		const expected = { errorMessage: ['cannot get data', 'wrong query'], isSuccess: false };

		// should load from cache
		expect(dispatcherSpy).toHaveBeenCalledTimes(0);
		expect(response).toEqual(expected);
	});
});

import { renderHook } from '@testing-library/react-hooks';
import { QueryStatus } from 'react-query';
import { mockUserLocale } from '../datasources/mock-data';
import { remoteActions } from '../datasources/remote-actions-mock';
import { useUserLocale } from './use-user-locale';

describe('test useUserLocale hook', () => {
	const getUserLocale = jest.fn(remoteActions.getUserLocale);

	const remoteActionsWithSpy = {
		...remoteActions,
		getUserLocale
	};

	test('returns user locale and calls getUserLocale once', async () => {
		const { result, waitFor } = renderHook(() =>
			useUserLocale(remoteActionsWithSpy.getUserLocale)
		);

		await waitFor(() => {
			return result.current.status === QueryStatus.Success;
		});

		expect(result.current.locale).toEqual(mockUserLocale);
		expect(getUserLocale.mock.calls.length).toBe(1);
	});
});

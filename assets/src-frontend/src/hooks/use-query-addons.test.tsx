import { renderHook } from '@testing-library/react-hooks';
import { QueryStatus } from 'react-query';
import { remoteActions } from '../datasources';
import { deforcify } from '../datasources/deforcify';
import { STANDALONE_ADDONS } from '../local-server/local_data';
import { useQueryAddons } from './use-query-addons';

jest.mock('../datasources/remote-actions-salesforce', () => ({
	remoteActions: {
		getAppSettings: jest.fn(),
		queryAddons: jest.fn()
	}
}));

describe('test useQueryAddons', () => {
	const queryAddonsSpy = jest
		.spyOn(remoteActions, 'queryAddons')
		.mockReturnValue(Promise.resolve(STANDALONE_ADDONS.map(deforcify)));

	beforeEach(() => {
		queryAddonsSpy.mockClear();
	});

	test('should call the queryaddons remote action', async () => {
		const { waitFor, result } = renderHook(() => useQueryAddons('sample-id'));

		await waitFor(() => result.current.status === QueryStatus.Success);

		expect(queryAddonsSpy).toHaveBeenCalledTimes(1);
		expect(result.current.addonList).toEqual(STANDALONE_ADDONS.map(deforcify));
	});

	test('should not call the queryaddons remote action if price item id is invalid', async () => {
		const { waitFor, result } = renderHook(() => useQueryAddons(''));

		await waitFor(() => result.current.status === QueryStatus.Idle);

		expect(queryAddonsSpy).toHaveBeenCalledTimes(0);
		expect(result.current.addonList).toBeUndefined();
	});
});

import { renderHook } from '@testing-library/react-hooks';
import { QueryStatus } from 'react-query';
import { remoteActions } from '../datasources';
import { deforcify } from '../datasources/deforcify';
import { STANDALONE_ADDONS } from '../local-server/local_data';
import { useGetStandaloneAddons } from './use-get-standalone-addons';

jest.mock('../datasources/remote-actions-salesforce', () => ({
	remoteActions: {
		getAppSettings: jest.fn(),
		getStandaloneAddons: jest.fn()
	}
}));

describe('test useGetStandaloneAddons', () => {
	const getStandaloneAddonsSpy = jest
		.spyOn(remoteActions, 'getStandaloneAddons')
		.mockReturnValue(Promise.resolve(STANDALONE_ADDONS.map(deforcify)));

	test('should call the getStandaloneAddons remote action', async () => {
		const { waitFor, result } = renderHook(() => useGetStandaloneAddons());

		await waitFor(() => result.current.status === QueryStatus.Success);

		expect(getStandaloneAddonsSpy).toHaveBeenCalledTimes(1);
		expect(result.current.standaloneAddons).toEqual(STANDALONE_ADDONS.map(deforcify));
	});
});

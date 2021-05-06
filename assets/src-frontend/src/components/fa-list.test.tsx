import { mockAppSettings, mockFrameAgreements } from '../datasources/mock-data';
import { useFrameAgreements } from '../hooks/use-frame-agreements';
import { useAppSettings } from '../hooks/use-app-settings';
import { useUpsertFrameAgreements } from '../hooks/use-upsert-frame-agreements';
import { mockFunction } from '../test-helper';
import { QueryStatus } from 'react-query';

jest.mock('../hooks/use-frame-agreements', () => ({
	useFrameAgreements: jest.fn()
}));

jest.mock('../hooks/use-app-settings', () => ({
	useAppSettings: jest.fn()
}));

jest.mock('../hooks/use-upsert-frame-agreements', () => ({
	useUpsertFrameAgreements: jest.fn()
}));

const useFAMock = mockFunction(useFrameAgreements);
const useAppSettingsMock = mockFunction(useAppSettings);
const useUpsertFAMock = mockFunction(useUpsertFrameAgreements);

describe.skip('framework agreement list page', () => {
	beforeAll(() => {
		useFAMock.mockReturnValue({ status: QueryStatus.Success, agreements: mockFrameAgreements });
		useAppSettingsMock.mockReturnValue({
			status: QueryStatus.Success,
			settings: mockAppSettings
		});

		useUpsertFAMock.mockReturnValue({
			status: QueryStatus.Success,
			mutate: () => Promise.resolve({} as unknown)
		});
	});

	it.todo('Respective tests should be added the mock UI is updated');
});

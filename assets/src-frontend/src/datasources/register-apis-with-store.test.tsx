import React from 'react';
import { render } from '@testing-library/react';
import { FamWindow } from './register-apis';
import { RegisterApisWithStore } from './register-apis-with-store';
import { FrameAgreement } from '.';
import { CUSTOM_LABELS_MOCK, mockFrameAgreements } from './mock-data';
import { DetailsProvider } from '../components/fa-details/details-page-provider';

describe('RegisterApis', () => {
	const globalAny: FamWindow = (global as unknown) as FamWindow;
	globalAny.FAM = {};

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('getActiveFrameAgreement', () => {
		test('should return the current active frame agreement in fa editor', () => {
			render(
				<DetailsProvider agreement={mockFrameAgreements[0] || ({} as FrameAgreement)}>
					<RegisterApisWithStore />
				</DetailsProvider>
			);
			const mockFaId = mockFrameAgreements[0].id;
			const getActiveFrameAgreementFunc = globalAny?.FAM?.api
				?.getActiveFrameAgreement as () => FrameAgreement;
			const activeFa = getActiveFrameAgreementFunc();
			expect(activeFa.id).toEqual(mockFaId);
		});

		test('should throw an error if no active fa found', () => {
			render(<RegisterApisWithStore />);
			const getActiveFrameAgreementFunc = globalAny?.FAM?.api
				?.getActiveFrameAgreement as () => FrameAgreement;
			expect(getActiveFrameAgreementFunc).toThrowError(CUSTOM_LABELS_MOCK.no_active_fa);
		});
	});
});

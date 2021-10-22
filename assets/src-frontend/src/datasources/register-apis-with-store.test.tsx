import React from 'react';
import { render } from '@testing-library/react';
import { RegisterApisWithStore } from './register-apis-with-store';
import { FrameAgreement, remoteActions } from '.';
import { CUSTOM_LABELS_MOCK, mockFrameAgreements } from './mock-data';
import { DetailsProvider } from '../components/fa-details/details-page-provider';
import { QueryKeys, FA_STATUS_FIELD_NAME } from '../app-constants';
import * as reactQuery from 'react-query';
import * as deforcify from './deforcify';
import { FamWindow } from './register-apis';

describe('RegisterApisWithStore', () => {
	const setQueryData = jest.fn();
	const useQueryCache = jest.fn().mockReturnValue({
		setQueryData
	});
	jest.spyOn(reactQuery, 'useQueryCache').mockImplementation(useQueryCache);

	const globalAny: FamWindow = (global as unknown) as FamWindow;
	globalAny.FAM = {};

	jest.spyOn(remoteActions, 'queryFrameAgreements').mockImplementation(
		jest.fn(() => Promise.resolve(mockFrameAgreements))
	);

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

	describe('updateFrameAgreement', () => {
		test('should update the frame agreement in query cache', async () => {
			const mockFaId = 'a1t1t0000009wpQAAQ';
			const fakeStatus = 'Active';
			const field = FA_STATUS_FIELD_NAME;

			const deforcifySpy = jest.spyOn(deforcify, 'deforcify');

			const updateFrameAgreementFunc = globalAny?.FAM?.api?.updateFrameAgreement as (
				faId: string,
				field: keyof SfGlobal.FrameAgreement,
				value: string | number | undefined
			) => Promise<void>;
			await updateFrameAgreementFunc(mockFaId, field, fakeStatus);

			expect(deforcifySpy).toBeCalledWith({ [field]: fakeStatus });
			expect(setQueryData).toBeCalledWith(QueryKeys.frameagreement, expect.any(Function));
		});

		test('should throw error when an incorrect frame agreement is given', async () => {
			const incorrectFaId = 'incorrectFaId';
			const fakeStatus = 'Active';
			const field = FA_STATUS_FIELD_NAME;
			const deforcifySpy = jest.spyOn(deforcify, 'deforcify');

			const updateFrameAgreementFunc = globalAny?.FAM?.api?.updateFrameAgreement as (
				faId: string,
				field: keyof SfGlobal.FrameAgreement,
				value: string | number | undefined
			) => Promise<void>;

			await expect(
				updateFrameAgreementFunc(incorrectFaId, field, fakeStatus)
			).rejects.toThrow(CUSTOM_LABELS_MOCK.incorrect_fa);

			expect(deforcifySpy).toHaveBeenCalledTimes(0);
			expect(setQueryData).toHaveBeenCalledTimes(0);
		});
	});

	describe('setStatusOfFrameAgreement', () => {
		test('should update the new status of a frame agreement', async () => {
			const upsertFrameAgreementsSpy = jest
				.spyOn(remoteActions, 'upsertFrameAgreements')
				.mockReturnValue(Promise.resolve(mockFrameAgreements[0]));

			render(
				<DetailsProvider agreement={mockFrameAgreements[0] || ({} as FrameAgreement)}>
					<RegisterApisWithStore />
				</DetailsProvider>
			);

			const mockFaId = mockFrameAgreements[0].id;

			const setStatusOfFrameAgreementFunc = globalAny?.FAM?.api
				?.setStatusOfFrameAgreement as (faId: string, newState: string) => Promise<string>;

			const updateResult = await setStatusOfFrameAgreementFunc(mockFaId, 'Active');

			expect(updateResult).toEqual('Success');
			expect(upsertFrameAgreementsSpy.mock.calls.length).toBe(1);
			expect(upsertFrameAgreementsSpy).toBeCalledWith(mockFaId, {
				//eslint-disable-next-line @typescript-eslint/naming-convention
				csconta__Status__c: 'Active'
			});
		});

		test('should return an error message when frame agreement status update is unsuccessful', async () => {
			const mockUpdateResult = 'DML Exception';
			const upsertFrameAgreementsSpy = jest
				.spyOn(remoteActions, 'upsertFrameAgreements')
				.mockReturnValue(Promise.reject(mockUpdateResult));

			render(<RegisterApisWithStore />);

			const mockFaId = mockFrameAgreements[0].id;

			const setStatusOfFrameAgreementFunc = globalAny?.FAM?.api
				?.setStatusOfFrameAgreement as (faId: string, newState: string) => Promise<string>;

			const updateResult = await setStatusOfFrameAgreementFunc(mockFaId, 'Active');

			expect(updateResult !== 'Success').toBeTruthy();
			expect(updateResult).toEqual(CUSTOM_LABELS_MOCK.no_active_fa);
			expect(upsertFrameAgreementsSpy.mock.calls.length).toBe(0);
		});
	});

	describe('refreshFrameAgreement', () => {
		test('should reset the frame agreement in query cache', async () => {
			render(
				<DetailsProvider agreement={mockFrameAgreements[0] || ({} as FrameAgreement)}>
					<RegisterApisWithStore />
				</DetailsProvider>
			);
			const spyOnGetFrameAgreements = jest
				.spyOn(remoteActions, 'getFrameAgreement')
				.mockResolvedValue(mockFrameAgreements[0]);

			const refreshFrameAgreementFunc = globalAny?.FAM?.api?.refreshFa as (
				faId: string
			) => Promise<SfGlobal.FrameAgreementAttachment>;

			const refreshedAgreement = await refreshFrameAgreementFunc(mockFrameAgreements[0].id);

			expect(spyOnGetFrameAgreements).toBeCalledTimes(1);
			expect(refreshedAgreement.frameAgreement.csconta__Status__c).toBe(
				mockFrameAgreements[0].status
			);

			spyOnGetFrameAgreements.mockClear();
		});
	});
});

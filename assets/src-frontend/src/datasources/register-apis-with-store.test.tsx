import React from 'react';
import { render } from '@testing-library/react';
import { FamWindow } from './register-apis';
import { RegisterApisWithStore } from './register-apis-with-store';
import { Attachment, FrameAgreement, remoteActions } from '.';
import { attachment, CUSTOM_LABELS_MOCK, mockFrameAgreements } from './mock-data';
import { DetailsProvider, store } from '../components/fa-details/details-page-provider';
import { QueryKeys, FA_STATUS_FIELD_NAME } from '../app-constants';
import * as reactQuery from 'react-query';
import * as deforcify from './deforcify';
import { Negotiation } from '../components/fa-details/negotiation/details-reducer';
import { AgreementService } from '../service/agreementService';
import { approval } from '../local-server/local_data';

describe('RegisterApisWithStore', () => {
	const setQueryData = jest.fn();
	const getDefaultConfig = jest.fn();
	const useQueryCache = jest.fn().mockReturnValue({
		setQueryData,
		getDefaultConfig
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

	const mockState: Negotiation = {
		negotiation: { products: {}, offers: {}, addons: {}, custom: undefined },
		activeFa: mockFrameAgreements[0]
	};
	const mockDispatch = jest.fn();

	describe('getActiveFrameAgreement', () => {
		test('should return the current active frame agreement in fa editor', () => {
			const mockFaId = mockFrameAgreements[0].id;
			render(
				<DetailsProvider agreement={mockFrameAgreements[0] || ({} as FrameAgreement)}>
					<RegisterApisWithStore />
				</DetailsProvider>
			);

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

	describe('setCustomData', () => {
		test('should update the custom data to application state by calling reducer dispatch', async () => {
			const useQuery = jest.fn().mockReturnValue({
				status: reactQuery.QueryStatus.Success,
				agreementList: mockFrameAgreements
			});
			jest.spyOn(reactQuery, 'useQuery').mockImplementation(useQuery);
			const getActiveFaSpy = jest.spyOn(
				AgreementService.prototype,
				'getActiveFrameAgreement'
			);
			const mockUseContext = jest
				.spyOn(React, 'useContext')
				.mockImplementation(() => ({ ...mockState, dispatch: mockDispatch }));

			render(
				<DetailsProvider agreement={mockFrameAgreements[0] || ({} as FrameAgreement)}>
					<RegisterApisWithStore />
				</DetailsProvider>
			);

			const customDataInput = 'test data';

			const setCustomDataFunc = globalAny?.FAM?.api?.setCustomData as (
				faId: string,
				data: string | Promise<string | Record<string, unknown>>
			) => Promise<void>;
			await setCustomDataFunc(mockFrameAgreements[0].id, customDataInput);

			expect(getActiveFaSpy).toBeCalled();
			expect(mockDispatch).toBeCalledWith({
				type: 'setCustomData',
				payload: {
					data: customDataInput
				}
			});
			expect(mockUseContext).toBeCalledWith(store);
		});

		test('should throw an error when the given FA is not the activeFa', async () => {
			const customDataInput = 'test data';
			const inactiveFaId = mockFrameAgreements[1].id;
			const getActiveFaSpy = jest.spyOn(
				AgreementService.prototype,
				'getActiveFrameAgreement'
			);

			const setCustomDataFunc = globalAny?.FAM?.api?.setCustomData as (
				faId: string,
				data: string | Promise<string | Record<string, unknown>>
			) => Promise<void>;

			await expect(setCustomDataFunc(inactiveFaId, customDataInput)).rejects.toThrowError(
				CUSTOM_LABELS_MOCK.not_the_active_fa
			);
			expect(getActiveFaSpy).toBeCalled();
		});
	});

	describe('getCustomData', () => {
		test('should fetch the updated custom data back from application state', async () => {
			const customDataInput = 'test data';
			const mockUseContext = jest.spyOn(React, 'useContext').mockImplementation(() => ({
				...mockState,
				negotiation: { ...mockState.negotiation, custom: customDataInput },
				dispatch: mockDispatch
			}));
			const getActiveFaSpy = jest.spyOn(
				AgreementService.prototype,
				'getActiveFrameAgreement'
			);
			render(
				<DetailsProvider agreement={mockFrameAgreements[0] || ({} as FrameAgreement)}>
					<RegisterApisWithStore />
				</DetailsProvider>
			);

			const getCustomDataFunc = globalAny?.FAM?.api?.getCustomData as (
				faId: string
			) => Promise<string | Record<string, unknown>>;
			const cusomDataOutput = await getCustomDataFunc(mockFrameAgreements[0].id);

			expect(getActiveFaSpy).toBeCalled();
			expect(cusomDataOutput).toEqual(customDataInput);
			expect(mockUseContext).toBeCalledWith(store);
		});

		test('should throw an error when the given FA is not the activeFa', async () => {
			const inactiveFaId = mockFrameAgreements[1].id;
			const getActiveFaSpy = jest.spyOn(
				AgreementService.prototype,
				'getActiveFrameAgreement'
			);

			const getCustomDataFunc = globalAny?.FAM?.api?.getCustomData as (
				faId: string
			) => Promise<void>;

			await expect(getCustomDataFunc(inactiveFaId)).rejects.toThrowError(
				CUSTOM_LABELS_MOCK.not_the_active_fa
			);
			expect(getActiveFaSpy).toBeCalled();
		});
	});

	describe('getAttachment', () => {
		test('should return the parsed atatchment object by calling the remote action and update the query cache', async () => {
			const fakeFaId = mockFrameAgreements[0].id;
			const getAttachmentBodySpy = jest
				.spyOn(remoteActions, 'getAttachmentBody')
				.mockReturnValue(Promise.resolve(attachment));
			const getActiveFaSpy = jest.spyOn(
				AgreementService.prototype,
				'getActiveFrameAgreement'
			);
			render(
				<DetailsProvider agreement={mockFrameAgreements[0] || ({} as FrameAgreement)}>
					<RegisterApisWithStore />
				</DetailsProvider>
			);

			const getAttachmentFunc = globalAny?.FAM?.api?.getAttachment as (
				faId: string
			) => Promise<Attachment>;
			const faAttachment = await getAttachmentFunc(fakeFaId);

			expect(faAttachment).toEqual(attachment);
			expect(getActiveFaSpy).toBeCalled();
			expect(getAttachmentBodySpy.mock.calls.length).toBe(1);
			expect(getAttachmentBodySpy).toBeCalledWith(fakeFaId);
			expect(setQueryData).toBeCalledWith([QueryKeys.faAttachment, fakeFaId], attachment);
		});

		test('should throw an error when the given FA is not the activeFa', async () => {
			const inactiveFaId = mockFrameAgreements[1].id;
			const getActiveFaSpy = jest.spyOn(
				AgreementService.prototype,
				'getActiveFrameAgreement'
			);

			const getAttachmentFunc = globalAny?.FAM?.api?.getAttachment as (
				faId: string
			) => Promise<Attachment>;

			await expect(getAttachmentFunc(inactiveFaId)).rejects.toThrowError(
				CUSTOM_LABELS_MOCK.not_the_active_fa
			);
			expect(getActiveFaSpy).toBeCalled();
		});
	});

	describe('submitForApproval', () => {
		const getFrameAgreementSpy = jest
			.spyOn(remoteActions, 'getFrameAgreement')
			.mockResolvedValue(mockFrameAgreements[0]);

		const getAttachmentBodySpy = jest
			.spyOn(remoteActions, 'getAttachmentBody')
			.mockResolvedValue(attachment);

		const approvalHistorySpy = jest
			.spyOn(remoteActions, 'getApprovalHistory')
			.mockImplementation(jest.fn(() => Promise.resolve(deforcify.deforcify(approval))));

		const mockFaId = mockFrameAgreements[0].id;

		test('should submit the frame agreement for approval refetch fa and history.', async () => {
			const submitForApprovalSpy = jest
				.spyOn(remoteActions, 'submitForApproval')
				.mockResolvedValue(true);

			const submitForApprovalunc = globalAny?.FAM?.api?.submitForApproval as (
				faId: string
			) => Promise<boolean>;

			const result = await submitForApprovalunc(mockFaId);

			expect(result).toBeTruthy();
			expect(getFrameAgreementSpy).toBeCalledWith(mockFaId);
			expect(submitForApprovalSpy).toBeCalledWith(mockFaId);
			expect(getAttachmentBodySpy).toBeCalledWith(mockFaId);
			expect(approvalHistorySpy).toBeCalledWith(mockFaId);
			expect(setQueryData).toBeCalledWith(
				[QueryKeys.approvalHistory, mockFaId],
				deforcify.deforcify(approval)
			);
		});

		test('should return false when fa is submitted for approval again. and not refetch fa and history.', async () => {
			const submitForApprovalSpy = jest
				.spyOn(remoteActions, 'submitForApproval')
				.mockResolvedValue(false);

			const submitForApprovalunc = globalAny?.FAM?.api?.submitForApproval as (
				faId: string
			) => Promise<boolean>;

			const result = await submitForApprovalunc(mockFaId);

			expect(result).toBeFalsy();
			expect(getFrameAgreementSpy).toBeCalledTimes(0);
			expect(submitForApprovalSpy).toBeCalledWith(mockFaId);
			expect(getAttachmentBodySpy).toBeCalledTimes(0);
			expect(approvalHistorySpy).toBeCalledTimes(0);
			expect(setQueryData).toBeCalledTimes(0);
		});
	});
});

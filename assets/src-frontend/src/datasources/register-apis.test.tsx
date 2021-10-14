import { remoteActions } from '../datasources/remote-actions-salesforce';
import { App } from '../components/app';
import * as reactQuery from 'react-query';
import React from 'react';
import { act, render } from '@testing-library/react';
import { FamWindow } from './register-apis';
import { attachment, CUSTOM_LABELS_MOCK, mockFrameAgreements } from './mock-data';
import { QueryKeys } from '../app-constants';
import { Attachment } from '.';
import * as deforcify from './deforcify';

describe('RegisterApis', () => {
	const setQueryData = jest.fn();
	const useQueryCache = jest.fn().mockReturnValue({
		setQueryData
	});
	jest.spyOn(reactQuery, 'useQueryCache').mockImplementation(useQueryCache);
	jest.spyOn(remoteActions, 'queryFrameAgreements').mockImplementation(
		jest.fn(() => Promise.resolve(mockFrameAgreements))
	);

	const globalAny: FamWindow = (global as unknown) as FamWindow;
	globalAny.FAM = {};
	render(<App />);

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('getAttachment', () => {
		test('should return the parsed atatchment object by calling the remote action and update the query cache', async () => {
			const fakeFaId = 'fakeFaId';
			const getAttachmentBodySpy = jest
				.spyOn(remoteActions, 'getAttachmentBody')
				.mockReturnValue(Promise.resolve(attachment));

			const getAttachmentFunc = globalAny?.FAM?.api?.getAttachment as (
				faId: string
			) => Promise<Attachment>;

			let faAttachment: Attachment | undefined = undefined;
			await act(async () => {
				faAttachment = await getAttachmentFunc(fakeFaId);
			});

			expect(faAttachment).toEqual(attachment);
			expect(getAttachmentBodySpy.mock.calls.length).toBe(1);
			expect(getAttachmentBodySpy).toBeCalledWith(fakeFaId);
			expect(setQueryData).toBeCalledWith([QueryKeys.faAttachment, fakeFaId], attachment);
		});
	});

	describe('updateFrameAgreement', () => {
		test('should update the frame agreement in query cache', async () => {
			const mockFaId = 'a1t1t0000009wpQAAQ';
			const fakeStatus = 'Active';
			const field = 'csconta__Status__c';

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
			const field = 'csconta__Status__c';
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
});

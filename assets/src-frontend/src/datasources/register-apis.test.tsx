import { remoteActions } from '../datasources/remote-actions-salesforce';
import * as reactQuery from 'react-query';
import React from 'react';
import { act, render } from '@testing-library/react';
import { FamWindow } from './register-apis';
import { attachment, mockFrameAgreements, mockAppSettings } from './mock-data';
import { approval, approval2 } from '../local-server/local_data';
import { QueryKeys } from '../app-constants';
import { Attachment } from '.';
import * as deforcify from './deforcify';
import { RegisterApis } from './register-apis';
import { CSToastApi, CSToastVariant } from '@cloudsense/cs-ui-components';

describe('RegisterApis', () => {
	const setQueryData = jest.fn();
	const useQueryCache = jest.fn().mockReturnValue({
		setQueryData
	});
	jest.spyOn(reactQuery, 'useQueryCache').mockImplementation(useQueryCache);

	jest.spyOn(remoteActions, 'queryFrameAgreements').mockImplementation(
		jest.fn(() => Promise.resolve(mockFrameAgreements))
	);

	jest.spyOn(remoteActions, 'getAppSettings').mockImplementation(
		jest.fn(() => Promise.resolve(mockAppSettings))
	);

	const globalAny: FamWindow = (global as unknown) as FamWindow;
	globalAny.FAM = {};
	render(<RegisterApis />);

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

	describe('isAgreementEditable', () => {
		test('should return true if a frame agreement is editable', async () => {
			const approvalHistorySpy = jest
				.spyOn(remoteActions, 'getApprovalHistory')
				.mockImplementation(jest.fn(() => Promise.resolve(deforcify.deforcify(approval))));

			const mockFaId = 'a1t1t0000009wpQAAQ';

			const isAgreementEditableFunc = globalAny?.FAM?.api?.isAgreementEditable as (
				faId: string
			) => Promise<boolean>;

			const editable = await isAgreementEditableFunc(mockFaId);

			expect(editable).toBe(true);
			expect(setQueryData).toBeCalledWith(
				[QueryKeys.approvalHistory, mockFaId],
				deforcify.deforcify(approval)
			);
			expect(approvalHistorySpy).toBeCalledWith(mockFaId);
		});

		test('should return false if a frame agreement is not editable', async () => {
			const approvalHistorySpy = jest
				.spyOn(remoteActions, 'getApprovalHistory')
				.mockImplementation(jest.fn(() => Promise.resolve(deforcify.deforcify(approval2))));

			const mockFaId = 'a1t1t0000009wpQAAP';

			const isAgreementEditableFunc = globalAny?.FAM?.api?.isAgreementEditable as (
				faId: string
			) => Promise<boolean>;

			const editable = await isAgreementEditableFunc(mockFaId);

			expect(editable).toBe(false);
			expect(setQueryData).toBeCalledWith(
				[QueryKeys.approvalHistory, mockFaId],
				deforcify.deforcify(approval2)
			);
			expect(approvalHistorySpy).toBeCalledWith(mockFaId);
		});
	});

	describe('toast', () => {
		const csToastApiSpy = jest.spyOn(CSToastApi, 'renderCSToast');
		test('should display the toast message by calling CSToastApi', async () => {
			const toastType: CSToastVariant = 'success';
			const title = 'Toast Title';
			const message = 'Toast Message';
			const timeout = 1000; // milliseconds

			const toastFunc = globalAny?.FAM?.api?.toast as (
				type: CSToastVariant,
				title: string,
				message: string,
				timeout: number
			) => void;
			toastFunc(toastType, title, message, timeout);

			expect(csToastApiSpy).toBeCalledWith(
				{ variant: toastType, text: title, detail: message, closeButton: true },
				'top-right',
				timeout / 1000
			);
		});
	});

	describe('test clear all toasts', () => {
		const csToastApiSpy = jest.spyOn(CSToastApi, 'clearAllToasts');
		test('should clear the toast bar', async () => {
			const clearToastFunc = globalAny?.FAM?.api?.clearToasts as () => void;
			clearToastFunc();

			expect(csToastApiSpy).toBeCalledTimes(1);
		});
	});
});

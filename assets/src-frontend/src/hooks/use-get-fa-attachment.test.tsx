import { renderHook } from '@testing-library/react-hooks';
import React, { ReactElement } from 'react';
import { queryCache, QueryStatus } from 'react-query';
import { remoteActions } from '../datasources/remote-actions-salesforce';
import { RemoteActionsProvider } from '../providers/app-settings-provider';
import { useGetFaAttachment } from './use-get-fa-attachment';
import { attachment } from '../datasources/mock-data';

jest.mock('../datasources/remote-actions-salesforce', () => ({
	remoteActions: {
		getAppSettings: jest.fn(),
		getAttachment: jest.fn()
	}
}));

describe('test usegetFaAttachment', () => {
	const getAttachmentSpy = jest
		.spyOn(remoteActions, 'getAttachment')
		.mockReturnValueOnce(Promise.resolve(attachment));
	test('should call getAttachment with required param', async () => {
		const wrapper = ({ children }: { children: ReactElement }): ReactElement => (
			<RemoteActionsProvider queryCache={queryCache} remoteActions={remoteActions}>
				{children}
			</RemoteActionsProvider>
		);

		const { result, waitFor } = renderHook(() => useGetFaAttachment('some-faid'), {
			wrapper
		});

		await waitFor(() => {
			return result.current.attachmentStatus === QueryStatus.Success;
		});

		expect(getAttachmentSpy).toHaveBeenCalledTimes(1);
		expect(getAttachmentSpy).toHaveBeenCalledWith('some-faid');
		expect(result.current.attachment).toStrictEqual(attachment);
	});
});

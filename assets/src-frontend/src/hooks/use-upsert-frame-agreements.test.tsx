import { act, renderHook } from '@testing-library/react-hooks';
import { remoteActions } from '../datasources/remote-actions-mock';
import { useUpsertFrameAgreements } from './use-upsert-frame-agreements';
import * as reactQuery from 'react-query';
import { QueryKeys } from '../app-constants';

describe('test useUpsertFrameAgreements hook', () => {
	const upsertFrameAgreements = jest.fn(remoteActions.upsertFrameAgreements);

	const remoteActionsWithSpy = {
		...remoteActions,
		upsertFrameAgreements
	};

	const setQueryData = jest.fn();
	const useQueryCache = jest.fn().mockReturnValue({
		setQueryData
	});
	jest.spyOn(reactQuery, 'useQueryCache').mockImplementation(useQueryCache);

	test('returns mutate function to upsert the frame agreement', async () => {
		const fakeFaId = 'fakeFaId';
		const fakeApprovalStatus = 'Requires Approval';
		// eslint-disable-next-line @typescript-eslint/naming-convention
		const fakeFieldData = { csconta__Status__c: fakeApprovalStatus };

		const { result } = renderHook(() =>
			useUpsertFrameAgreements(remoteActionsWithSpy.upsertFrameAgreements)
		);

		await act(async () => {
			await result.current.mutate({
				faId: fakeFaId,
				fieldData: fakeFieldData
			});
		});

		expect(upsertFrameAgreements.mock.calls.length).toBe(1);
		expect(upsertFrameAgreements).toBeCalledWith(fakeFaId, fakeFieldData);
		expect(setQueryData).toBeCalledWith([QueryKeys.frameagreement], expect.any(Function));
	});
});

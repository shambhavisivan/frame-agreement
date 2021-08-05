import { QueryStatus, useQuery } from 'react-query';
import { QueryKeys } from '../app-constants';
import { Attachment, remoteActions } from '../datasources';

export function useGetFaAttachment(
	faId: string
): {
	attachment: Attachment | undefined;
	attachmentStatus: QueryStatus;
} {
	const { data, status } = useQuery([QueryKeys.faAttachment, faId], () =>
		remoteActions.getAttachment(faId)
	);

	return {
		attachment: data,
		attachmentStatus: status
	};
}

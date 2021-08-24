import { QueryStatus, useQuery } from 'react-query';
import { QueryKeys } from '../app-constants';
import { Attachment, remoteActions } from '../datasources';

export function useGetFaAttachment(
	faId: string
): {
	attachment: Attachment | undefined;
	attachmentStatus: QueryStatus;
} {
	const isEnabled = Boolean(faId);

	const { data, status } = useQuery(
		[QueryKeys.faAttachment, faId],
		() => remoteActions.getAttachmentBody(faId),
		{
			enabled: isEnabled
		}
	);

	return {
		attachment: data,
		attachmentStatus: status
	};
}

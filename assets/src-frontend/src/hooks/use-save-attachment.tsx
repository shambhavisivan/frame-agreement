import { QueryStatus, useMutation, useQueryCache } from 'react-query';
import { QueryKeys } from '../app-constants';
import { Attachment, remoteActions } from '../datasources';

export { QueryStatus } from 'react-query';

interface SaveAttachmentProps {
	faId: string;
	attachment: Attachment;
}

export function useSaveAttachment(
	saveAttachment: (
		faId: string,
		attachment: Attachment
	) => Promise<string> = remoteActions.saveAttachment
): {
	status: QueryStatus;
	mutate: (opts: SaveAttachmentProps) => Promise<string | undefined>;
} {
	const queryCache = useQueryCache();
	const [mutate, { status }] = useMutation<string, Error, SaveAttachmentProps>(
		({ attachment, faId }: SaveAttachmentProps) => {
			return saveAttachment(faId, attachment);
		},
		{
			onSuccess: (attachmentString: string, { faId }) => {
				queryCache.setQueryData(
					[QueryKeys.faAttachment, faId],
					JSON.parse(attachmentString)
				);
			}
		}
	);

	return {
		mutate,
		status
	};
}

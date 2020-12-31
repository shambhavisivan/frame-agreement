import { QueryStatus, useMutation } from 'react-query';
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
	const [mutate, { status }] = useMutation<string, Error, SaveAttachmentProps>(
		({ attachment, faId }: SaveAttachmentProps) => saveAttachment(faId, attachment)
	);

	return {
		mutate,
		status
	};
}

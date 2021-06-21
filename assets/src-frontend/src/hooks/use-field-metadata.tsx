import { QueryStatus, useQuery } from 'react-query';
import { FieldMetadata, remoteActions } from '../datasources';

export function useFieldMetadata(
	sObjectName: string
): {
	metadataStatus: QueryStatus;
	metadata: FieldMetadata[] | undefined;
} {
	const { data, status } = useQuery(
		['getFieldMetadata', sObjectName],
		remoteActions.getFieldMetadata
	);

	return {
		metadataStatus: status,
		metadata: data
	};
}

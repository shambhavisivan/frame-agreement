import { QueryStatus, useQuery } from 'react-query';
import { Addon, remoteActions } from '../datasources';

export function useQueryAddons(
	priceItemId: string,
	lastRecordId: string | null = null,
	limit: number | null = null
): {
	addonList: Addon[] | undefined;
	status: QueryStatus;
} {
	const { data, status } = useQuery(
		[priceItemId, lastRecordId, limit],
		() => remoteActions.queryAddons(priceItemId, lastRecordId, limit),
		{ enabled: !!priceItemId }
	);

	return {
		addonList: data,
		status
	};
}

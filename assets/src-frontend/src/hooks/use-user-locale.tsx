import { QueryStatus, useQuery } from 'react-query';
import { remoteActions, UserLocaleInfo } from '../datasources';

export function useUserLocale(
	getUserLocale: () => Promise<UserLocaleInfo> = remoteActions.getUserLocale
): {
	status: QueryStatus;
	locale: UserLocaleInfo | undefined;
} {
	const { status, data } = useQuery('userLocale', getUserLocale);

	return {
		status,
		locale: data
	};
}

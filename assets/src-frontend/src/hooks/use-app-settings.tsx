import { useQuery, QueryStatus } from 'react-query';
import { remoteActions, AppSettings } from '../datasources';

export { QueryStatus } from 'react-query';

export function useAppSettings(): {
	status: QueryStatus;
	settings: AppSettings | undefined;
} {
	const { status, data } = useQuery('appSettings', remoteActions.getAppSettings);

	return {
		status,
		settings: data
	};
}

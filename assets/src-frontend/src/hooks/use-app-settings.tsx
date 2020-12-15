import { useQuery, QueryStatus } from 'react-query';
import { remoteActions, AppSettings } from '../datasources';

export { QueryStatus } from 'react-query';

export function useAppSettings(
	getAppSettings: () => Promise<AppSettings> = remoteActions.getAppSettings
): {
	status: QueryStatus;
	settings: AppSettings | undefined;
} {
	const { status, data } = useQuery('appSettings', getAppSettings);

	return {
		status,
		settings: data
	};
}

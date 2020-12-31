import { QueryStatus, useQuery } from 'react-query';
import { AppSettings, remoteActions } from '../datasources';

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

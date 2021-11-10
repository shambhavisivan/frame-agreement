import { QueryStatus, useQuery } from 'react-query';
import { QueryKeys } from '../app-constants';
import { Addon, remoteActions } from '../datasources';

export function useGetStandaloneAddons(): {
	standaloneAddons: Addon[] | undefined;
	status: QueryStatus;
} {
	const { data: standaloneAddons, status } = useQuery(
		[QueryKeys.standaloneAddons],
		remoteActions.getStandaloneAddons
	);

	return {
		standaloneAddons,
		status
	};
}

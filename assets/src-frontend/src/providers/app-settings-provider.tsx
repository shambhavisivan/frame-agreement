import React, { PropsWithChildren, ReactElement, useEffect } from 'react';
import { QueryCache, ReactQueryCacheProvider } from 'react-query';
import type { RemoteActions } from '../datasources';

export function RemoteActionsProvider<T>({
	children,
	queryCache,
	remoteActions
}: PropsWithChildren<T> & { queryCache: QueryCache; remoteActions: RemoteActions }): ReactElement {
	useEffect(() => {
		queryCache.prefetchQuery('appSettings', remoteActions.getAppSettings);
	}, [queryCache, remoteActions.getAppSettings]);

	return <ReactQueryCacheProvider queryCache={queryCache}>{children}</ReactQueryCacheProvider>;
}

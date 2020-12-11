import React, { PropsWithChildren, ReactElement } from 'react';
import { QueryCache, ReactQueryCacheProvider } from 'react-query';
import { remoteActions } from '../datasources';

const queryCache = new QueryCache();
// Should this be done from useEffect?
queryCache.prefetchQuery('appSettings', remoteActions.getAppSettings);

export function AppSettingsProvider<T>({ children }: PropsWithChildren<T>): ReactElement {
	return <ReactQueryCacheProvider queryCache={queryCache}>{children}</ReactQueryCacheProvider>;
}

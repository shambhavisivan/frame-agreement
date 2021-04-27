import React, { ReactElement } from 'react';
import { QueryCache } from 'react-query';
import { ReactQueryDevtools } from 'react-query-devtools';
import { remoteActions } from '../datasources';
import { RemoteActionsProvider } from '../providers/app-settings-provider';
import { Header } from './header';
import { Pages } from './pages';

const queryCache = new QueryCache({
	defaultConfig: {
		queries: {
			refetchOnWindowFocus: false,
			retry: 2
		}
	}
});

export function App(): ReactElement {
	return (
		<div className="cs-app-wrapper">
			<RemoteActionsProvider queryCache={queryCache} remoteActions={remoteActions}>
				<Header />
				<Pages />
				<ReactQueryDevtools initialIsOpen={false} />
			</RemoteActionsProvider>
		</div>
	);
}

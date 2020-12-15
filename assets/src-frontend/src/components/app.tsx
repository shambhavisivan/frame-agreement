import React, { ReactElement } from 'react';
import { QueryCache } from 'react-query';
import { ReactQueryDevtools } from 'react-query-devtools';
import { remoteActions } from '../datasources';
import { RemoteActionsProvider } from '../providers/app-settings-provider';
import { Header } from './header';
import { Pages } from './pages';

const queryCache = new QueryCache();

export function App(): ReactElement {
	return (
		<>
			<RemoteActionsProvider queryCache={queryCache} remoteActions={remoteActions}>
				<Header />
				<Pages />
			</RemoteActionsProvider>
			<ReactQueryDevtools initialIsOpen={false} />
		</>
	);
}

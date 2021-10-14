import React, { ReactElement } from 'react';
import { QueryCache } from 'react-query';
import { ReactQueryDevtools } from 'react-query-devtools';
import { remoteActions } from '../datasources';
import { RegisterApis } from '../datasources/register-apis';
import { RemoteActionsProvider } from '../providers/app-settings-provider';
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
				{/* RegisterApis Component Exposes the APIs to window.FAM.api */}
				<RegisterApis />
				<Pages />
				<ReactQueryDevtools initialIsOpen={false} />
			</RemoteActionsProvider>
		</div>
	);
}

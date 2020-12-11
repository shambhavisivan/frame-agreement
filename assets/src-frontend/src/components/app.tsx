import React, { ReactElement } from 'react';
import { ReactQueryDevtools } from 'react-query-devtools';
import { AppSettingsProvider } from '../providers/app-settings-provider';
import { Header } from './header';

export function App(): ReactElement {
	return (
		<>
			<AppSettingsProvider>
				<Header />
			</AppSettingsProvider>
			<ReactQueryDevtools initialIsOpen={false} />
		</>
	);
}

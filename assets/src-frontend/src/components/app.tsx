import React, { useEffect, useState } from 'react';
import { remoteActions, AppSettings } from '../datasources';

export function App(): React.ReactElement {
	const [appSettings, setAppSettings] = useState<AppSettings | undefined>(undefined);

	useEffect(() => {
		async function getSettings(): Promise<void> {
			setAppSettings(await remoteActions.getAppSettings());
		}

		getSettings();
	});

	return <div>@to-do: implement app.tsx {JSON.stringify(appSettings)}</div>;
}

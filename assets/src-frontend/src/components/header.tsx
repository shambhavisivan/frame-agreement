import React, { ReactElement } from 'react';
import { useAppSettings, QueryStatus } from '../hooks/use-app-settings';

export function Header(): ReactElement {
	const { status, settings } = useAppSettings();

	if (status === QueryStatus.Loading) {
		return <span>Loading...</span>;
	}

	if (status === QueryStatus.Error) {
		return <span>Error</span>;
	}

	return (
		<div>
			<span>Frame Agreement Negotiation Console: {settings?.account.name}</span>
		</div>
	);
}

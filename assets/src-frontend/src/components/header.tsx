import React, { ReactElement } from 'react';
import { useAppSettings } from '../hooks/use-app-settings';
import { LoadingFallback } from './loading-fallback';

export function Header(): ReactElement {
	const { status, settings } = useAppSettings();

	return (
		<LoadingFallback status={status}>
			<div>
				<span>Frame Agreement Negotiation Console: {settings?.account.name}</span>
			</div>
		</LoadingFallback>
	);
}

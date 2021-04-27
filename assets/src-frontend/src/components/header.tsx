import React, { ReactElement } from 'react';
import { useAppSettings } from '../hooks/use-app-settings';
import { LoadingFallback } from './loading-fallback';
import {
	CSButton,
	CSMainHeader,
	CSMainHeaderLeft,
	CSMainHeaderRight,
	CSMainHeaderIcon,
	CSIcon
} from '@cloudsense/cs-ui-components';

export function Header(): ReactElement {
	const { status, settings } = useAppSettings();

	return (
		<LoadingFallback status={status}>
			<CSMainHeader maxWidth="1200px">
				<CSMainHeaderIcon>
					<CSIcon name="lead" origin="cs" frame color="#3cdbc0" />
				</CSMainHeaderIcon>
				<CSMainHeaderLeft
					subtitle="Frame Agreement Negotiation Console"
					title={settings?.account.name ? settings.account.name : ''}
				/>
				<CSMainHeaderRight>
					<CSButton label="Add new agreement" btnStyle="brand" />
				</CSMainHeaderRight>
			</CSMainHeader>
		</LoadingFallback>
	);
}

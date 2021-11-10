import React, { ReactElement } from 'react';
import { QueryStatus } from 'react-query';
import { useGetStandaloneAddons } from '../../hooks/use-get-standalone-addons';
import { AddonGrid } from './addon-grid';

export function StandaloneAddons(): ReactElement {
	const { standaloneAddons, status } = useGetStandaloneAddons();

	return (
		<>{status === QueryStatus.Success && <AddonGrid addonList={standaloneAddons || []} />}</>
	);
}

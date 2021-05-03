import React, { ReactElement } from 'react';
import { useRouteMatch } from 'react-router';
import { Link } from 'react-router-dom';
import { useFrameAgreements } from '../hooks/use-frame-agreements';
import { LoadingFallback } from './loading-fallback';
import { CSTab, CSTabGroup, CSChip } from '@cloudsense/cs-ui-components';

export function FrameAgreementList(): ReactElement {
	const { url } = useRouteMatch();
	const { agreements = [], status } = useFrameAgreements();

	const linkList = agreements.map((agreement) => {
		return (
			<li key={agreement.id}>
				<Link to={`${url}/${agreement.id}`}>{agreement.name}</Link>
			</li>
		);
	});

	return (
		<LoadingFallback status={status}>
			<div className="tabs-wrapper">
				<CSTabGroup variant="large">
					<CSTab name="Active" className="cs-tab-name-active" active>
						<CSChip text="79" variant="brand" />
					</CSTab>
					<CSTab name="Pending">
						<CSChip text="44" variant="neutral" />
					</CSTab>
				</CSTabGroup>
			</div>
			<div>
				<h2>Frame Agreements</h2>
				<ul>{linkList}</ul>
			</div>
		</LoadingFallback>
	);
}

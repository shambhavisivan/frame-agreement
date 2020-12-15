import React, { ReactElement } from 'react';
import { useRouteMatch } from 'react-router';
import { Link } from 'react-router-dom';
import { useFrameAgreements } from '../hooks/use-frame-agreements';
import { LoadingFallback } from './loading-fallback';

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
			<div>
				<h2>Frame Agreements</h2>
				<ul>{linkList}</ul>
			</div>
		</LoadingFallback>
	);
}

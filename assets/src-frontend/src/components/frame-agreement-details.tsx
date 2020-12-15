import React, { ReactElement } from 'react';
import { useParams } from 'react-router';
import { useFrameAgreements } from '../hooks/use-frame-agreements';
import { LoadingFallback } from './loading-fallback';

export function FrameAgreementDetails(): ReactElement {
	const { agreementId } = useParams<{ agreementId: string }>();
	const { agreements = [], status } = useFrameAgreements();

	const agreement = agreements.find((a) => a.id === agreementId);

	return (
		<LoadingFallback status={status}>
			<div>
				Agreement ID: {agreementId}, name: {agreement?.name}
			</div>
		</LoadingFallback>
	);
}

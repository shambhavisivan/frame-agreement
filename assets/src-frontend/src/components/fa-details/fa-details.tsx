import React, { ReactElement } from 'react';
import { useFrameAgreements } from '../../hooks/use-frame-agreements';
import { LoadingFallback } from '../loading-fallback';
import { FaEditor } from './fa-editor';

interface FrameAgreementDetailsProps {
	agreementId: string;
}

export function FrameAgreementDetails({ agreementId }: FrameAgreementDetailsProps): ReactElement {
	const { agreements = [], status: faStatus } = useFrameAgreements();
	const agreement = agreements.find((a) => a.id === agreementId);

	return (
		<LoadingFallback status={faStatus}>
			<div>
				Agreement ID: {agreementId}, name: {agreement?.name}
			</div>
			<FaEditor agreement={agreement} />
		</LoadingFallback>
	);
}
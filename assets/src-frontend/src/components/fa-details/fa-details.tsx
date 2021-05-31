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
		<div className="details-wrapper">
			<LoadingFallback status={faStatus}>
				<div className="field-wrapper"> </div>
				Agreement ID: {agreementId}, name: {agreement?.name}
				<FaEditor agreement={agreement} />
			</LoadingFallback>
		</div>
	);
}

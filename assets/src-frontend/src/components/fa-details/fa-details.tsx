import React, { ReactElement } from 'react';
import { FrameAgreement } from '../../datasources';
import { useFrameAgreements } from '../../hooks/use-frame-agreements';
import { LoadingFallback } from '../loading-fallback';
import { FaEditor } from './fa-editor';
import { CSCard, CSCardBody } from '@cloudsense/cs-ui-components';
import { ApprovalProcess } from './approval';
import { FaStatusContextProvider } from '../../providers/fa-status-provider';
import { DetailsProvider } from './details-page-provider';

interface FrameAgreementDetailsProps {
	agreementId: string;
}

export function FrameAgreementDetails({ agreementId }: FrameAgreementDetailsProps): ReactElement {
	const { agreementList = [], status: faStatus } = useFrameAgreements();
	const agreement: FrameAgreement | undefined = agreementList.find(
		(fa: FrameAgreement) => fa.id === agreementId
	);

	return (
		<div className="details-wrapper">
			<LoadingFallback status={faStatus}>
				<DetailsProvider>
					<FaStatusContextProvider faId={agreementId}>
						<div className="field-wrapper"> </div>
						<ApprovalProcess faId={agreementId} />
						Agreement ID: {agreementId}, name: {agreement?.name}
						<CSCard className="products-search-wrapper">
							<CSCardBody padding="0">
								<FaEditor agreement={agreement} />
							</CSCardBody>
						</CSCard>
					</FaStatusContextProvider>
				</DetailsProvider>
			</LoadingFallback>
		</div>
	);
}

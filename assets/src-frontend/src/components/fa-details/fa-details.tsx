import React, { ReactElement } from 'react';
import { FrameAgreement } from '../../datasources';
import { useFrameAgreements } from '../../hooks/use-frame-agreements';
import { LoadingFallback } from '../loading-fallback';
import { FaEditor } from './fa-editor';
import {
	CSCard,
	CSCardHeader,
	CSCardBody,
	CSButton,
	CSDropdown,
	CSInputSearch
} from '@cloudsense/cs-ui-components';
import { ApprovalProcess } from './approval';

interface FrameAgreementDetailsProps {
	agreementId: string;
}

export function FrameAgreementDetails({ agreementId }: FrameAgreementDetailsProps): ReactElement {
	const { agreements = {}, status: faStatus } = useFrameAgreements();
	const agreement: FrameAgreement | undefined = Object.values(agreements)
		.flat()
		.find((fa: FrameAgreement) => fa.id === agreementId);

	return (
		<div className="details-wrapper">
			<LoadingFallback status={faStatus}>
				<div className="field-wrapper"> </div>
				<ApprovalProcess faId={agreementId} />
				Agreement ID: {agreementId}, name: {agreement?.name}
				<CSCard className="products-search-wrapper">
					<CSCardHeader title="">
						<h2>Products</h2>
						<div className="products-search">
							<CSInputSearch
								label="Quick search"
								labelHidden
								placeholder="Quick search"
							/>
							<CSDropdown align="right" iconName="table">
								<CSButton label="Button 1" />
								<CSButton label="Button 2 with more content" />
							</CSDropdown>
						</div>
						<div className="info-items">
							<span className="item">
								<span className="value">7</span>
								<span className="label">items</span>
							</span>
							<span className="item">
								<span className="value">3</span>
								<span className="label">Apple</span>
							</span>
							<span className="item">
								<span className="value">1</span>
								<span className="label">Huawei</span>
							</span>
							<span className="item">
								<span className="value">1</span>
								<span className="label">Samsung</span>
							</span>
						</div>
					</CSCardHeader>
					<CSCardBody>
						<FaEditor agreement={agreement} />
					</CSCardBody>
				</CSCard>
			</LoadingFallback>
		</div>
	);
}

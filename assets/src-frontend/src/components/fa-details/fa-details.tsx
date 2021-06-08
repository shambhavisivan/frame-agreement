import React, { ReactElement } from 'react';
import { FrameAgreement } from '../../datasources';
import { useFrameAgreements } from '../../hooks/use-frame-agreements';
import { LoadingFallback } from '../loading-fallback';
import { FaEditor } from './fa-editor';
import {
	CSCard,
	CSCardHeader,
	CSCardBody,
	CSTextarea,
	CSButton,
	CSButtonGroup,
	CSTable,
	CSTableBody,
	CSTableCell,
	CSTableHeader,
	CSTableRow,
	CSDropdown,
	CSInputSearch
} from '@cloudsense/cs-ui-components';

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
				<CSCard className="approval-history-wrapper">
					<CSCardHeader title="Approval history" collapsible defaultClosed>
						<CSButton
							label="Refresh button"
							labelHidden
							btnType="transparent"
							btnStyle="brand"
							iconName="refresh"
							size="small"
						/>
					</CSCardHeader>
					<CSCardBody padding="0.75rem 0 0">
						<CSTextarea
							label="Comment"
							placeholder="Enter comment..."
							borderRadius="0.25rem"
						/>
						<CSButtonGroup ariaDescription="approval actions">
							<CSButton label="Recall" iconName="undo" />
							<CSButton label="Approve" iconName="like" />
							<CSButton label="Reject" iconName="dislike" />
						</CSButtonGroup>
						<CSTable selectableRows>
							<CSTableHeader>
								<CSTableCell text="Action" grow={2} />
								<CSTableCell text="Date" grow={1} />
								<CSTableCell text="Status" grow={1} />
								<CSTableCell text="Assigned to" grow={1} />
								<CSTableCell text="Actual Approver" grow={1} />
								<CSTableCell text="Comments" grow={1} />
							</CSTableHeader>
							<CSTableBody>
								<CSTableRow>
									<CSTableCell text="Step1" grow={2} />
									<CSTableCell text="03/05/2019 12:20" grow={1} />
									<CSTableCell text="Pending" grow={1} />
									<CSTableCell text="International - Platinum/Gold" grow={1} />
									<CSTableCell text="International - Platinum/Gold" grow={1} />
									<CSTableCell text="Submitted frame agreement" grow={1} />
								</CSTableRow>
								<CSTableRow>
									<CSTableCell text="Step1" grow={2} />
									<CSTableCell text="03/05/2019 12:20" grow={1} />
									<CSTableCell text="Pending" grow={1} />
									<CSTableCell text="International - Platinum/Gold" grow={1} />
									<CSTableCell text="International - Platinum/Gold" grow={1} />
									<CSTableCell text="Submitted frame agreement" grow={1} />
								</CSTableRow>
								<CSTableRow>
									<CSTableCell text="Step1" grow={2} />
									<CSTableCell text="03/05/2019 12:20" grow={1} />
									<CSTableCell text="Pending" grow={1} />
									<CSTableCell text="International - Platinum/Gold" grow={1} />
									<CSTableCell text="International - Platinum/Gold" grow={1} />
									<CSTableCell text="Submitted frame agreement" grow={1} />
								</CSTableRow>
							</CSTableBody>
						</CSTable>
					</CSCardBody>
				</CSCard>
				Agreement ID: {agreementId}, name: {agreement?.name}
				<CSCard className="products-search-wrapper">
					<CSCardHeader>
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

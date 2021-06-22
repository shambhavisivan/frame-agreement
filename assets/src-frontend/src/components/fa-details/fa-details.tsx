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
	CSTableRow
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
					<CSCardHeader title="Approval history" collapsible defaultClosed />
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
				<FaEditor agreement={agreement} />
			</LoadingFallback>
		</div>
	);
}

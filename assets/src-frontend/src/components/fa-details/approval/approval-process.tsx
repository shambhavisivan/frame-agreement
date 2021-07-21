import {
	CSButton,
	CSButtonGroup,
	CSCard,
	CSCardBody,
	CSCardHeader,
	CSTable,
	CSTableBody,
	CSTableCell,
	CSTableHeader,
	CSTableRow,
	CSTextarea
} from '@cloudsense/cs-ui-components';
import { format } from 'date-fns';
import React, { ReactElement, useEffect, useReducer, useState } from 'react';
import { QueryStatus } from 'react-query';
import { ApprovalActionType, ApprovalHistory } from '../../../datasources';
import { useApprovalAction } from '../../../hooks/use-approval-action';
import { useApprovalHistory } from '../../../hooks/use-approval-history';
import { useCustomLabels } from '../../../hooks/use-custom-labels';
import { useReassignApproval } from '../../../hooks/use-reassign-approval';
import { createApprovalComponentActions } from './approval-action-creator';
import approvalReducer from './approval-reducer';

export function ApprovalProcess({ faId }: { faId: string }): ReactElement {
	const [isClosed, setClosed] = useState(true);
	const { approvals, status, refetchApprovalHistory } = useApprovalHistory(faId);
	const { approvalStatus, approvalAction } = useApprovalAction();
	const { reassignStatus, approvalAction: reassignApproval } = useReassignApproval();
	const [state, dispatch] = useReducer(approvalReducer, { approvals: {} });
	const { updateComment, refreshHistory, reassignTo } = createApprovalComponentActions(dispatch)(
		faId
	);
	const labels = useCustomLabels();

	useEffect(() => {
		if (status === QueryStatus.Success) {
			refreshHistory(approvals as ApprovalHistory);
		}
	}, [status, approvals, approvalStatus, reassignStatus]);

	const tableHeaders = [
		{ name: labels.approvalTableHeaderAction, size: 1 },
		{ name: labels.approvalTableHeaderDate, size: 1 },
		{ name: labels.approvalTableHeaderStatus, size: 1 },
		{ name: labels.approvalTableHeaderAssignedTo, size: 1 },
		{ name: labels.approvalTableHeaderActualApprover, size: 1 },
		{ name: labels.approvalTableHeaderComments, size: 2 }
	];

	return (
		<div>
			{state.approvals[faId]?.approvalHistory?.listProcess?.length ? (
				<CSCard className="approval-history-wrapper">
					<CSCardHeader title={labels.approvalTitle} collapsible defaultClosed={isClosed}>
						<CSButton
							label="Refresh button"
							labelHidden
							btnType="transparent"
							btnStyle="brand"
							iconName="refresh"
							size="small"
							onClick={(): void => {
								refetchApprovalHistory();
							}}
						/>
					</CSCardHeader>
					<CSCardBody padding="0.75rem 0 0">
						{state.approvals[faId]?.approvalHistory?.isPending && (
							<div>
								<CSTextarea
									label={labels.approvalMessageTitle}
									placeholder={labels.approvalMessagePlaceholder}
									borderRadius="0.25rem"
									value={state.approvals[faId].comment}
									onChange={(
										event: React.ChangeEvent<HTMLTextAreaElement>
									): void => updateComment(event.target.value)}
								/>
								<CSButtonGroup ariaDescription="approval actions">
									{state.approvals[faId].canRecall && (
										<CSButton
											label={labels.approvalActionRecall}
											iconName="undo"
											onClick={(): void => {
												setClosed(false);
												approvalAction({
													faId,
													actionType: ApprovalActionType.recall,
													comment: state.approvals[faId].comment
												});
												updateComment('');
											}}
										/>
									)}
									{state.approvals[faId].canApproveReject && (
										<div>
											<CSButton
												label={labels.approvalActionApprove}
												iconName="like"
												onClick={(): void => {
													setClosed(false);
													approvalAction({
														faId,
														actionType: ApprovalActionType.approve,
														comment: state.approvals[faId].comment
													});
													updateComment('');
												}}
											/>
											<CSButton
												label={labels.approvalActionReject}
												iconName="dislike"
												onClick={(): void => {
													setClosed(false);
													approvalAction({
														faId,
														actionType: ApprovalActionType.reject,
														comment: state.approvals[faId].comment
													});
													updateComment('');
												}}
											/>
										</div>
									)}
									{state.approvals[faId].canReassign &&
										// TODO: Keeping reassign action hidden for now as the functionality is incomplete
										false && (
											<CSButton
												label={labels.approvalActionReassign}
												iconName="reassign"
												onClick={(): void => {
													setClosed(false);
													reassignTo(
														state.approvals[faId]?.newApproverId
													);
													reassignApproval({
														faId,
														newApproverId:
															state.approvals[faId].newApproverId
													});
												}}
											/>
										)}
								</CSButtonGroup>
							</div>
						)}
						<CSTable selectableRows>
							<CSTableHeader>
								{tableHeaders.map((header, index) => (
									<CSTableCell
										key={`header${index}`}
										text={header.name}
										grow={header.size}
									/>
								))}
							</CSTableHeader>
							<CSTableBody>
								{state.approvals[faId]?.approvalHistory?.listProcess.map(
									(process, i) => {
										return process.stepsAndWorkitems.map((step, j) => {
											return (
												<CSTableRow key={`approvalStep${i}${j}`}>
													<CSTableCell
														text={
															(step.processNode &&
																step.processNode.name) ||
															'Approval Request Submitted'
														}
														grow={1}
													/>
													<CSTableCell
														text={format(
															step.createdDate,
															'MM/dd/yyyy HH:mm'
														)}
														grow={1}
													/>
													<CSTableCell
														text={`status ${step.stepStatus}`}
														grow={1}
													/>
													<CSTableCell
														text={step.actor && step.actor.name}
														grow={1}
													/>
													<CSTableCell
														text={
															step.originalActor &&
															step.originalActor.name
														}
														grow={1}
													/>
													<CSTableCell
														text={step.comments || '-/-'}
														grow={2}
													/>
												</CSTableRow>
											);
										});
									}
								)}
							</CSTableBody>
						</CSTable>
					</CSCardBody>
				</CSCard>
			) : null}
		</div>
	);
}

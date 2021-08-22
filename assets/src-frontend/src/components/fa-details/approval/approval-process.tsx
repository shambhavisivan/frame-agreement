import {
	CSButton,
	CSButtonGroup,
	CSCard,
	CSCardBody,
	CSCardHeader,
	CSDataTable,
	CSDataTableRowInterface,
	CSTextarea
} from '@cloudsense/cs-ui-components';
import { format } from 'date-fns';
import React, { ReactElement, useContext, useEffect, useReducer, useState } from 'react';
import { QueryStatus } from 'react-query';
import {
	ApprovalActionType,
	ApprovalHistory,
	FaStatus,
	FacSetting,
	ProcessInstanceHistory
} from '../../../datasources';
import { useAppSettings } from '../../../hooks/use-app-settings';
import { useApprovalAction } from '../../../hooks/use-approval-action';
import { useApprovalHistory } from '../../../hooks/use-approval-history';
import { useCustomLabels } from '../../../hooks/use-custom-labels';
import { useReassignApproval } from '../../../hooks/use-reassign-approval';
import { faStatusContext } from '../../../providers/fa-status-provider';
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
	const { settings } = useAppSettings();
	const labels = useCustomLabels();
	const { setFaStatus } = useContext(faStatusContext);
	const { statuses } = settings?.facSettings as FacSetting;

	useEffect(() => {
		if (status === QueryStatus.Success) {
			refreshHistory(approvals as ApprovalHistory);
		}
	}, [status, approvals, approvalStatus, reassignStatus]);

	const tableHeaders = [
		{
			key: 'processNode',
			header: labels.approvalTableHeaderAction,
			grow: 1,
			render: (row: CSDataTableRowInterface): string =>
				row.data?.processNode?.name || 'Approval Request Submitted'
		},
		{
			key: 'createdDate',
			header: labels.approvalTableHeaderDate,
			grow: 1,
			render: (row: CSDataTableRowInterface): string =>
				format(row.data?.createdDate, 'MM/dd/yyyy HH:mm')
		},
		{
			key: 'stepStatus',
			header: labels.approvalTableHeaderStatus,
			grow: 1,
			render: (row: CSDataTableRowInterface): string => `status ${row.data?.stepStatus}`
		},
		{
			key: 'actor',
			header: labels.approvalTableHeaderAssignedTo,
			grow: 1,
			render: (row: CSDataTableRowInterface): string =>
				row.data?.actor && row.data?.actor.name
		},
		{
			key: 'originalActor',
			header: labels.approvalTableHeaderActualApprover,
			grow: 1,
			render: (row: CSDataTableRowInterface): string =>
				row.data?.originalActor && row.data?.originalActor.name
		},
		{
			key: 'comments',
			header: labels.approvalTableHeaderComments,
			grow: 2,
			render: (row: CSDataTableRowInterface): string => row.data?.comments || '-/-'
		}
	];

	return (
		<div>
			{state.approvals[faId]?.approvalHistory?.listProcess?.length ? (
				<CSCard className="approval-history-wrapper">
					<CSCardHeader
						title={labels.approvalTitle}
						collapsible
						defaultClosed={!isClosed}
					>
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
							<>
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
												setFaStatus(statuses[FaStatus.requiresApproval]);
											}}
										/>
									)}
									{state.approvals[faId].canApproveReject && (
										<>
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
													setFaStatus(statuses[FaStatus.approved]);
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
													setFaStatus(
														statuses[FaStatus.requiresApproval]
													);
												}}
											/>
										</>
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
							</>
						)}

						{/* TODO: add selectable prop when support in csdatatable is added */}
						<CSDataTable
							columns={tableHeaders}
							rows={state.approvals[faId]?.approvalHistory?.listProcess.flatMap(
								(process) =>
									process.stepsAndWorkitems.map(
										(step: ProcessInstanceHistory) => ({
											key: step.id,
											data: step
										})
									)
							)}
							density="comfortable"
							disableHover
							stickyHeader
							maxHeight="30rem"
						/>
					</CSCardBody>
				</CSCard>
			) : null}
		</div>
	);
}

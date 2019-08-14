import React, { Component } from 'react';
import moment from 'moment';
import Icon from './utillity/Icon';
import { connect } from 'react-redux';
import {
	getApprovalHistory,
	refreshFrameAgreement,
	approveRejectRecallRecord,
	reassignApproval,
	createToast
} from '../actions';

export class ApprovalProcess extends React.Component {
	constructor(props) {
		super(props);

		this.itemsMerged = this.props.frameAgreements[
			this.props.faId
		]._ui.approval.listProcess.reduce((acc, item) => {
			return acc.concat(item.StepsAndWorkitems || []);
		}, []);

		// Can user recall? (If admin or initiator)
		this.isInitiator = this.props.frameAgreements[
			this.props.faId
		]._ui.approval.isAdmin;
		this.actionRequired = false;

		try {
			// Is there something to do?
			this.actionRequired = this.props.frameAgreements[
				this.props.faId
			]._ui.approval.listProcess[0].StepsAndWorkitems[0].IsPending;

			// Look who started the process
			let startingIndex = this.props.frameAgreements[
				this.props.faId
			]._ui.approval.listProcess[0].StepsAndWorkitems.findIndex(step => {
				return step.StepStatus === 'Started';
			});
			this.isInitiator =
				this.isInitiator ||
				this.props.frameAgreements[this.props.faId]._ui.approval.listProcess[0]
					.StepsAndWorkitems[startingIndex].OriginalActorId ===
					this.props.frameAgreements[this.props.faId]._ui.approval.currentUser;
		} catch (err) {}

		this.state = {
			open: false,
			loading: false,
			comment: ''
		};
	}

	componentWillUpdate(newProps) {
		let newActionRequired = false;
		let newIsInitiator = this.props.frameAgreements[this.props.faId]._ui
			.approval.isAdmin;

		try {
			let itemsMerged = this.props.frameAgreements[
				this.props.faId
			]._ui.approval.listProcess.reduce((acc, item) => {
				return acc.concat(item.StepsAndWorkitems || []);
			}, []);

			newActionRequired = this.props.frameAgreements[this.props.faId]._ui
				.approval.listProcess[0].StepsAndWorkitems[0].IsPending;

			let startingIndex = this.props.frameAgreements[
				this.props.faId
			]._ui.approval.listProcess[0].StepsAndWorkitems.findIndex(step => {
				return step.StepStatus === 'Started';
			});

			newIsInitiator =
				newIsInitiator ||
				this.props.frameAgreements[this.props.faId]._ui.approval.listProcess[0]
					.StepsAndWorkitems[startingIndex].OriginalActorId ===
					this.props.frameAgreements[this.props.faId]._ui.approval.currentUser;
		} catch (err) {}

		if (newActionRequired !== this.actionRequired) {
			this.actionRequired = newActionRequired;
		}

		if (newIsInitiator !== this.isInitiator) {
			this.isInitiator = newIsInitiator;
		}
	}

	refreshApprovalHistory() {
		this.setState({ loading: true }, () => {
			Promise.all([
				this.props.getApprovalHistory(this.props.faId),
				this.props.refreshFrameAgreement(this.props.faId)
			]).then(r => {
				setTimeout(() => {
					this.setState({ loading: false });
				}, 500);
			});
		});
	}

	approvalAction(actionType, reassignTo = null) {
		if (actionType === 'Reassign') {
			this.props.reassignApproval(
				this.props.faId,
				reassignTo ||
					this.props.frameAgreements[this.props.faId]._ui.approval.currentUser
			);
		} else {
			this.props
				.approveRejectRecallRecord(
					this.props.faId,
					this.state.comment || null,
					actionType
				)
				.then(response => {
					if (response) {
						this.props.createToast(
							'success',
							actionType,
							actionType + ' ' + window.SF.labels.toast_approvalAction_success
						);
					} else {
						this.props.createToast(
							'error',
							actionType,
							actionType + ' ' + window.SF.labels.toast_approvalAction_failed
						);
					}
				})
				.then(response => {
					this.setState({ comment: '' });
					this.refreshApprovalHistory();
				});
		}
	}

	render() {
		return (
			<div className="card approval-card">
				<div className="approval-history approval-card__inner">
					<div className="approval-card__header">
						<div
							className="header__title"
							onClick={() => {
								this.setState({ open: !this.state.open });
							}}
						>
							<Icon
								name={this.state.open ? 'chevrondown' : 'chevronright'}
								width="16"
								height="16"
								color="#747474"
							/>
							{window.SF.labels.approval_title}
						</div>
						<div
							onClick={() => {
								this.refreshApprovalHistory();
							}}
						>
							<Icon
								svg-class={
									'approval-refresh' + (this.state.loading ? ' rotating' : '')
								}
								name="refresh"
								width="14"
								height="14"
								color="#747474"
							/>
						</div>
					</div>
					{this.actionRequired && this.state.open && (
						<div className="approval-card__body">
							<span className="body__title">
								{window.SF.labels.approval_message_title}
							</span>
							<textarea
								className="fa-textarea"
								value={this.state.comment}
								onChange={e => {
									this.setState({ comment: e.target.value });
								}}
								placeholder={window.SF.labels.approval_message_placeholder}
							/>
							<div className="fa-button-group">
								{this.props.frameAgreements[this.props.faId]._ui.approval
									.isApprover &&
									false && (
										<button
											className="fa-button fa-button--default"
											onClick={() => this.approvalAction('Reassign')}
										>
											<Icon name="change_owner" height="14" width="14" />
											<span className="fa-padding-left-xsm">
												{window.SF.labels.approval_action_reassign}
											</span>
										</button>
									)}
								{this.isInitiator && (
									<button
										className="fa-button fa-button--default"
										onClick={() => this.approvalAction('Removed')}
									>
										<Icon name="undo" height="14" width="14" />
										<span className="fa-padding-left-xsm">
											{window.SF.labels.approval_action_recall}
										</span>
									</button>
								)}
								{this.props.frameAgreements[this.props.faId]._ui.approval
									.isApprover && (
									<button
										className="fa-button fa-button--default"
										onClick={() => this.approvalAction('Approve')}
									>
										<Icon name="approval" height="14" width="14" />
										<span className="fa-padding-left-xsm">
											{window.SF.labels.approval_action_approve}
										</span>
									</button>
								)}
								{this.props.frameAgreements[this.props.faId]._ui.approval
									.isApprover && (
									<button
										className="fa-button fa-button--default"
										onClick={() => this.approvalAction('Reject')}
									>
										<Icon name="dislike" height="14" width="14" />
										<span className="fa-padding-left-xsm">
											{window.SF.labels.approval_action_reject}
										</span>
									</button>
								)}
							</div>
						</div>
					)}
					{this.state.open && (
						<div className="approval-table-list-container">
							<div className="table-list-header">
								<div
									className="list-cell"
									title={window.SF.labels.approval_table_header_action}
								>
									<span>{window.SF.labels.approval_table_header_action}</span>
								</div>
								<div
									className="list-cell"
									title={window.SF.labels.approval_table_header_date}
								>
									<span>{window.SF.labels.approval_table_header_date}</span>
								</div>
								<div
									className="list-cell"
									title={window.SF.labels.approval_table_header_status}
								>
									<span>{window.SF.labels.approval_table_header_status}</span>
								</div>
								<div
									className="list-cell"
									title={window.SF.labels.approval_table_header_assignedTo}
								>
									<span>
										{window.SF.labels.approval_table_header_assignedTo}
									</span>
								</div>
								<div
									className="list-cell"
									title={window.SF.labels.approval_table_header_actualApprover}
								>
									<span>
										{window.SF.labels.approval_table_header_actualApprover}
									</span>
								</div>
								<div
									className="list-cell"
									title={window.SF.labels.approval_table_header_comments}
								>
									<span>{window.SF.labels.approval_table_header_comments}</span>
								</div>
							</div>
							{this.props.frameAgreements[
								this.props.faId
							]._ui.approval.listProcess.map((process, i) => {
								return (
									<ul key={process.Id} className="table-list">
										{process.StepsAndWorkitems.map((step, i) => {
											return (
												<li key={'approvalStep' + i} className="list-row">
													<div
														className="list-cell"
														title={
															(step.ProcessNode && step.ProcessNode.Name) ||
															'Approval Request Submitted '
														}
													>
														<span>
															{(step.ProcessNode && step.ProcessNode.Name) ||
																'Approval Request Submitted '}
														</span>
													</div>
													<div
														className="list-cell"
														title={moment(step.CreatedDate).format(
															'MM/D/YYYY, HH:mm'
														)}
													>
														<span>
															{moment(step.CreatedDate).format(
																'MM/D/YYYY, HH:mm'
															)}
														</span>
													</div>
													<div
														className="list-cell"
														title={'status ' + step.StepStatus}
													>
														<span className={'status ' + step.StepStatus}>
															{step.StepStatus}
														</span>
													</div>
													<div
														className="list-cell"
														title={step.Actor && step.Actor.Name}
													>
														<span>{step.Actor && step.Actor.Name}</span>
													</div>
													<div
														className="list-cell"
														title={
															step.OriginalActor && step.OriginalActor.Name
														}
													>
														<span>
															{step.OriginalActor && step.OriginalActor.Name}
														</span>
													</div>
													<div className="list-cell" title={step.Comments}>
														<span>{step.Comments || '-/-'}</span>
													</div>
												</li>
											);
										})}
									</ul>
								);
							})}
							<div className="card__bottom" />
						</div>
					)}
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		frameAgreements: state.frameAgreements
	};
};

const mapDispatchToProps = {
	getApprovalHistory,
	refreshFrameAgreement,
	approveRejectRecallRecord,
	reassignApproval,
	createToast
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ApprovalProcess);

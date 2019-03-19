import React, { Component } from 'react';
import moment from 'moment';
import Icon from './utillity/Icon';
import { connect } from 'react-redux';
import {
	approveRejectRecallRecord,
	reassignApproval,
	createToast
} from '../actions';

import './ApprovalProcess.css';

class ApprovalProcess extends React.Component {
	constructor(props) {
		super(props);
		console.log('***********************************');
		console.log(this.props.approval);
		this.itemsMerged = this.props.approval.listProcess.reduce((acc, item) => {
			return acc.concat(item.StepsAndWorkitems || []);
		}, []);
		console.log(this.itemsMerged);
		console.log('***********************************');

		// Can user recall? (If admin or initiator)
		this.isInitiator = this.props.approval.isAdmin;
		this.actionRequired = false;

		try {
			// Is there something to do?
			this.actionRequired = this.props.approval.listProcess[0].StepsAndWorkitems[0].IsPending;

			// Look who started the process
			let startingIndex = this.props.approval.listProcess[0].StepsAndWorkitems.findIndex(
				step => {
					return step.StepStatus === 'Started';
				}
			);
			this.isInitiator =
				this.isInitiator ||
				this.props.approval.listProcess[0].StepsAndWorkitems[startingIndex]
					.OriginalActorId === this.props.approval.currentUser;
		} catch (err) {}

		this.state = {
			open: true,
			loading: false
		};
	}

	componentWillUpdate(newProps) {
		let newActionRequired = false;
		let newIsInitiator = newProps.approval.isAdmin;

		try {
			let itemsMerged = newProps.approval.listProcess.reduce((acc, item) => {
				return acc.concat(item.StepsAndWorkitems || []);
			}, []);

			newActionRequired =
				newProps.approval.listProcess[0].StepsAndWorkitems[0].IsPending;

			let startingIndex = newProps.approval.listProcess[0].StepsAndWorkitems.findIndex(
				step => {
					return step.StepStatus === 'Started';
				}
			);

			newIsInitiator =
				newIsInitiator ||
				newProps.approval.listProcess[0].StepsAndWorkitems[startingIndex]
					.OriginalActorId === newProps.approval.currentUser;
		} catch (err) {}

		if (newActionRequired !== this.actionRequired) {
			console.warn('newActionRequired changed to:', newActionRequired);
			this.actionRequired = newActionRequired;
		}

		if (newIsInitiator !== this.isInitiator) {
			console.warn('newIsInitiator changed to:', newIsInitiator);
			this.isInitiator = newIsInitiator;
		}
	}

	refreshApprovalHistory() {
		this.setState({ loading: true }, () => {
			this.props.onChange().finally(r => {
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
				reassignTo || this.props.approval.currentUser
			);
		} else {
			this.props
				.approveRejectRecallRecord(this.props.faId, null, actionType)
				.then(response => {
					if (response) {
						this.props.createToast(
							'success',
							actionType,
							actionType + ' action successful!'
						);
					} else {
						this.props.createToast(
							'error',
							actionType,
							actionType + ' action failed!'
						);
					}
				})
				.then(response => {
					this.props.onChange();
				});
		}
	}

	render() {
		return (
			<div className="approval-history approval-table-list">
				<div className="approval-table-list-header">
					<div
						className="table-title"
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
						Approval history
					</div>

					{this.actionRequired && (
						<div className="table-actions">
							{this.props.approval.isApprover && (
								<span
									className="link"
									onClick={() => this.approvalAction('Approve')}
								>
									Approve
								</span>
							)}
							{this.props.approval.isApprover && (
								<span
									className="link"
									onClick={() => this.approvalAction('Reject')}
								>
									Reject
								</span>
							)}
							{this.props.approval.isApprover && (
								<span
									className="link"
									onClick={() => this.approvalAction('Reassign')}
								>
									Reassign
								</span>
							)}
							{this.isInitiator && (
								<span
									className="link"
									onClick={() => this.approvalAction('Removed')}
								>
									Recall
								</span>
							)}
						</div>
					)}

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

				{this.state.open && (
					<div className="approval-table-list-container">
						<div className="table-list-header">
							<div className="list-cell">Action</div>
							<div className="list-cell">Date</div>
							<div className="list-cell">Status</div>
							<div className="list-cell">Assigned to</div>
							<div className="list-cell">Actual Approver</div>
							<div className="list-cell">Comments</div>
						</div>

						{this.props.approval.listProcess.map((process, i) => {
							return (
								<ul key={process.Id} className="table-list">
									{process.StepsAndWorkitems.map((step, i) => {
										return (
											<li key={'approvalStep' + i} className="list-row">
												<div className="list-cell">
													{(step.ProcessNode && step.ProcessNode.Name) ||
														'Approval Request Submitted '}
												</div>
												<div className="list-cell">
													{moment(step.CreatedDate).format('MM/D/YYYY, HH:mm')}
												</div>
												<div className="list-cell">
													<span className={'status ' + step.StepStatus}>
														{step.StepStatus}
													</span>
												</div>
												<div className="list-cell">
													{step.Actor && step.Actor.Name}
												</div>
												<div className="list-cell">
													{step.OriginalActor && step.OriginalActor.Name}
												</div>
												<div className="list-cell">
													{step.Comments || '-/-'}
												</div>
											</li>
										);
									})}
								</ul>
							);
						})}
					</div>
				)}
			</div>
		);
	}
}

// const mapStateToProps = state => {
//     return {

//     };
// };

const mapDispatchToProps = {
	approveRejectRecallRecord,
	reassignApproval,
	createToast
};

export default connect(
	null,
	mapDispatchToProps
)(ApprovalProcess);

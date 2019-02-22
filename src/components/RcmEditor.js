import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Collapse } from 'react-collapse';

import { toggleRateCard } from '../actions';

import './RcmEditor.css';

class RcmEditor extends Component {
	constructor(props) {
		super(props);

		let _groupCollapse = {};

		for (var key in props.group_data) {
			_groupCollapse[key] = false;
		}

		this.state = {
			group_collapse: _groupCollapse
		};
	}

	eligableForAdding(rc) {
		let _group = this.props.group_data[rc.GroupName];
		if (!rc.added) {
			if (_group.Max !== null && _group.added + 1 > _group.Max) {
				// Max restriction not satisfied
				console.error('Maximal rate cards for group:', _group.GroupName);
				return false;
			}
		}
		return true;
	}

	toggleCollapse(groupName) {
		let _groupCollapse = this.state.group_collapse;
		_groupCollapse[groupName] = !_groupCollapse[groupName];
		this.setState({ group_collapse: _groupCollapse });
	}

	render() {
		return (
			<div id="rcmEditor">
				{Object.values(this.props.group_data).map(group => {
					return (
						<div className="ed-group" key={group.GroupName}>
							<div
								className={
									'ed-group-header' + (group.validity ? '' : ' invalid')
								}
								onClick={() => this.toggleCollapse(group.GroupName)}
							>
								<h3>
									{group.GroupName !== 'undefined' &&
										('Group: ' + group.GroupName || 'N/A')}
									{group.Min !== null && (
										<span className="q-restriction">&darr;{group.Min}</span>
									)}
									{group.Max !== null && (
										<span className="q-restriction">&uarr;{group.Max}</span>
									)}
									<span
										className={
											'collapse-chevron chevron-' +
											(this.state.group_collapse[group.GroupName]
												? 'left'
												: 'bottom')
										}
									/>
								</h3>
							</div>

							<Collapse
								className="ed-group-body"
								isOpened={!this.state.group_collapse[group.GroupName]}
							>
								<table className="slds-table slds-table_bordered slds-no-row-hover">
									<thead>
										<tr>
											<th>
												<div className="slds-truncate" />
											</th>
											<th>
												<div className="slds-truncate">Name</div>
											</th>
											<th>
												<div className="slds-truncate">Default</div>
											</th>
											<th>
												<div className="slds-truncate">Rate Card Lines</div>
											</th>
										</tr>
									</thead>
									<tbody>
										{group.rateCardIds.map(rcId => {
											var _isDefault = this.props.rcm_data[rcId].IsDefault;
											return (
												<tr
													className={
														'ed-group-rc' + (_isDefault ? 'disabled' : '')
													}
													key={rcId}
													onClick={() =>
														!_isDefault &&
														this.eligableForAdding(this.props.rcm_data[rcId]) &&
														this.props.toggleRateCard(this.props.rcm_data[rcId])
													}
												>
													<td>
														<div className="slds-truncate">
															{(() => {
																switch (_isDefault) {
																	case false:
																		return (
																			<span
																				className={
																					'slds-checkbox_faux ' +
																					(this.props.rcm_data[rcId].added
																						? 'checked'
																						: '')
																				}
																			/>
																		);
																	case true:
																		return (
																			<span className="slds-checkbox_faux checked disabled" />
																		);
																}
															})()}
														</div>
													</td>

													<td>{this.props.rcm_data[rcId].Name}</td>
													<td>
														{(() => {
															if (this.props.rcm_data[rcId].IsDefault) {
																return <span className="checkmark" />;
															} else return <span className="close-icon red" />;
														})()}
													</td>
													<td>
														{this.props.rcm_data[rcId].rateCardLines.length}
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</Collapse>
						</div>
					);
				})}
			</div>
		);
	}
}

const mapDispatchToProps = {
	toggleRateCard
};

const mapStateToProps = state => {
	return { rcm_data: state.rcm_data, group_data: state.group_data };
};

// const RcmModal = connect(null, mapDispatchToProps)(ConnectedForm);

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(RcmEditor);

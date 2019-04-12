import React, { Component } from 'react';
import { connect } from 'react-redux';

import './Addons.scss';
// import Checkbox from '../utillity/inputs/Checkbox';
import Icon from '../utillity/Icon';
import InputNegotiate from '../utillity/inputs/InputNegotiate';
import DropdownNegotiate from '../utillity/inputs/DropdownNegotiate';
import Pagination from '../utillity/Pagination';

class Addons extends React.Component {
	constructor(props) {
		super(props);

		// this.props.settings
		this.state = {
			pagination: {
				page: 1,
				pageSize: 10
			}
		};
	}

	negotiateInline(addon, chargeType, value) {
		let negotiation = this.props.attachment;
		negotiation[addon.Id] = negotiation[addon.Id] || {};
		negotiation[addon.Id][chargeType] = value;

		this.props.onNegotiate(negotiation);
	}

	// Id, Name, cspmb__Is_Active__c, cspmb__Effective_Start_Date__c, cspmb__Effective_End_Date__c, cspmb__Billing_Frequency__c, cspmb__Authorization_Level__c, cspmb__Recurring_Charge__c

	render() {
		return (
			<div className="table-container">
				<div className="table-list-header">
					<div className="list-cell">{window.SF.labels.addons_header_name}</div>
					<div className="list-cell">
						{window.SF.labels.addons_header_oneOff}
					</div>
					<div className="list-cell">
						{window.SF.labels.addons_header_oneOff_neg}
					</div>
					<div className="list-cell">{window.SF.labels.addons_header_recc}</div>
					<div className="list-cell">
						{window.SF.labels.addons_header_recc_neg}
					</div>
				</div>

				<ul className="table-list">
					{this.props.addons
						.paginate(
							this.state.pagination.page,
							this.state.pagination.pageSize
						)
						.map((add, i) => {
							let recurringRow = 'N/A';
							let oneOffRow = 'N/A';
							var negValue;

							let val_oneOff = false;
							let val_recurring = false;

							try {
								val_oneOff = this.props.validation[add.Id].oneOff;
							} catch (err) {}

							try {
								val_recurring = this.props.validation[add.Id].recurring;
							} catch (err) {}

							let flagColor = '#4bca81';
							if (val_oneOff || val_recurring) {
								flagColor = '#D9675D';
							}
							if (this.props.readOnly) {
								flagColor = '#ccc';
							}

							let oneOffDiscounts;
							let recurringDiscounts;

							if (add.levelId) {
								add.levelId.forEach(lv => {
									let info = this.props.settings.DiscLevels[lv].discountLevel;
									if (info.cspmb__Charge_Type__c == 'NRC') {
										oneOffDiscounts = oneOffDiscounts || [];
										oneOffDiscounts.push(info);
									} else {
										recurringDiscounts = recurringDiscounts || [];
										recurringDiscounts.push(info);
									}
								});
							}

							if (add.cspmb__One_Off_Charge__c != null) {
								negValue =
									this.props.attachment[add.Id] &&
									this.props.attachment[add.Id].hasOwnProperty('oneOff')
										? this.props.attachment[add.Id].oneOff
										: add.cspmb__One_Off_Charge__c;
								if (oneOffDiscounts) {
									oneOffRow = (
										<DropdownNegotiate
											readOnly={this.props.readOnly}
											invalid={val_oneOff}
											discounts={oneOffDiscounts}
											onChange={val => {
												this.negotiateInline(add, 'oneOff', val);
											}}
											negotiatedValue={negValue}
											originalValue={add.cspmb__One_Off_Charge__c}
										/>
									);
								} else {
									oneOffRow = (
										<InputNegotiate
											readOnly={this.props.readOnly}
											invalid={val_oneOff}
											onChange={val => {
												this.negotiateInline(add, 'oneOff', val);
											}}
											negotiatedValue={negValue}
											originalValue={add.cspmb__One_Off_Charge__c}
										/>
									);
								}
							}

							if (add.cspmb__Recurring_Charge__c != null) {
								negValue =
									this.props.attachment[add.Id] &&
									this.props.attachment[add.Id].hasOwnProperty('recurring')
										? this.props.attachment[add.Id].recurring
										: add.cspmb__Recurring_Charge__c;
								if (recurringDiscounts) {
									recurringRow = (
										<DropdownNegotiate
											readOnly={this.props.readOnly}
											invalid={val_recurring}
											discounts={recurringDiscounts}
											onChange={val => {
												this.negotiateInline(add, 'recurring', val);
											}}
											negotiatedValue={negValue}
											originalValue={add.cspmb__Recurring_Charge__c}
										/>
									);
								} else {
									recurringRow = (
										<InputNegotiate
											readOnly={this.props.readOnly}
											invalid={val_recurring}
											onChange={val => {
												this.negotiateInline(add, 'recurring', val);
											}}
											negotiatedValue={negValue}
											originalValue={add.cspmb__Recurring_Charge__c}
										/>
									);
								}
							}

							return (
								<li key={add.Id} className="list-row">
									<div className="list-cell">
										<Icon name="priority" width="14" color={flagColor} />
										{add.Name}
									</div>

									<div className="list-cell">
										{add.hasOwnProperty('cspmb__One_Off_Charge__c')
											? add.cspmb__One_Off_Charge__c
											: 'N/A'}
									</div>

									<div className="list-cell negotiable">{oneOffRow}</div>

									<div className="list-cell">
										{add.hasOwnProperty('cspmb__Recurring_Charge__c')
											? add.cspmb__Recurring_Charge__c
											: 'N/A'}
									</div>

									<div className="list-cell negotiable">{recurringRow}</div>
								</li>
							);
						})}
				</ul>

				<Pagination
					totalSize={this.props.addons.length}
					pageSize={this.state.pagination.pageSize}
					page={this.state.pagination.page}
					onPageSizeChange={newPageSize => {
						this.setState({
							pagination: {
								...this.state.pagination,
								pageSize: newPageSize,
								page: 1
							}
						});
					}}
					onPageChange={newPage => {
						this.setState({
							pagination: { ...this.state.pagination, page: newPage }
						});
					}}
				/>
			</div>
		);
	}
}

// export default Addons

const mapStateToProps = state => {
	return {
		settings: state.settings
	};
};

// const mapDispatchToProps = {
//     setValidation
// };

export default connect(
	mapStateToProps,
	null
)(Addons);

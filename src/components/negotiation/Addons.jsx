import React, { Component } from 'react';
import { connect } from 'react-redux';

// import Checkbox from '../utillity/inputs/Checkbox';
import Icon from '../utillity/Icon';
import InputNegotiate from '../utillity/inputs/InputNegotiate';
import DropdownNegotiate from '../utillity/inputs/DropdownNegotiate';
import Pagination from '../utillity/Pagination';

import { isOneOff, isRecurring, isNumber } from '~/src/utils/shared-service';

export class Addons extends React.Component {
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
		negotiation[addon.Id][chargeType] = +value;

		this.props.onNegotiate(negotiation);
	}

	// Id, Name, cspmb__Is_Active__c, cspmb__Effective_Start_Date__c, cspmb__Effective_End_Date__c, cspmb__Billing_Frequency__c, cspmb__Authorization_Level__c, cspmb__Recurring_Charge__c

	render() {
		return (
			<div className="table-container">
				<div className="table-list-header">
					<div className="list-cell">{window.SF.labels.addons_header_name}</div>
					<div className="list-cell">{window.SF.labels.addons_header_oneOff}</div>
					<div className="list-cell">{window.SF.labels.addons_header_oneOff_neg}</div>
					<div className="list-cell">{window.SF.labels.addons_header_recc}</div>
					<div className="list-cell">{window.SF.labels.addons_header_recc_neg}</div>
				</div>

				<ul className="table-list">
					{this.props.addons
						.paginate(this.state.pagination.page, this.state.pagination.pageSize)
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

							if (add._discountLvIds) {
								add._discountLvIds.forEach(lv => {
									let info = lv.discountLevel;

									if (isOneOff(info.cspmb__Charge_Type__c)) {
										oneOffDiscounts = oneOffDiscounts || [];
										oneOffDiscounts.push(info);
									} else if (isRecurring(info.cspmb__Charge_Type__c)) {
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
								if (oneOffDiscounts && !this.props.disableLevels) {
									oneOffRow = (
										<DropdownNegotiate
											readOnly={this.props.readOnly}
											invalid={val_oneOff}
											discounts={oneOffDiscounts}
											onChange={val => {
												this.negotiateInline(add, 'oneOff', val);
											}}
											discAsPrice={this.props.settings.FACSettings.discount_as_price}
											negotiatedValue={negValue}
											originalValue={add.cspmb__One_Off_Charge__c}
										/>
									);
								} else {
									oneOffRow = (
										<InputNegotiate
											readOnly={this.props.readOnly || this.props.disableInputs}
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
								if (recurringDiscounts && !this.props.disableLevels) {
									recurringRow = (
										<DropdownNegotiate
											readOnly={this.props.readOnly}
											invalid={val_recurring}
											discounts={recurringDiscounts}
											onChange={val => {
												this.negotiateInline(add, 'recurring', val);
											}}
											discAsPrice={this.props.settings.FACSettings.discount_as_price}
											negotiatedValue={negValue}
											originalValue={add.cspmb__Recurring_Charge__c}
										/>
									);
								} else {
									recurringRow = (
										<InputNegotiate
											readOnly={this.props.readOnly || this.props.disableInputs}
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
										{isNumber(add.cspmb__One_Off_Charge__c)
											? add.cspmb__One_Off_Charge__c.toFixedNumber()
											: 'N/A'}
									</div>

									<div className="list-cell negotiable">{oneOffRow}</div>

									<div className="list-cell">
										{isNumber(add.cspmb__Recurring_Charge__c)
											? add.cspmb__Recurring_Charge__c.toFixedNumber()
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

export default connect(mapStateToProps, null)(Addons);

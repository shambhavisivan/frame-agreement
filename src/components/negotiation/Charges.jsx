import React, { Component } from 'react';
import { connect } from 'react-redux';

import Icon from '../utillity/Icon';

import InputNegotiate from '../utillity/inputs/InputNegotiate';
import DropdownNegotiate from '../utillity/inputs/DropdownNegotiate';
import Pagination from '../utillity/Pagination';

export class Charges extends React.Component {
	constructor(props) {
		super(props);

		this.discounts = {};

		if (this.props.levels) {
			this.props.levels.forEach(lv => {
				let info = lv.discountLevel;
				this.discounts[info.Name] = this.discounts[info.Name] || [];
				this.discounts[info.Name].push(info);
			});
		}

		// this.props.oneOffAllowed
		// this.props.recurringAllowed

		this.state = {
			pagination: {
				page: 1,
				pageSize: 10
			}
		};
	}

	negotiateInline(charge, value) {
		let negotiation = this.props.attachment;
		negotiation[charge.Id] = negotiation[charge.Id] || {};
		negotiation[charge.Id][charge._type] = +value;

		this.props.onNegotiate(negotiation);
	}

	isChargeAllowed(chargeType) {
		if (chargeType === 'One-off Charge') {
			return this.props.oneOffAllowed;
		}

		if (chargeType === 'Recurring Charge') {
			return this.props.recurringAllowed;
		}

		console.error(
			chargeType + ' is neither "One-Off Charge" nor "Recurring Charge"'
		);
	}

	render() {
		return (
			<div className="table-container">
				<div className="table-list-header">
					<div className="list-cell align-left">
						{window.SF.labels.charges_header_name}
					</div>
					<div className="list-cell align-left">
						{window.SF.labels.charges_header_type}
					</div>
					<div className="list-cell">
						{window.SF.labels.charges_header_oneOff}
					</div>
					<div className="list-cell">{window.SF.labels.charges_header_neg}</div>
					<div className="list-cell">
						{window.SF.labels.charges_header_recc}
					</div>
					<div className="list-cell">
						{window.SF.labels.charges_header_recc_neg}
					</div>
				</div>

				<ul className="table-list">
					{this.props.charges
						.paginate(
							this.state.pagination.page,
							this.state.pagination.pageSize
						)
						.map((charge, i) => {
							let recurringRow = 'N/A';
							let oneOffRow = 'N/A';
							let flagColor = '#4bca81';
							var value;

							if (charge.oneOff != null) {
								value =
									this.props.attachment[charge.Id] &&
									this.props.attachment[charge.Id].hasOwnProperty('oneOff')
										? this.props.attachment[charge.Id].oneOff
										: charge.oneOff;
								if (this.discounts[charge.Name] && !this.props.disableLevels) {
									oneOffRow = (
										<DropdownNegotiate
											readOnly={
												this.props.readOnly ||
												!this.isChargeAllowed(charge.chargeType)
											}
											invalid={this.props.validation[charge.Id]}
											discounts={this.discounts[charge.Name]}
											onChange={val => {
												this.negotiateInline(charge, val);
											}}
											discAsPrice={
												this.props.settings.FACSettings.discount_as_price
											}
											negotiatedValue={value}
											originalValue={charge.oneOff}
										/>
									);
								} else {
									oneOffRow = (
										<InputNegotiate
											readOnly={
												this.props.readOnly ||
												!this.isChargeAllowed(charge.chargeType) ||
												this.props.disableInputs
											}
											invalid={this.props.validation[charge.Id]}
											onChange={val => {
												this.negotiateInline(charge, val);
											}}
											negotiatedValue={value}
											originalValue={charge.oneOff}
										/>
									);
								}
							}

							if (charge.recurring != null) {
								value =
									this.props.attachment[charge.Id] &&
									this.props.attachment[charge.Id].hasOwnProperty('recurring')
										? this.props.attachment[charge.Id].recurring
										: charge.recurring;
								if (this.discounts[charge.Name] && !this.props.disableLevels) {
									// BINGO
									recurringRow = (
										<DropdownNegotiate
											readOnly={
												this.props.readOnly ||
												!this.isChargeAllowed(charge.chargeType)
											}
											invalid={this.props.validation[charge.Id]}
											discounts={this.discounts[charge.Name]}
											onChange={val => {
												this.negotiateInline(charge, val);
											}}
											negotiatedValue={value}
											discAsPrice={
												this.props.settings.FACSettings.discount_as_price
											}
											originalValue={charge.recurring}
										/>
									);
								} else {
									recurringRow = (
										<InputNegotiate
											readOnly={
												this.props.readOnly ||
												!this.isChargeAllowed(charge.chargeType) ||
												this.props.disableInputs
											}
											invalid={this.props.validation[charge.Id]}
											onChange={val => {
												this.negotiateInline(charge, val);
											}}
											negotiatedValue={value}
											originalValue={charge.recurring}
										/>
									);
								}
							}

							if (this.props.validation[charge.Id]) {
								flagColor = '#D9675D';
							}

							if (this.props.readOnly) {
								flagColor = '#ccc';
							}

							return (
								<li key={charge.Id} className="list-row">
									<div className="list-cell align-left">
										<Icon name="priority" width="14" color={flagColor} />
										{charge.Name}
									</div>
									<div className="list-cell align-left">
										{charge.chargeType}
									</div>
									<div className="list-cell">
										{charge.hasOwnProperty('oneOff')
											? charge.oneOff.toFixedNumber()
											: 'N/A'}
									</div>
									<div className="list-cell negotiable">{oneOffRow}</div>
									<div className="list-cell">
										{charge.hasOwnProperty('recurring')
											? charge.recurring.toFixedNumber()
											: 'N/A'}
									</div>
									<div className="list-cell negotiable">{recurringRow}</div>
								</li>
							);
						})}
				</ul>

				<Pagination
					totalSize={this.props.charges.length}
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

// export default Charges

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
)(Charges);

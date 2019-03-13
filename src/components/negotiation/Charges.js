import React, { Component } from 'react';
import { connect } from 'react-redux';

import Icon from '../utillity/Icon';

import './Charges.scss';
import InputNegotiate from '../utillity/inputs/InputNegotiate';
import DropdownNegotiate from '../utillity/inputs/DropdownNegotiate';

class Charges extends React.Component {
	constructor(props) {
		super(props);

		this.discounts = {};

		if (this.props.level) {
			this.props.level.forEach(lv => {
				let info = this.props.settings.DiscLevels[lv].discountLevel;
				this.discounts[info.Name] = this.discounts[info.Name] || [];
				this.discounts[info.Name].push(info);
			});
		}
	}

	negotiateInline(charge, value) {
		let negotiation = this.props.attachment;
		negotiation[charge.Id] = negotiation[charge.Id] || {};
		negotiation[charge.Id][charge._type] = value;

		this.props.onNegotiate(negotiation);
	}

	render() {
		let flagColor = this.props.readOnly ? '#ccc' : '#4bca81';

		return (
			<div className="table-container">
				<div className="table-list-header">
					<div className="list-cell">Charge Name</div>
					<div className="list-cell">Charge Type</div>
					<div className="list-cell">One-Off Adjustment</div>
					<div className="list-cell">Negotiated One Off</div>
					<div className="list-cell">Recurring Adjustment</div>
					<div className="list-cell">Negotiated Recurring</div>
				</div>

				<ul className="table-list">
					{this.props.charges.map((charge, i) => {
						let recurringRow = 'N/A';
						let oneOffRow = 'N/A';
						var value;

						if (charge.oneOff != null) {
							value =
								this.props.attachment[charge.Id] &&
								this.props.attachment[charge.Id].hasOwnProperty('oneOff')
									? this.props.attachment[charge.Id].oneOff
									: charge.oneOff;
							if (this.discounts[charge.Name]) {
								// BINGO
								oneOffRow = (
									<DropdownNegotiate
										readOnly={this.props.readOnly}
										invalid={this.props.validation[charge.Id]}
										discounts={this.discounts[charge.Name]}
										onChange={val => {
											this.negotiateInline(charge, val);
										}}
										negotiatedValue={value}
										originalValue={charge.oneOff}
									/>
								);
							} else {
								oneOffRow = (
									<InputNegotiate
										readOnly={this.props.readOnly}
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
							if (this.discounts[charge.Name]) {
								// BINGO
								recurringRow = (
									<DropdownNegotiate
										readOnly={this.props.readOnly}
										invalid={this.props.validation[charge.Id]}
										discounts={this.discounts[charge.Name]}
										onChange={val => {
											this.negotiateInline(charge, val);
										}}
										negotiatedValue={value}
										originalValue={charge.recurring}
									/>
								);
							} else {
								recurringRow = (
									<InputNegotiate
										readOnly={this.props.readOnly}
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

						return (
							<li key={charge.Id} className="list-row">
								<div className="list-cell">
									<Icon name="priority" width="14" color={flagColor} />{' '}
									{charge.Name}
								</div>
								<div className="list-cell"> {charge.chargeType}</div>
								<div className="list-cell"> {charge.oneOff || 'N/A'}</div>
								<div className="list-cell negotiable">{oneOffRow}</div>
								<div className="list-cell"> {charge.recurring || 'N/A'}</div>
								<div className="list-cell negotiable">{recurringRow}</div>
							</li>
						);
					})}
				</ul>
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

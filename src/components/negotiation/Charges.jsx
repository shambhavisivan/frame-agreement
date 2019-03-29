import React, { Component } from 'react';
import { connect } from 'react-redux';

import Icon from '../utillity/Icon';

import './Charges.scss';
import InputNegotiate from '../utillity/inputs/InputNegotiate';
import DropdownNegotiate from '../utillity/inputs/DropdownNegotiate';
import Pagination from '../utillity/Pagination';

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
		negotiation[charge.Id][charge._type] = value;

		this.props.onNegotiate(negotiation);
	}

	render() {
		let flagColor = '#4bca81';

		return (
			<div className="table-container">
				<div className="table-list-header">
					<div className="list-cell">
						{window.SF.labels.charges_header_name}
					</div>
					<div className="list-cell">
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

							if (this.props.validation[charge.Id]) {
								flagColor = '#D9675D';
							}

							if (this.props.readOnly) {
								flagColor = '#ccc';
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

				<Pagination
					totalSize={this.props.charges.length}
					pageSize={this.state.pagination.pageSize}
					page={this.state.pagination.page}
					onPageSizeChange={newPageSize => {
						this.setState({
							pagination: { ...this.state.pagination, pageSize: newPageSize }
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
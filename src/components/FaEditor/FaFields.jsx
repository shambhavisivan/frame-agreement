import React, { Component } from 'react';
import { connect } from 'react-redux';

import { updateFrameAgreement } from '../../actions';

import SFField from '../utillity/SFField';
import Icon from '../utillity/Icon';
import Shape from '../skeletons/Shape';

class FaFields extends React.Component {
	constructor(props) {
		super(props);
		// this.props.rows
		// this.props.onChange
		// this.props.fa
		// this.props.editable

		this.onFieldChange = this.onFieldChange.bind(this);
		this.editable = this.props.settings.FACSettings.fa_editable_statuses.has(
			this.props.frameAgreements[this.props.faId].csconta__Status__c
		);

		console.log(props.rows);
	}

	// componentWillUpdate(a,b) {
	// 	console.log(a);
	// 	console.log(b);
	// 	console.warn(this.props.frameAgreements[this.props.faId]);
	// }

	onFieldChange(field, value) {
		this.props.updateFrameAgreement(this.props.faId, field, value);
		this.props.onActionTaken();
	}

	render() {
		let _faFields = '';
		if (this.props.frameAgreements[this.props.faId]._ui.headerRows.length) {
			_faFields = (
				<section className="card basket-details-card">
					{this.props.frameAgreements[this.props.faId]._ui.headerRows.map(
						(row, i) => {
							return (
								<div
									className="basket-details-card__row"
									key={'header-row-' + i}
								>
									{row.map(f => {
										var editable = !f.readOnly && this.editable;
										return (
											<SFField
												editable={editable}
												onChange={this.onFieldChange}
												key={f.field}
												field={f}
												value={
													this.props.frameAgreements[this.props.faId][
														f.field
													] || ''
												}
											/>
										);
									})}
								</div>
							);
						}
					)}
				</section>
			);
		}

		return _faFields;
	}
}

const mapStateToProps = state => {
	return {
		frameAgreements: state.frameAgreements,
		settings: state.settings
	};
};

const mapDispatchToProps = {
	updateFrameAgreement
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(FaFields);

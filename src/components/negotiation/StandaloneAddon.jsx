import React, { Component } from 'react';
import { connect } from 'react-redux';

import Icon from '../utillity/Icon';
import InputNegotiate from '../utillity/inputs/InputNegotiate';
import DropdownNegotiate from '../utillity/inputs/DropdownNegotiate';

import Checkbox from '../utillity/inputs/Checkbox';

import { log } from '~/src/utils/shared-service.js';

import { setFrameAgreementState, negotiate } from '~/src/actions';

import NumberFormat from '~/src/components/negotiation/NumberFormat';
import { isOneOff, isRecurring } from '~/src/utils/shared-service';
import ProductRow from '../utillity/ProductRow';

export class StandaloneAddon extends React.Component {
	constructor(props) {
		super(props);

		this.onExpandProduct = this.onExpandProduct.bind(this);
		this.negotiateInline = this.negotiateInline.bind(this);

		this.state = {
			open: false
		};
	}

	onExpandProduct(e) {
		this.setState({ open: !this.state.open });
		e.stopPropagation();
	}

	negotiateInline(addon, chargeType, value) {
		const prevNegotiation = { ...this.props.attachment };
		const negotiationContext = {
			previousNegotiations: {
				[chargeType]: prevNegotiation[addon.Id][chargeType]
			},
			currentNegotiations: {
				[chargeType]: Number(value)
			}
		}

		let updatedNegotiation = { ...prevNegotiation };
		updatedNegotiation[addon.Id] = { ...updatedNegotiation[addon.Id] } || {};
		updatedNegotiation[addon.Id][chargeType] = Number(value);

		this.props.onNegotiate(updatedNegotiation, addon.Id, negotiationContext);
	}

	render() {
		let _attachment = this.props.frameAgreements[this.props.faId]._ui.attachment.addons[
			this.props.addon.Id
		];

		let recurringRow = 'N/A';
		let oneOffRow = 'N/A';
		var negValue;

		let val_oneOff = false;
		let val_recurring = false;

		let _oneOffAllowed = this.props.addon.cspmb__Is_One_Off_Discount_Allowed__c;
		let _recurringAllowed = this.props.addon.cspmb__Is_Recurring_Discount_Allowed__c;

		try {
			val_oneOff = this.props.validationAddons[this.props.faId][this.props.addon.Id].oneOff;
		} catch (err) {}

		try {
			val_recurring = this.props.validationAddons[this.props.faId][this.props.addon.Id].recurring;
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

		if (this.props.addon._discountLvIds) {
			this.props.addon._discountLvIds.forEach(lv => {
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

		if (this.props.addon.cspmb__One_Off_Charge__c != null) {
			negValue =
				this.props.attachment[this.props.addon.Id] &&
				this.props.attachment[this.props.addon.Id].hasOwnProperty('oneOff')
					? this.props.attachment[this.props.addon.Id].oneOff
					: this.props.addon.cspmb__One_Off_Charge__c;
			if (oneOffDiscounts && !this.props.disableLevels) {
				oneOffRow = (
					<DropdownNegotiate
						readOnly={this.props.readOnly || !_oneOffAllowed}
						invalid={val_oneOff}
						discounts={oneOffDiscounts}
						onChange={val => {
							this.negotiateInline(this.props.addon, 'oneOff', val);
						}}
						discAsPrice={this.props.settings.FACSettings.discount_as_price}
						negotiatedValue={negValue}
						originalValue={this.props.addon.cspmb__One_Off_Charge__c}
					/>
				);
			} else {
				oneOffRow = (
					<InputNegotiate
						readOnly={this.props.readOnly || this.props.disableInputs || !_oneOffAllowed}
						invalid={val_oneOff}
						onChange={val => {
							this.negotiateInline(this.props.addon, 'oneOff', val);
						}}
						negotiatedValue={negValue}
						originalValue={this.props.addon.cspmb__One_Off_Charge__c}
					/>
				);
			}
		}

		if (this.props.addon.cspmb__Recurring_Charge__c != null) {
			negValue =
				this.props.attachment[this.props.addon.Id] &&
				this.props.attachment[this.props.addon.Id].hasOwnProperty('recurring')
					? this.props.attachment[this.props.addon.Id].recurring
					: this.props.addon.cspmb__Recurring_Charge__c;
			if (recurringDiscounts && !this.props.disableLevels) {
				recurringRow = (
					<DropdownNegotiate
						readOnly={this.props.readOnly || !_recurringAllowed}
						invalid={val_recurring}
						discounts={recurringDiscounts}
						onChange={val => {
							this.negotiateInline(this.props.addon, 'recurring', val);
						}}
						discAsPrice={this.props.settings.FACSettings.discount_as_price}
						negotiatedValue={negValue}
						originalValue={this.props.addon.cspmb__Recurring_Charge__c}
					/>
				);
			} else {
				recurringRow = (
					<InputNegotiate
						readOnly={this.props.readOnly || this.props.disableInputs || !_recurringAllowed}
						invalid={val_recurring}
						onChange={val => {
							this.negotiateInline(this.props.addon, 'recurring', val);
						}}
						negotiatedValue={negValue}
						originalValue={this.props.addon.cspmb__Recurring_Charge__c}
					/>
				);
			}
		}

		return (
			<div
				className={
					'product-card__container' + (val_oneOff || val_recurring ? ' invalid-product' : '')
				}
			>
				<div className="container__header">
					<div className="container__checkbox">
						<Checkbox
							disabled={this.props.readOnly}
							value={this.props.selected}
							onChange={() => {
								this.props.onSelect(this.props.addon);
							}}
						/>
					</div>
					<div className="container__fields">
						<div className="fields__item fields__item--title" onClick={this.onExpandProduct}>
							{this.props.addon.Name}
						</div>
						{this.props.settings.FACSettings.standalone_addon_fields.map((field, i) => {
							return (
								<div
									className={'fields__item'}
									key={'fadd' + 'id' + i}
									onClick={this.onExpandProduct}
								>
									<ProductRow
										product={this.props.addon}
										fieldName={field}
										iconSize={18}
									/>
								</div>
							);
						})}
					</div>
				</div>
				{this.state.open && (
					<div className="commercial-product-body">
						<div className="table-container">
							<div className="table-list-header">
								<div className="list-cell">{window.SF.labels.addons_header_name}</div>
								<div className="list-cell">{window.SF.labels.addons_header_oneOff}</div>
								<div className="list-cell">{window.SF.labels.addons_header_oneOff_neg}</div>
								<div className="list-cell">{window.SF.labels.addons_header_recc}</div>
								<div className="list-cell">{window.SF.labels.addons_header_recc_neg}</div>
							</div>

							<ul className="table-list">
								<li className="list-row">
									<div className="list-cell">
										<Icon name="priority" width="14" color={flagColor} />
										{this.props.addon.Name}
									</div>

									<div className="list-cell">
										<NumberFormat value={this.props.addon.cspmb__One_Off_Charge__c} />
									</div>

									<div className="list-cell negotiable">{oneOffRow}</div>

									<div className="list-cell">
										<NumberFormat value={this.props.addon.cspmb__Recurring_Charge__c} />
									</div>

									<div className="list-cell negotiable">{recurringRow}</div>
								</li>
							</ul>
						</div>
					</div>
				)}
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		frameAgreements: state.frameAgreements,
		validationAddons: state.validationAddons,
		ignoreSettings: state.ignoreSettings,
		settings: state.settings
	};
};

const mapDispatchToProps = {
	setFrameAgreementState,
	negotiate
};

export default connect(mapStateToProps, mapDispatchToProps)(StandaloneAddon);

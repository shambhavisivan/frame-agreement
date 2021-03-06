import React, { Component } from 'react';
import { connect } from 'react-redux';

import ExpandableArticle from '../utillity/ExpandableArticle';

import Tabs from '../utillity/tabs/Tabs';
import Tab from '../utillity/tabs/Tab';

import Checkbox from '../utillity/inputs/Checkbox';
import InputVolume from '../utillity/inputs/InputVolume';

import ProductCharges from './ProductCharges';

import Addons from './Addons';
import Charges from './Charges';
import Rates from './Rates';
import Allowances from './Allowances';

import {
	validateAddons,
	validateProduct,
	validateCharges,
	validateRateCardLines
} from '../../utils/validation-service';

import { log } from '~/src/utils/shared-service.js';
import SettingsContext from '~/src/utils/settings-context.js';

import { publish } from '~/src/api';

import { setValidation, setFrameAgreementState, negotiate } from '~/src/actions';
import ProductRow from '../utillity/ProductRow';

export class CommercialProduct extends React.Component {
	constructor(props) {
		super(props);

		this.onExpandProduct = this.onExpandProduct.bind(this);
		this.buildEventData = this.buildEventData.bind(this);

		this.productId = this.props.product.Id;
		this.validation = this.props.validation || {};

		this.state = {
			loading: false,
			open: false
		};
	}

	onExpandProduct(e) {
		this.setState({ open: !this.state.open });
		e.stopPropagation();
	}

	updateVolume(volume, value) {
		let _volume = this.props.frameAgreements[this.props.faId]._ui.attachment.products[
			this.productId
		]._volume;
		const negotiationContext = {
			previousNegotiations: {
				volume: {
					[volume]: _volume[volume]
				}
			},
			currentNegotiations: {
				volume: {
					[volume]: value
				}
			}
		}
		_volume[volume] = value;

		this.onNegotiate('_volume', _volume, negotiationContext);
	}

	async onNegotiate(type, data, negotiationContext) {
		let initialFrameAgreementProducts = this.props.currentFrameAgreement._ui.attachment?.products ?? {};
		let eventHookData = this.buildEventData(type, negotiationContext);

		try {
			eventHookData = await publish('onBeforeNegotiate', eventHookData);
		} catch (error) {
			console.error(window.SF.labels.subscriber_rejection_error);
			console.error(error);
			return;
		}

		if (type === '_addons') {
			this.props.setValidation(
				this.props.faId,
				this.productId,
				'addons',
				validateAddons(
					this.props.product._addons,
					data,
					initialFrameAgreementProducts[this.productId]?._addons || {},
					{
						frameAgreementStatus: this.props.frameAgreements[this.props.faId].csconta__Status__c,
						facApprovedStatus: this.props.settings.FACSettings.statuses.approved_status
					}
				)
			);
		}

		if (type === '_charges') {
			this.props.setValidation(
				this.props.faId,
				this.productId,
				'charges',
				validateCharges(
					this.props.product._charges,
					this.props.product.cspmb__Authorization_Level__c,
					data,
					initialFrameAgreementProducts[this.productId]?._charges || {},
					{
						frameAgreementStatus: this.props.frameAgreements[this.props.faId].csconta__Status__c,
						facApprovedStatus: this.props.settings.FACSettings.statuses.approved_status
					}
				)
			);
		}

		if (type === '_rateCards') {
			this.props.setValidation(
				this.props.faId,
				this.productId,
				'rated',
				validateRateCardLines(
					this.props.product._rateCards,
					data,
					initialFrameAgreementProducts[this.productId]?._rateCards || {},
					{
						frameAgreementStatus: this.props.frameAgreements[this.props.faId].csconta__Status__c,
						facApprovedStatus: this.props.settings.FACSettings.statuses.approved_status
					}
				)
			);
		}

		if (type === '_product') {
			this.props.setValidation(
				this.props.faId,
				this.productId,
				'product',
				validateProduct({
					oneOff: this.props.product.cspmb__One_Off_Charge__c,
					negotiatedOneOff: data.oneOff,
					recurring: this.props.product.cspmb__Recurring_Charge__c,
					negotiatedRecurring: data.recurring,
					authLevel: this.props.product.cspmb__Authorization_Level__c || null,
					Name: this.props.product.Name
				}, {
					negotiatedOneOff: initialFrameAgreementProducts[this.productId]?._product?.oneOff,
					negotiatedRecurring: initialFrameAgreementProducts[this.productId]?._product?.recurring,
				}, {
					frameAgreementStatus: this.props.frameAgreements[this.props.faId].csconta__Status__c,
					facApprovedStatus: this.props.settings.FACSettings.statuses.approved_status
				})
			);
		}

		window.FAM.api.validateStatusConsistency(this.props.faId);

		this.props.negotiate(this.props.faId, this.productId, type, data);

		publish('onAfterNegotiate', this.props.frameAgreements[this.props.faId]._ui.attachment);
	}

	buildEventData(type, negotiationContext) {
		let eventHookData = {
			type: 'Commercial Products',
			[this.productId]: {}
		}

		switch (type) {
			case '_addons':
				eventHookData[this.productId].addons = { ...negotiationContext };
				return eventHookData;
			case '_charges':
				eventHookData[this.productId].charges = { ...negotiationContext };
				return eventHookData;
			case '_rateCards':
				eventHookData[this.productId].rateCards = { ...negotiationContext };
				return eventHookData;
			case '_product':
				eventHookData[this.productId].product = { ...negotiationContext };
				return eventHookData;
			case '_volume':
				eventHookData[this.productId].volume = { ...negotiationContext };
				return eventHookData;
		}
	}

	render() {
		let _attachment = this.props.frameAgreements[this.props.faId]._ui.attachment.products[
			this.productId
		];
		let _editable = window.FAM.api.isAgreementEditable(this.props.faId);

		let _ignoreProducts = new Set(this.props.ignoreSettings.products || []);

		let _disableLevels = !!this.props.frameAgreements[this.props.faId]._ui.disableDiscountLevels;
		let _disableInputs = !!this.props.frameAgreements[this.props.faId]._ui.disableInlineDiscounts;

		let _productIgnored = _productIgnored;

		return (
			<SettingsContext.Provider value={this.props.settings}>
				<div
					className={
						'product-card__container' +
						(this.state.open ? ' product-open' : '') +
						(this.props.validationProduct[this.productId] ? ' invalid-product' : '')
					}
				>
					<div className="container__header">
						<div className="container__checkbox">
							<Checkbox
								disabled={!_editable}
								value={this.props.selected}
								onChange={() => {
									this.props.onSelect(this.props.product);
								}}
							/>
						</div>
						<div className="container__fields">
							<div className="fields__item fields__item--title" onClick={this.onExpandProduct}>
								{this.props.product.Name}
							</div>
							{this.props.productFields
								.filter(f => f.visible)
								.map((productField, index) => {
									let _field;
									if (productField.volume && _attachment) {
										_field = (
											<div
												className="fields__item volume-fields"
												key={'facp-' + this.props.product.Id + '-' + productField + index}
											>
												<InputVolume
													readOnly={!_editable}
													disabled={this.props.disableFrameAgreementOperations}
													value={_attachment._volume[productField.volume]}
													onChange={val => {
														this.updateVolume(productField.volume, val);
													}}
												/>
											</div>
										);
									} else {
										_field = (
											<div
												className="fields__item"
												onClick={this.onExpandProduct}
												key={'facp-' + this.props.product.Id + '-' + productField + index}
											>
												<ProductRow
													product={this.props.product}
													fieldName={productField.name}
													iconSize={18}
												/>
											</div>
										);
									}
									return _field;
								})}
						</div>
					</div>
					{this.state.open && (
						<div className="commercial-product-body">
							{this.props.product.cspmb__Price_Item_Description__c && (
								<div className="commercial-product-description">
									<ExpandableArticle>
										{this.props.product.cspmb__Price_Item_Description__c}
									</ExpandableArticle>
								</div>
							)}
							<Tabs initial={this.props.product._addons.length ? 0 : 1}>
								<Tab
									label={window.SF.labels.products_addons}
									disabled={!this.props.product._addons.length}
								>
									<Addons
										readOnly={
											this.props.disableFrameAgreementOperations ||
											!_editable ||
											(_disableLevels && _disableInputs)
										}
										disableInputs={_productIgnored || _disableInputs}
										disableLevels={_productIgnored || _disableLevels}
										validation={this.props.validation[this.productId].addons}
										attachment={_attachment._addons || {}}
										addons={this.props.product._addons}
										onNegotiate={(data, negotiationContext) => {
											this.onNegotiate('_addons', data, negotiationContext);
										}}
									/>
								</Tab>
								<Tab
									label={
										this.props.product._charges.length
											? window.SF.labels.products_charges
											: window.SF.labels.products_product_charges
									}
								>
									{this.props.product._charges.length ? (
										<Charges
											readOnly={
												this.props.disableFrameAgreementOperations ||
												!_editable ||
												(_disableLevels && _disableInputs)
											}
											disableInputs={_productIgnored || _disableInputs}
											disableLevels={_productIgnored || _disableLevels}
											oneOffAllowed={this.props.product.cspmb__Is_One_Off_Discount_Allowed__c}
											recurringAllowed={this.props.product.cspmb__Is_Recurring_Discount_Allowed__c}
											levels={this.props.product._discountLvIds}
											validation={this.props.validation[this.productId].charges}
											attachment={_attachment._charges || {}}
											onNegotiate={(data, negotiationContext) => {
												this.onNegotiate('_charges', data, negotiationContext);
											}}
											authLevel={this.props.product.cspmb__Authorization_Level__c}
											charges={this.props.product._charges}
										/>
									) : (
										<ProductCharges
											readOnly={
												this.props.disableFrameAgreementOperations ||
												!_editable ||
												(_disableLevels && _disableInputs)
											}
											product={this.props.product}
											disableInputs={_productIgnored || _disableInputs}
											disableLevels={_productIgnored || _disableLevels}
											oneOffAllowed={this.props.product.cspmb__Is_One_Off_Discount_Allowed__c}
											recurringAllowed={this.props.product.cspmb__Is_Recurring_Discount_Allowed__c}
											levels={this.props.product._discountLvIds}
											validation={this.props.validation[this.productId].product}
											attachment={_attachment._product || {}}
											onNegotiate={(data, negotiationContext) => {
												this.onNegotiate('_product', data, negotiationContext);
											}}
										/>
									)}
								</Tab>
								<Tab
									label={window.SF.labels.products_rates}
									disabled={!this.props.product._rateCards.length}
								>
									<Rates
										readOnly={
											this.props.disableFrameAgreementOperations ||
											!_editable ||
											_disableInputs
										}
										validation={this.props.validation[this.productId].rated}
										attachment={_attachment._rateCards || {}}
										rateCards={this.props.product._rateCards}
										onNegotiate={(data, negotiationContext) => {
											this.onNegotiate('_rateCards', data, negotiationContext);
										}}
									/>
								</Tab>
								<Tab
									label={window.SF.labels.products_allowances}
									disabled={!this.props.product._allowances.length}
								>
									<Allowances data={this.props.product._allowances} />
								</Tab>
							</Tabs>
						</div>
					)}
				</div>
			</SettingsContext.Provider>
		);
	}
}

const mapStateToProps = state => {
	return {
		frameAgreements: state.frameAgreements,
		currentFrameAgreement: state.currentFrameAgreement,
		validation: state.validation,
		validationProduct: state.validationProduct,
		productFields: state.productFields,
		ignoreSettings: state.ignoreSettings,
		settings: state.settings,
		disableFrameAgreementOperations: state.disableFrameAgreementOperations
	};
};

const mapDispatchToProps = {
	setValidation,
	setFrameAgreementState,
	negotiate
};

export default connect(mapStateToProps, mapDispatchToProps)(CommercialProduct);

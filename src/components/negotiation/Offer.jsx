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

import { setValidation, setFrameAgreementState, negotiateOffers } from '~/src/actions';
import { OffersMetadata } from './offers-metadata';
import ProductRow from '../utillity/ProductRow';

export class Offer extends React.Component {
	constructor(props) {
		super(props);

		this.onExpandOffer = this.onExpandOffer.bind(this);
		this.buildEventData = this.buildEventData.bind(this);

		this.offerId = this.props.offer.Id;
		this.validation = this.props.validationOffersInfo || {};
		this.state = {
			loading: false,
			open: false
		};
	}

	onExpandOffer(e) {
		this.setState({ open: !this.state.open });
		e.stopPropagation();
	}

	updateVolume(volume, value) {
		let _volume = this.props.frameAgreements[this.props.faId]._ui.attachment.offers[
			this.offerId
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
		let initialFrameAgreementOffers = this.props.currentFrameAgreement._ui.attachment?.offers ?? {};
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
				this.offerId,
				'addons',
				validateAddons(
					this.props.offer._addons,
					data,
					initialFrameAgreementOffers[this.offerId]?._addons || {},
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
				this.offerId,
				'charges',
				validateCharges(
					this.props.offer._charges,
					this.props.offer.cspmb__Authorization_Level__c,
					data,
					initialFrameAgreementOffers[this.offerId]?._charges || {},
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
				this.offerId,
				'rated',
				validateRateCardLines(
					this.props.offer._rateCards,
					data,
					initialFrameAgreementOffers[this.offerId]?._rateCards || {},
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
				this.offerId,
				'product',
				validateProduct({
					oneOff: this.props.offer.cspmb__One_Off_Charge__c,
					negotiatedOneOff: data.oneOff,
					recurring: this.props.offer.cspmb__Recurring_Charge__c,
					negotiatedRecurring: data.recurring,
					authLevel: this.props.offer.cspmb__Authorization_Level__c || null,
					Name: this.props.offer.Name
				}, {
					negotiatedOneOff: initialFrameAgreementOffers[this.offerId]?._product?.oneOff,
					negotiatedRecurring: initialFrameAgreementOffers[this.offerId]?._product?.recurring,
				}, {
					frameAgreementStatus: this.props.frameAgreements[this.props.faId].csconta__Status__c,
					facApprovedStatus: this.props.settings.FACSettings.statuses.approved_status
				})
			);
		}

		window.FAM.api.validateStatusConsistency(this.props.faId);

		this.props.negotiateOffers(this.props.faId, this.offerId, type, data);

		publish('onAfterNegotiate', this.props.frameAgreements[this.props.faId]._ui.attachment);
	}

	buildEventData(type, negotiationContext) {
		let eventHookData = {
			type: 'Offers',
			[this.offerId]: {}
		}

		switch (type) {
			case '_addons':
				eventHookData[this.offerId].addons = { ...negotiationContext };
				return eventHookData;
			case '_charges':
				eventHookData[this.offerId].charges = { ...negotiationContext };
				return eventHookData;
			case '_rateCards':
				eventHookData[this.offerId].rateCards = { ...negotiationContext };
				return eventHookData;
			case '_product':
				eventHookData[this.offerId].product = { ...negotiationContext };
				return eventHookData;
			case '_volume':
				eventHookData[this.offerId].volume = { ...negotiationContext };
				return eventHookData;
		}
	}

	render() {
		let _attachment = this.props.frameAgreements[this.props.faId]._ui.attachment.offers[
			this.offerId
		];
		let _editable = window.FAM.api.isAgreementEditable(this.props.faId);

		let _ignoreProducts = new Set(this.props.ignoreSettings.offers || []);

		let _disableLevels = !!this.props.frameAgreements[this.props.faId]._ui.disableDiscountLevels;
		let _disableInputs = !!this.props.frameAgreements[this.props.faId]._ui.disableInlineDiscounts;

		let _productIgnored = _productIgnored;

		return (
			<SettingsContext.Provider value={this.props.settings}>
				<div
					className={
						'product-card__container' +
						(this.state.open ? ' product-open' : '') +
						(this.props.validationOffers[this.offerId] ? ' invalid-product' : '')
					}
				>
					<div className="container__header">
						<div className="container__checkbox">
							<Checkbox
								disabled={!_editable}
								value={this.props.selected}
								onChange={() => {
									this.props.onSelect(this.props.offer);
								}}
							/>
						</div>
						<div className="container__fields">
							<div className="fields__item fields__item--title" onClick={this.onExpandOffer}>
								{this.props.offer.Name}
							</div>
							{this.props.productFields
								.filter(f => f.visible)
								.map((offerField, index) => {
									let _field;
									if (offerField.volume && _attachment) {
										_field = (
											<div
												className="fields__item volume-fields"
												key={'facp-' + this.props.offer.Id + '-' + offerField + index}
											>
												<InputVolume
													readOnly={!_editable}
													disabled={this.props.disableFrameAgreementOperations}
													value={_attachment._volume[offerField.volume]}
													onChange={val => {
														this.updateVolume(offerField.volume, val);
													}}
												/>
											</div>
										);
									} else {
										_field = (
											<div
												className="fields__item"
												onClick={this.onExpandOffer}
												key={'facp-' + this.props.offer.Id + '-' + offerField + index}
											>
												<ProductRow
													product={this.props.offer}
													fieldName={offerField.name}
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
							{this.props.offer.cspmb__Price_Item_Description__c && (
								<div className="commercial-product-description">
									<ExpandableArticle>
										{this.props.offer.cspmb__Price_Item_Description__c}
									</ExpandableArticle>
								</div>
							)}
							<Tabs initial={this.props.offer._addons.length ? 0 : 1}>
								<Tab
									label={window.SF.labels.products_addons}
									disabled={!this.props.offer._addons.length}
								>
									<Addons
										readOnly={
											this.props.disableFrameAgreementOperations ||
											!_editable ||
											(_disableLevels && _disableInputs)
										}
										disableInputs={_productIgnored || _disableInputs}
										disableLevels={_productIgnored || _disableLevels}
										validation={this.props.validationOffersInfo[this.offerId].addons}
										attachment={_attachment._addons || {}}
										addons={this.props.offer._addons}
										onNegotiate={(data, negotiationContext) => {
											this.onNegotiate('_addons', data, negotiationContext);
										}}
									/>
								</Tab>
								<Tab
									label={
										this.props.offer._charges.length
											? window.SF.labels.products_charges
											: window.SF.labels.products_product_charges
									}
								>
									{this.props.offer._charges.length ? (
										<Charges
											readOnly={
												this.props.disableFrameAgreementOperations ||
												!_editable ||
												(_disableLevels && _disableInputs)
											}
											disableInputs={_productIgnored || _disableInputs}
											disableLevels={_productIgnored || _disableLevels}
											oneOffAllowed={this.props.offer.cspmb__Is_One_Off_Discount_Allowed__c}
											recurringAllowed={this.props.offer.cspmb__Is_Recurring_Discount_Allowed__c}
											levels={this.props.offer._discountLvIds}
											validation={this.props.validationOffersInfo[this.offerId].charges}
											attachment={_attachment._charges || {}}
											onNegotiate={(data, negotiationContext) => {
												this.onNegotiate('_charges', data, negotiationContext);
											}}
											authLevel={this.props.offer.cspmb__Authorization_Level__c}
											charges={this.props.offer._charges}
										/>
									) : (
										<ProductCharges
											readOnly={
												this.props.disableFrameAgreementOperations ||
												!_editable ||
												(_disableLevels && _disableInputs)
											}
											product={this.props.offer}
											disableInputs={_productIgnored || _disableInputs}
											disableLevels={_productIgnored || _disableLevels}
											oneOffAllowed={this.props.offer.cspmb__Is_One_Off_Discount_Allowed__c}
											recurringAllowed={this.props.offer.cspmb__Is_Recurring_Discount_Allowed__c}
											levels={this.props.offer._discountLvIds}
											validation={this.props.validationOffersInfo[this.offerId].product}
											attachment={_attachment._product || {}}
											onNegotiate={(data, negotiationContext) => {
												this.onNegotiate('_product', data, negotiationContext);
											}}
										/>
									)}
								</Tab>
								<Tab
									label={window.SF.labels.products_rates}
									disabled={!this.props.offer._rateCards.length}
								>
									<Rates
										readOnly={
											this.props.disableFrameAgreementOperations ||
											!_editable ||
											_disableInputs
										}
										validation={this.props.validationOffersInfo[this.offerId].rated}
										attachment={_attachment._rateCards || {}}
										rateCards={this.props.offer._rateCards}
										onNegotiate={(data, negotiationContext) => {
											this.onNegotiate('_rateCards', data, negotiationContext);
										}}
									/>
								</Tab>
								<Tab
									label={window.SF.labels.products_allowances}
									disabled={!this.props.offer._allowances.length}
								>
									<Allowances data={this.props.offer._allowances} />
								</Tab>
								<Tab label={window.SF.labels.offer_metadata_header} disabled={!this.props.offer._metadata}>
									<OffersMetadata data={this.props.offer._metadata.attributeMetadata} />
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
		validationOffers: state.validationOffers,
		validationOffersInfo: state.validationOffersInfo,
		productFields: state.productFields,
		ignoreSettings: state.ignoreSettings,
		settings: state.settings,
		disableFrameAgreementOperations: state.disableFrameAgreementOperations
	};
};

const mapDispatchToProps = {
	setValidation,
	setFrameAgreementState,
	negotiateOffers
};

export default connect(mapStateToProps, mapDispatchToProps)(Offer);

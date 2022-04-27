import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Modal from 'react-responsive-modal';
import { isDiscountAllowed, isFalsyExceptZero, isOneOff, isRecurring } from '../../utils/shared-service';

import { createToast } from '~/src/actions';
import { DiscountInput } from '../utillity/inputs/discount-input';
import * as Constants from '~/src/utils/constants'
import { getDiscountSet } from '../../utils/api-data-validation-service';

const BulkNegotiationAction = {
	RESET_NEGOTIATION_ACTION: 'RESET',
	APPLY_NEGOTIATION_ACTION: 'APPLY'
}

class NegotiationStandaloneModal extends Component {
	constructor(props) {
		super(props);

		this.mounted = null;

		this._setState = this._setState.bind(this);
		this.onCloseModal = this.onCloseModal.bind(this);
		this.applyDiscount = this.applyDiscount.bind(this);

		var attachment = {};
		try {
			attachment = { ...this.props.attachment };
			attachment = JSON.parse(JSON.stringify(this.props.attachment));
		} catch (err) {}

		this.state = {
			discountMode: 'percentage', // fixed
			discount: 0,
			applyOneOff: true,
			applyRecurring: true,
			validation: {},
			attachment,
			updatedAttachment: JSON.parse(JSON.stringify(attachment)),
			actionTaken: false,
			pagination: {
				page_addons: 1,
				pageSize: 10
			}
		};

		this.eventHookData = {
			type: Constants.EVENT_DATA_STANDALONE_ADDON
		};
	}

	_setState(newState, callback) {
		if (this.mounted) {
			this.setState(newState, () => {
				callback ? callback() : null;
			});
		}
	}

	componentDidMount() {
		this.mounted = true;
	}

	componentWillUnmount() {
		this.mounted = false;
	}

	onCloseModal() {
		this.props.onCloseModal();
	}

	applyDiscount(actionType) {
		const _DISCOUNT = +this.state.discount * -1;
		const facSettings = this.props.settings.FACSettings;
		let showNegotiationSkippedAlert = false;
		let appliedDiscountsCount = 0;

		function applyDiscountRate(prevNegotiatedPrice, discountMode, originalPrice) {

			if (actionType === BulkNegotiationAction.RESET_NEGOTIATION_ACTION) {
				return originalPrice;
			}

			let negotiatedPrice = facSettings.applyBulkDiscountListPrice
					? originalPrice
					: prevNegotiatedPrice;

			if (discountMode === 'fixed') {
				negotiatedPrice = negotiatedPrice + _DISCOUNT;
			} else {
				var discountSum = (negotiatedPrice * Math.abs(_DISCOUNT)) / 100;

				if (_DISCOUNT >= 0) {
					negotiatedPrice = negotiatedPrice + discountSum;
				} else {
					negotiatedPrice = negotiatedPrice - discountSum;
				}
			}

			if (facSettings.input_minmax_restriction) {
				if (negotiatedPrice < 0 || negotiatedPrice > originalPrice) {
					negotiatedPrice = prevNegotiatedPrice;
				}
			}

			return +negotiatedPrice.toFixedNumber();
		}

		function frameHookStandAloneAddonData(eventHookData, updatedAttachment, addon, chargeType, negotiatedValue) {
			const prevNegotiation = updatedAttachment[addon.Id] || {};
			eventHookData[addon.Id] = {
				...eventHookData[addon.Id],
				previousNegotiations: {
					...eventHookData[addon.Id]?.previousNegotiations,
					[chargeType]: prevNegotiation[chargeType]
				},
				currentNegotiations: {
					...eventHookData[addon.Id]?.currentNegotiations,
					[chargeType]: negotiatedValue
				}
			}

			return eventHookData;
		}
		let attachment = {};
		let associatedAddOns = this.state.attachment;
		let eventHookData = this.eventHookData;

		this.props.addons.forEach(add => {

			let addOn = {
				[add.Id]: {
					recurring: associatedAddOns[add.Id]?.recurring,
					oneOff: associatedAddOns[add.Id]?.oneOff
				}
			};

			if (
				this.state.applyRecurring &&
				add.hasOwnProperty('cspmb__Recurring_Charge__c') &&
				isDiscountAllowed('recurring', add)
			) {

				const prevNegotiatedPrice = !isFalsyExceptZero(
					associatedAddOns[add.Id]?.recurring
				)
					? associatedAddOns[add.Id]?.recurring
					: add.cspmb__Recurring_Charge__c
				let negotiatedValue = applyDiscountRate(
					prevNegotiatedPrice,
					this.state.discountMode,
					add.cspmb__Recurring_Charge__c
				);
				const recurringDiscountSet = getDiscountSet(add, add.cspmb__Recurring_Charge__c, 'recurring');
				let ignoreHook = false;

				if (recurringDiscountSet.size) {
					if (
						!recurringDiscountSet.has(negotiatedValue) &&
						negotiatedValue !== add.cspmb__Recurring_Charge__c
					) {
						negotiatedValue = addOn[add.Id].recurring;
						showNegotiationSkippedAlert = true;
					}
				}

				if (negotiatedValue === addOn[add.Id].recurring) {
					ignoreHook = true;
				} else {
					appliedDiscountsCount++;
					addOn[add.Id].recurring = negotiatedValue;
				}

				if (!ignoreHook) {
					eventHookData = frameHookStandAloneAddonData(
						eventHookData,
						this.state.updatedAttachment,
						add,
						"recurring",
						negotiatedValue
					);
				}
			}

			if (
				this.state.applyOneOff &&
				add.hasOwnProperty('cspmb__One_Off_Charge__c') &&
				isDiscountAllowed('oneOff', add)
			) {
				const prevNegotiatedPrice = !isFalsyExceptZero(
					associatedAddOns[add.Id]?.oneOff
				)
					? associatedAddOns[add.Id]?.oneOff
					: add.cspmb__One_Off_Charge__c
				const oneOffDiscountSet = getDiscountSet(add, add.cspmb__One_Off_Charge__c, 'oneOff');
				let ignoreHook = false;
				let negotiatedValue = applyDiscountRate(
					prevNegotiatedPrice,
					this.state.discountMode,
					add.cspmb__One_Off_Charge__c
				);

				if (oneOffDiscountSet.size) {
					if (
						!oneOffDiscountSet.has(negotiatedValue) &&
						negotiatedValue !== add.cspmb__One_Off_Charge__c
					) {
						negotiatedValue = addOn[add.Id].oneOff;
						showNegotiationSkippedAlert = true;
					}
				}

				if (negotiatedValue === addOn[add.Id].oneOff) {
					ignoreHook = true;
				} else {
					appliedDiscountsCount++;
					addOn[add.Id].oneOff = negotiatedValue;
				}

				if (!ignoreHook) {
					eventHookData = frameHookStandAloneAddonData(
						eventHookData,
						this.state.updatedAttachment,
						add,
						"oneOff",
						negotiatedValue
					);
				}
			}

			attachment = { ...attachment, ...addOn };
		});

		this._setState({ attachment, actionTaken: true }, () => {
			if (appliedDiscountsCount) {
				this.props.createToast(
					'info',
					window.SF.labels.toast_discount_calculated_title,
					window.SF.labels.toast_discount_calculated
				);
			}
		});

		if (showNegotiationSkippedAlert) {
			this.props.createToast(
				'warning',
				'Some Discounts not applied',
				'Some set values could not be applied to all items due to discount level constraints'
			);
		}
	}

	render() {
		return (
			<Modal
				classNames={{
					overlay: 'overlay',
					modal: 'modal fa-modal',
					closeButton: 'close-button'
				}}
				closeIconSvgPath={
					<path d="M14.3 11.7l6-6c.3-.3.3-.7 0-1l-.9-1c-.3-.2-.7-.2-1 0l-6 6.1c-.2.2-.5.2-.7 0l-6-6.1c-.3-.3-.7-.3-1 0l-1 1c-.2.2-.2.7 0 .9l6.1 6.1c.2.2.2.4 0 .6l-6.1 6.1c-.3.3-.3.7 0 1l1 1c.2.2.7.2.9 0l6.1-6.1c.2-.2.4-.2.6 0l6.1 6.1c.2.2.7.2.9 0l1-1c.3-.3.3-.7 0-1l-6-6c-.2-.2-.2-.5 0-.7z" />
				}
				open={this.props.open}
				onClose={this.onCloseModal}
			>
				<div className="fa-modal-header">
					<button className="close-modal-button" onClick={this.onCloseModal}>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 52 52">
							<path
								fill="#fff"
								d="m31 25.4l13-13.1c0.6-0.6 0.6-1.5 0-2.1l-2-2.1c-0.6-0.6-1.5-0.6-2.1 0l-13.1 13.1c-0.4 0.4-1 0.4-1.4 0l-13.1-13.2c-0.6-0.6-1.5-0.6-2.1 0l-2.1 2.1c-0.6 0.6-0.6 1.5 0 2.1l13.1 13.1c0.4 0.4 0.4 1 0 1.4l-13.2 13.2c-0.6 0.6-0.6 1.5 0 2.1l2.1 2.1c0.6 0.6 1.5 0.6 2.1 0l13.1-13.1c0.4-0.4 1-0.4 1.4 0l13.1 13.1c0.6 0.6 1.5 0.6 2.1 0l2.1-2.1c0.6-0.6 0.6-1.5 0-2.1l-13-13.1c-0.4-0.4-0.4-1 0-1.4z"
							/>
						</svg>
					</button>
					<h2 className="fa-modal-header-title">{window.SF.labels.modal_bulk_title}</h2>
				</div>
				<div className="negotiation-modal negotiation-addon fa-modal-body">
					<div className="fa-modal-products-container">
						<div className="fa-modal-product-title">
							{this.props.addons.length} {window.SF.labels.modal_bulk_addons_selected_title}
						</div>
					</div>

					<div className="fa-modal-action-container fa-modal-addons-bulk">
						<div className="discount-wrap">
							<div className="fa-modal-discount-item">
								<h4 className="fa-modal-discount-title">
									{window.SF.labels.modal_bulk_discount_title}
								</h4>
								<div className="fa-button-group">
									<button
										className={
											'fa-button fa-button--' +
											(this.state.discountMode === 'percentage' ? 'brand' : 'default')
										}
										onClick={() => {
											this._setState({ discountMode: 'percentage' });
										}}
									>
										{window.SF.labels.modal_bulk_btn_percentage}
									</button>
									<button
										className={
											'fa-button fa-button--' +
											(this.state.discountMode === 'fixed' ? 'brand' : 'default')
										}
										onClick={() => {
											this._setState({ discountMode: 'fixed' });
										}}
									>
										{window.SF.labels.modal_bulk_btn_fixed}
									</button>
								</div>
							</div>
							<div className="fa-modal-discount-item">
								<h4 className="fa-modal-discount-title">{window.SF.labels.famext_discount_type}</h4>
								<div className="fa-button-group">
									<button
										className={
											'fa-button fa-button--' + (this.state.applyOneOff ? 'brand' : 'default')
										}
										onClick={() => {
											this._setState({ applyOneOff: !this.state.applyOneOff });
										}}
									>
										{window.SF.labels.addons_header_oneOff}
									</button>
									<button
										className={
											'fa-button fa-button--' + (this.state.applyRecurring ? 'brand' : 'default')
										}
										onClick={() => {
											this._setState({ applyRecurring: !this.state.applyRecurring });
										}}
									>
										{window.SF.labels.addons_header_recc}
									</button>
								</div>
							</div>
						</div>

						<div className="discount-wrap fa-discount-action">
							<div className="fa-modal-discount-item">
								<h4 className="fa-modal-discount-title">
									{window.SF.labels.modal_bulk_discount_input_title}
								</h4>
								<DiscountInput
									value={this.state.discount}
									mode={this.state.discountMode}
									onChange={value => this._setState({ discount: +value })}
								/>
							</div>
							<div className="fa-modal-discount-item">
								<h4 className="fa-modal-discount-title">&#8203;</h4>
								<button
									disabled={!(this.state.applyRecurring || this.state.applyOneOff)}
									className="fa-button fa-button--brand"
									onClick={() => this.applyDiscount(BulkNegotiationAction.APPLY_NEGOTIATION_ACTION)}
								>
									{window.SF.labels.modal_bulk_btn_apply}
								</button>
							</div>
							<div className="fa-modal-discount-item">
								<h4 className="fa-modal-discount-title">&#8203;</h4>
								<button
									disabled={
										!(
											this.state.applyRecurring ||
											this.state.applyOneOff
										)
									}
									className="fa-button fa-button--brand"
									onClick={() =>
										this.applyDiscount(
											BulkNegotiationAction.RESET_NEGOTIATION_ACTION
										)
									}
								>
									{"Reset Negotiations"}
								</button>
							</div>
						</div>
					</div>
				</div>

				<div className="fa-modal-footer">
					<button
						disabled={!this.state.actionTaken}
						className="fa-button fa-button--default"
						onClick={() => {
							this.props.onNegotiate(this.state.attachment, this.eventHookData);
						}}
					>
						{window.SF.labels.modal_bulk_btn_save}
					</button>
				</div>
			</Modal>
		);
	}
}

const mapStateToProps = state => {
	return {
		commercialProducts: state.commercialProducts,
		validation: state.validation,
		settings: state.settings
	};
};

const mapDispatchToProps = {
	createToast
};

export default connect(mapStateToProps, mapDispatchToProps)(NegotiationStandaloneModal);

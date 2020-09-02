import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Modal from 'react-responsive-modal';
import Icon from '../utillity/Icon';
import InputSearch from '../utillity/inputs/InputSearch';
import Toggle from '../utillity/inputs/Toggle';
import Checkbox from '../utillity/inputs/Checkbox';
import Pagination from '../utillity/Pagination';
import NumberFormat from '~/src/components/negotiation/NumberFormat';
import Render from '../utillity/Render';
import { isOneOff, isRecurring } from '../../utils/shared-service';

import {
	validateAddons,
	validateCharges,
	validateRateCardLines
} from '../../utils/validation-service';

import { createToast } from '~/src/actions';

const ADDON_VALUE_FIELD = 'cspmb__Recurring_Charge__c';
const RATE_VALUE_FIELD = 'cspmb__rate_value__c';

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
			actionTaken: false,
			pagination: {
				page_addons: 1,
				pageSize: 10
			}
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

	applyDiscount() {
		const _DISCOUNT = +this.state.discount * -1;

		function applyDiscountRate(val, discountMode) {
			val = +val;
			if (discountMode === 'fixed') {
				val = val + _DISCOUNT;
			} else {
				var discountSum = (val * Math.abs(_DISCOUNT)) / 100;

				if (_DISCOUNT >= 0) {
					val = val + discountSum;
				} else {
					val = val - discountSum;
				}
			}

			return +val.toFixed(8);
		}

		let attachment = this.state.attachment;

		this.props.addons.forEach(add => {
			// Ignore DL
			let _dl = [];
			if (add.hasOwnProperty('_discountLvIds')) {
				try {
					_dl = add._discountLvIds.map(dlv => dlv.discountLevel);
				} catch(e){
					console.warn(e);
				}
			}

			if (this.state.applyRecurring && add.hasOwnProperty('cspmb__Recurring_Charge__c')) {
				// If there aren't any RC DLs
				if (!_dl.some(dl => isRecurring(dl.cspmb__Charge_Type__c))) {
					attachment[add.Id].recurring = applyDiscountRate(
						attachment[add.Id].recurring,
						this.state.discountMode
					);
				}
			}

			if (this.state.applyOneOff && add.hasOwnProperty('cspmb__One_Off_Charge__c')) {
				// If there aren't any NRC DLs
				if (!_dl.some(dl => isOneOff(dl.cspmb__Charge_Type__c))) {
					attachment[add.Id].oneOff = applyDiscountRate(
						attachment[add.Id].oneOff,
						this.state.discountMode
					);
				}
			}
		});

		this._setState({ attachment, actionTaken: true }, () => {
			this.props.createToast(
				'info',
				window.SF.labels.toast_discount_calculated_title,
				window.SF.labels.toast_discount_calculated
			);
			console.log(this.state.attachment);
		});
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

						<div className="discount-wrap">
							<div className="fa-modal-discount-item">
								<h4 className="fa-modal-discount-title">
									{window.SF.labels.modal_bulk_discount_input_title}
								</h4>
								<input
									type="number"
									min={0}
									name=""
									className="fa-input"
									onChange={e => this._setState({ discount: +e.target.value })}
									placeholder={window.SF.labels.modal_bulk_input_placeholder}
								/>
							</div>
							<div className="fa-modal-discount-item">
								<h4 className="fa-modal-discount-title">&#8203;</h4>
								<button
									disabled={!(this.state.applyRecurring || this.state.applyOneOff)}
									className="fa-button fa-button--brand"
									onClick={this.applyDiscount}
								>
									{window.SF.labels.modal_bulk_btn_apply}
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
							this.props.onNegotiate(this.state.attachment);
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

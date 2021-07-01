import React, { Component } from 'react';
import { connect } from 'react-redux';

import ExpandableArticle from '../utillity/ExpandableArticle';

import Tabs from '../utillity/tabs/Tabs';
import Tab from '../utillity/tabs/Tab';

import Checkbox from '../utillity/inputs/Checkbox';

import SettingsContext from '~/src/utils/settings-context.js';

import { publish } from '~/src/api';

import { setValidation, setFrameAgreementState, negotiateOffers, toggleModals } from '~/src/actions';
import ProductRow from '../utillity/ProductRow';
import PLMProductCharges from './PLMProductCharges';
import Icon from '../utillity/Icon';

export class FaOffer extends React.Component {
	constructor(props) {
		super(props);

		this.onExpand = this.onExpand.bind(this);
		this.onClickEditFaOffer = this.onClickEditFaOffer.bind(this);

		this.faOfferId = this.props.faOffer.Id;
		this.validation = this.props.validationOffersInfo || {};
		this.state = {
			loading: false,
			open: false
		};
	}

	onExpand(e) {
		this.setState({ open: !this.state.open});
		e.stopPropagation();
	}

	onClickEditFaOffer() {
		this.props.onEditFaOffer(this.faOfferId);
		this.props.toggleModals({
			createOffersModal: true
		});
	}


	render() {

		let _editable = window.FAM.api.isAgreementEditable(this.props.faId);

		let _productIgnored = _productIgnored;

		return (
			<SettingsContext.Provider value={this.props.settings}>
				<div
					className={
						'product-card__container' +
						(this.state.open ? ' product-open' : '') +
						(this.props.validationFaOffers.has(this.faOfferId) ? ' invalid-product' : '')
					}
				>
					<div className="container__header">
						<div className="container__checkbox">
							<Checkbox
								disabled={!_editable}
								value={this.props.selected}
								onChange={() => {
									this.props.onSelect(this.props.faOffer);
								}}
							/>
						</div>
						<div className="container__checkbox fa-icon" onClick={this.onClickEditFaOffer}>
							<Icon name="edit" height="14" width="14" color="#0070d2" />
						</div>
						<div className="container__fields">
							<div className="fields__item fields__item--title" onClick={this.onExpand}>
								{this.props.validationFaOffers.has(this.faOfferId)?
								(<React.Fragment>
									<Icon name="warning" height="18" width="18" color="#D9675D"></Icon> { }
								</React.Fragment>):null}
								{this.props.faOffer.Name}
							</div>
							{this.props.productFields
								.filter(f => f.visible)
								.map((offerField, index) => {
									let _field;
									if (!(offerField.volume)) {
										_field = (
											<div
												className="fields__item"
												onClick={this.onExpand}
												key={'facp-' + this.props.faOffer.Id + '-' + offerField + index}
											>
												<ProductRow
													product={this.props.faOffer}
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
							{this.props.faOffer.cspmb__Price_Item_Description__c && (
								<div className="commercial-product-description">
									<ExpandableArticle>
										{this.props.faOffer.cspmb__Price_Item_Description__c}
									</ExpandableArticle>
								</div>
							)}
							<Tabs initial={0}>
								<Tab
									label={window.SF.labels.products_charges}
								>
									<PLMProductCharges
										product={this.props.faOffer}
									/>
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
		disableFrameAgreementOperations: state.disableFrameAgreementOperations,
		validationFaOffers: state.validationFaOffers
	};
};

const mapDispatchToProps = {
	setValidation,
	setFrameAgreementState,
	negotiateOffers,
	toggleModals
};

export default connect(mapStateToProps, mapDispatchToProps)(FaOffer);

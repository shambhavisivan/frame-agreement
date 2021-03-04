import React, { Component } from "react";
import { connect } from "react-redux";

import Icon from "../utillity/Icon";
import Pagination from "../utillity/Pagination";
import InputSearch from "../utillity/inputs/InputSearch";
import DropdownCheckbox from "../utillity/inputs/DropdownCheckbox";
import Checkbox from "../utillity/inputs/Checkbox";
import Offer from "../negotiation/Offer";

import {
	truncateCPField,
	getFieldLabel,
	log,
	isMaster,
	evaluateExpressionOnAgreement,
} from "../../utils/shared-service";
import { toggleFieldVisibility, getOffers } from "~/src/actions";

import AddProductCTA from "./AddProductCTA";

class OffersTab extends React.Component {
	constructor(props) {
		super(props);

		this.getOffersCount = this.getOffersCount.bind(this);

		this.state = {
			offerFilter: "",
			page: 1,
			pageSize: 10,
		};

		this._offerFilter = cp => {
			if (this.state.offerFilter && this.state.offerFilter.length >= 2) {
				return cp.Name.toLowerCase().includes(
					this.state.offerFilter.toLowerCase()
				);
			} else {
				return true;
			}
		};
	}

	componentDidMount() {
		if (!this.props.offersLoaded) {
			this.props.getOffers();
		}
	}

	getOffersCount() {
		let offersSize = this.props.frameAgreements[this.props.faId]._ui.offers
			.length;
		if (this.state.offerFilter) {
			offersSize = this.props.frameAgreements[
				this.props.faId
			]._ui.commercialProducts.filter(cp => {
				if (
					this.state.offerFilter &&
					this.state.offerFilter.length >= 2
				) {
					return cp.Name.toLowerCase().includes(
						this.state.offerFilter.toLowerCase()
					);
				} else {
					return true;
				}
			}).length;
		}
		return offersSize;
	}

	render() {
		let commercialProducts;

		let _offers = this.props.frameAgreements[this.props.faId]._ui.offers;
		let _editable = window.FAM.api.isAgreementEditable(this.props.faId);

		let _isMaster = isMaster(this.props.frameAgreements[this.props.faId]);
		let standardData = this.props.settings.ButtonStandardData;

		let _isAddProductsEnabled =
			!_isMaster &&
			evaluateExpressionOnAgreement(
				standardData.AddProducts,
				this.props.frameAgreements[this.props.faId]
			);

		if (_offers.length) {
			commercialProducts = (
				<div className="products-card__inner">
					<div className="products-card__header">
						<span className="products__title">
							{window.SF.labels.offers_title} (
							{
								this.props.frameAgreements[this.props.faId]._ui
									.offers.length
							}
							)
						</span>
						<div className="header__inputs">
							<InputSearch
								value={this.state.offerFilter}
								bordered={true}
								onChange={val => {
									this.setState({ productFilter: val });
								}}
								placeholder={
									window.SF.labels
										.input_quickSearchPlaceholder
								}
							/>
							{this.props.productFields.length ? (
								<DropdownCheckbox
									object="cspmb__Price_Item__c"
									options={this.props.productFields}
									onChange={this.props.toggleFieldVisibility}
								/>
							) : null}
						</div>
					</div>
					<div className="product-card__container commercial-product-container-bare product-card__container--header">
						<div className="container__header">
							<div className="container__checkbox">
								<Checkbox
									className="fa-margin-right-sm"
									value={
										this.props.frameAgreements[
											this.props.faId
										]._ui.offers.filter(this._offerFilter)
											.length ===
											Object.keys(
												this.props.selectedOffers
											).length &&
										!!Object.keys(this.props.selectedOffers)
											.length
									}
									onChange={() => {
										this.props.onSelectAllOffers(
											this.props.frameAgreements[
												this.props.faId
											]._ui.offers.filter(
												this._offerFilter
											)
										);
									}}
								/>
							</div>
							<div className="container__fields">
								<span className="list-cell">
									{getFieldLabel(
										"cspmb__Price_Item__c",
										"name"
									)}
								</span>
								{this.props.productFields
									.filter(f => f.visible)
									.map(f => {
										return (
											<span
												key={"header-" + f.name}
												className={
													"list-cell" +
													(f.volume ? " volume" : "")
												}
											>
												{getFieldLabel(
													"cspmb__Price_Item__c",
													f.name
												) || truncateCPField(f.name)}
											</span>
										);
									})}
							</div>
						</div>
					</div>
					{_offers
						.filter(this._offerFilter)
						.paginate(this.state.page, this.state.pageSize)
						.map(cp => {
							return (
								<Offer
									key={"of-" + cp.Id}
									offer={cp}
									faId={this.props.faId}
									onSelect={product =>
										this.props.onSelectOffer(product)
									}
									selected={
										!!this.props.selectedOffers[cp.Id]
									}
								/>
							);
						})}
					<div className="card__bottom" />
				</div>
			);
		} else {
			commercialProducts = (
				<div>
					<AddProductCTA
						render={
							!this.props.frameAgreements[this.props.faId]._ui
								.commercialProducts.length
						}
						disabled={!_editable || !_isAddProductsEnabled}
					/>
				</div>
			);
		}

		return (
			<div className="card products-card">
				{commercialProducts}

				<Pagination
					totalSize={this.getOffersCount()}
					pageSize={this.state.pageSize}
					page={this.state.page}
					onPageSizeChange={newPageSize => {
						this.setState({
							page: 1,
							pageSize: newPageSize,
						});
					}}
					onPageChange={newPage => {
						this.setState({
							page: newPage,
						});
					}}
				/>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		frameAgreements: state.frameAgreements,
		settings: state.settings,
		handlers: state.handlers,
		productFields: state.productFields,
		offersLoaded: state.initialised.of_loaded,
	};
};

const mapDispatchToProps = {
	toggleFieldVisibility,
	getOffers,
};

export default connect(mapStateToProps, mapDispatchToProps)(OffersTab);

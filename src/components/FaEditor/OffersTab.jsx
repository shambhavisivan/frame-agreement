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

import AddOfferCTA from './AddOfferCTA';

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

	async componentDidMount() {
		if (!this.props.offersLoaded) {
			await this.props.getOffers();
		}
	}

	getOffersCount() {
		let offersSize = this.props.frameAgreements[this.props.faId]._ui.offers
			.length;
		if (this.state.offerFilter) {
			offersSize = this.props.frameAgreements[
				this.props.faId
			]._ui.offers.filter(cp => {
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
		let offers;

		let _offers = this.props.frameAgreements[this.props.faId]._ui.offers;
		let _editable = window.FAM.api.isAgreementEditable(this.props.faId);

		let _isMaster = isMaster(this.props.frameAgreements[this.props.faId]);
		let standardData = this.props.settings.ButtonStandardData;

		let _isAddOffersEnabled =
			!_isMaster &&
			evaluateExpressionOnAgreement(
				standardData.AddOffers,
				this.props.frameAgreements[this.props.faId]
			) &&
			this.props.offersLoaded;

		if (_offers.length) {
			offers = (
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
									this.setState({ offerFilter: val });
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
						.map(offer => {
							return (
								<Offer
									key={"of-" + offer.Id}
									offer={offer}
									faId={this.props.faId}
									onSelect={offer =>
										this.props.onSelectOffer(offer)
									}
									selected={
										!!this.props.selectedOffers[offer.Id]
									}
								/>
							);
						})}
					<div className="card__bottom" />
				</div>
			);
		} else {
			offers = (
				<div>
					<AddOfferCTA
						render={
							!this.props.frameAgreements[this.props.faId]._ui
								.offers.length
						}
						disabled={!_editable || !_isAddOffersEnabled}
					/>
				</div>
			);
		}

		return (
			<div className="card products-card">
				{offers}

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

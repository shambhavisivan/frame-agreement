import React, { Component } from "react";
import { connect } from "react-redux";

import Pagination from "../utillity/Pagination";
import InputSearch from "../utillity/inputs/InputSearch";
import DropdownCheckbox from "../utillity/inputs/DropdownCheckbox";
import Checkbox from "../utillity/inputs/Checkbox";

import {
	truncateCPField,
	getFieldLabel,
	isMaster,
	evaluateExpressionOnAgreement,
} from "../../utils/shared-service";
import { toggleFieldVisibility, toggleModals } from "~/src/actions";

import FaOffer from "../negotiation/FaOffer";
import CreateFaOfferCTA from "./CreateFaOfferCTA";

class FaOffersTab extends Component {
	constructor(props) {
		super(props);

		this.getFaOffersCount = this.getFaOffersCount.bind(this);

		this.state = {
			faOfferFilter: "",
			page: 1,
			pageSize: 10,
		};

		this._faOfferFilter = faOffer => {
			if (this.state.faOfferFilter && this.state.faOfferFilter.length >= 2) {
				return faOffer.Name.toLowerCase().includes(
					this.state.faOfferFilter.toLowerCase()
				);
			} else {
				return true;
			}
		};
	}

	getFaOffersCount() {
		let faOffersSize = this.props.frameAgreements[this.props.faId]._ui.faOffers
			.size;
		if (this.state.faOfferFilter) {
			faOffersSize = Array.from(this.props.frameAgreements[
				this.props.faId
			]._ui.faOffers.values()).filter(cp => {
				if (
					this.state.faOfferFilter &&
					this.state.faOfferFilter.length >= 2
				) {
					return cp.Name.toLowerCase().includes(
						this.state.faOfferFilter.toLowerCase()
					);
				} else {
					return true;
				}
			}).length;
		}
		return faOffersSize;
	}

	render() {
		let faOffers;

		const _faOffers = Array.from(this.props.frameAgreements[this.props.faId]._ui.faOffers.values());
		const _editable = window.FAM.api.isAgreementEditable(this.props.faId);

		const _isMaster = isMaster(this.props.frameAgreements[this.props.faId]);
		const standardData = this.props.settings.ButtonStandardData;

		const _isCreateOffersEnabled =
			!_isMaster &&
			evaluateExpressionOnAgreement(
				standardData.CreateOffers,
				this.props.frameAgreements[this.props.faId]
			) &&
			this.props.cpsLoaded;

		if (_faOffers?.length) {
			faOffers = (
				<div className="products-card__inner">
					<div className="products-card__header">
						<span className="products__title">
							{window.SF.labels.fa_offers_title} (
							{
								this.props.frameAgreements[this.props.faId]._ui
									.faOffers.size
							}
							)
						</span>
						<div className="header__inputs">
							<InputSearch
								value={this.state.faOfferFilter}
								bordered={true}
								onChange={val => {
									this.setState({ faOfferFilter: val });
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
										Array.from(this.props.frameAgreements[
											this.props.faId
										]._ui.faOffers.values()).filter(this._faOfferFilter)
											.length ===
											Object.keys(
												this.props.selectedOffers
											).length &&
										!!Object.keys(this.props.selectedOffers)
											.length
									}
									onChange={() => {
										this.props.onSelectAllOffers(
											Array.from(this.props.frameAgreements[
												this.props.faId
											]._ui.faOffers.values()).filter(
												this._faOfferFilter
											)
										);
									}}
								/>
							</div>
							<div className="container__checkbox"></div>
							<div className="container__fields">
								<span className="list-cell">
									{getFieldLabel(
										"cspmb__Price_Item__c",
										"name"
									)}
								</span>
								{this.props.productFields
									.filter(f => f.visible && !f.volume)
									.map(f => {
										return (
											<span
												key={"header-" + f.name}
												className={
													"list-cell"
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
					{_faOffers
						.filter(this._faOfferFilter)
						.paginate(this.state.page, this.state.pageSize)
						.map(faOffer => {
							return (
								<FaOffer
									key={"of-" + faOffer.Id}
									faOffer={faOffer}
									faId={this.props.faId}
									onSelect={offer =>
										this.props.onSelectOffer(offer)
									}
									selected={
										!!this.props.selectedOffers[faOffer.Id]
									}
									onEditFaOffer={this.props.onEditFaOffer}
								/>
							);
						})}
					<div className="card__bottom" />
				</div>
			);
		} else {
			faOffers = (
				<div>
					<CreateFaOfferCTA
						render={
							!this.props.frameAgreements[this.props.faId]._ui
								.faOffers.size
						}
						disabled={!_editable || !_isCreateOffersEnabled}
					/>
				</div>
			);
		}

		return (
			<div className="card products-card">
				{faOffers}

				<Pagination
					totalSize={this.getFaOffersCount()}
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
		cpsLoaded: state.initialised.cp_loaded,
	};
};

const mapDispatchToProps = {
	toggleFieldVisibility,
	toggleModals
};

export default connect(mapStateToProps, mapDispatchToProps)(FaOffersTab);

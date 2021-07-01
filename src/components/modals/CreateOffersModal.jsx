import React, { Component } from "react";
import { connect } from "react-redux";

import Modal from "react-responsive-modal";

import Icon from "../utillity/Icon";
import InputSearch from "../utillity/inputs/InputSearch";
import Pagination from "../utillity/Pagination";
import { truncateCPField, getFieldLabel } from "../../utils/shared-service";
import {
	queryCategoriesInCatalogue,
	queryProductsInCategory,
} from "~/src/graphql-actions";
import ProductRow from "../utillity/ProductRow";
import {
	createFaOffer,
	saveFrameAgreement,
	addFaOffersToFa,
} from "~/src/actions";

class CreateOffersModal extends Component {
	constructor(props) {
		super(props);
		this.togglePanel = this.togglePanel.bind(this);
		this.onCloseModal = this.onCloseModal.bind(this);
		this.addProducts = this.addProducts.bind(this);
		this.loadCommercialProducts = this.loadCommercialProducts.bind(this);
		this.resetFilter = this.resetFilter.bind(this);
		this.initiatePLM = this.initiatePLM.bind(this);
		this.renderModalHeader = this.renderModalHeader.bind(this);

		this.categoryId = null;

		this._commercialProducts = this.props.commercialProducts;

		if (this.props.cpFilter) {
			this._commercialProducts = this.props.commercialProducts.filter(
				(cp) => this.props.cpFilter.has(cp.Id)
			);
		}

		this.state = {
			searchValue: "",
			panel: false,
			expanded: false,
			actionTaken: false,
			filter: [],
			productFilter: "",
			selected: "",
			commercialProducts: this._commercialProducts,
			faOfferId: "",
			navigateToPLM: false,
			pagination: {
				page: 1,
				pageSize: 10,
			},
		};

		this.priceItemFields = this.props.productFields.filter(
			(f) => !f.volume
		);
		console.warn(this.priceItemFields);
	}

	async componentDidMount() {
		if (this.props.faOfferId) {
			this.setState({ faOfferId: this.props.faOfferId });
			this.initiatePLM(this.props.faOfferId);
		} else {
			const categoriesInCatalogue = await queryCategoriesInCatalogue();
			this.setState({ filter: [...categoriesInCatalogue] });
		}
	}

	async componentWillUnmount() {
		if (this.state.faOfferId) {
			await this.props.addFaOffersToFa(
				this.props.currentFrameAgreement.Id,
				new Array(this.state.faOfferId)
			);
		}
		this.setState({ faOfferId: "" });
	}

	onCloseModal() {
		this.setState({
			actionTaken: false,
			selected: "",
		});
		this.props.onCloseModal();
	}

	togglePanel() {
		this.setState((prevState) => ({
			panel: !prevState.panel,
		}));
	}

	async loadCommercialProducts(categoryId) {
		// filter cps for category
		if (categoryId && this.categoryId !== categoryId) {
			this.categoryId = categoryId;
			const linkedProducts = await queryProductsInCategory(categoryId);
			const linkedProductIds = linkedProducts.map((cp) => cp.id);
			// refetch cps from apex for the linked products.
			const commercialProducts = await window.SF.invokeAction(
				"getCommercialProducts",
				[linkedProductIds]
			);
			this.setState({ commercialProducts: commercialProducts });
		}
	}

	getCommercialProductsCount() {
		let cpSize = this.state.commercialProducts.length;

		if (this.state.productFilter) {
			cpSize = this.state.commercialProducts.filter((cp) => {
				if (
					this.state.productFilter &&
					this.state.productFilter.length >= 2
				) {
					return cp.Name.toLowerCase().includes(
						this.state.productFilter.toLowerCase()
					);
				} else {
					return true;
				}
			}).length;
		}
		return cpSize;
	}

	toggleExpanded() {
		this.setState({ expanded: !this.state.expanded });
	}

	selectProduct(product) {
		let selectedPdt = product.Id;
		if (selectedPdt === this.state.selected) {
			selectedPdt = "";
		}

		this.setState(
			{
				selected: selectedPdt,
			},
			() => {
				this.setState({
					actionTaken: true,
				});
			}
		);
	}

	async addProducts() {
		const newOffer = await this.props.createFaOffer(
			this.props.currentFrameAgreement,
			this.state.selected
		);
		if (newOffer.Id) {
			this.setState({ faOfferId: newOffer.Id });
			this.initiatePLM(newOffer.Id);
		} else {
			window.FAM.api.toast("error", window.SF.labels.offers_creation_error, "", 2000);
		}
	}

	resetFilter() {
		this.setState({ commercialProducts: this._commercialProducts });
	}

	initiatePLM(offerId) {
		const plmOfferId = {
			pageReference: {
				state: {
					csplm__offer_id: offerId,
				},
			},
		};
		this.setState({ navigateToPLM: true }, () => {
			$Lightning.use("c:PLMApp", function () {
				$Lightning.createComponent(
					"csplm:PlmView",
					plmOfferId,
					"PLMComponent",
					function (cmp) {}
				);
			});
		});
	}

	renderModalHeader() {
		return (
			<div className="fa-modal-header">
				<button
					className="close-modal-button"
					onClick={this.onCloseModal}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 52 52"
					>
						<path
							fill="#fff"
							d="m31 25.4l13-13.1c0.6-0.6 0.6-1.5 0-2.1l-2-2.1c-0.6-0.6-1.5-0.6-2.1 0l-13.1 13.1c-0.4 0.4-1 0.4-1.4 0l-13.1-13.2c-0.6-0.6-1.5-0.6-2.1 0l-2.1 2.1c-0.6 0.6-0.6 1.5 0 2.1l13.1 13.1c0.4 0.4 0.4 1 0 1.4l-13.2 13.2c-0.6 0.6-0.6 1.5 0 2.1l2.1 2.1c0.6 0.6 1.5 0.6 2.1 0l13.1-13.1c0.4-0.4 1-0.4 1.4 0l13.1 13.1c0.6 0.6 1.5 0.6 2.1 0l2.1-2.1c0.6-0.6 0.6-1.5 0-2.1l-13-13.1c-0.4-0.4-0.4-1 0-1.4z"
						/>
					</svg>
				</button>
				<span
					className="fa-modal-expand"
					onClick={() => {
						this.toggleExpanded();
					}}
				>
					<Icon
						name="expand_alt"
						width="24"
						height="24"
						color="white"
					/>
				</span>
				<h2 className="fa-modal-header-title">
					{window.SF.labels.modal_createOffers_title}
				</h2>
			</div>
		);
	}

	render() {
		return (
			<Modal
				classNames={{
					overlay: "overlay",
					modal:
						"modal fa-modal" +
						(this.state.expanded ? " expanded" : ""),
					closeButton: "close-button",
				}}
				closeIconSvgPath={
					<path d="M14.3 11.7l6-6c.3-.3.3-.7 0-1l-.9-1c-.3-.2-.7-.2-1 0l-6 6.1c-.2.2-.5.2-.7 0l-6-6.1c-.3-.3-.7-.3-1 0l-1 1c-.2.2-.2.7 0 .9l6.1 6.1c.2.2.2.4 0 .6l-6.1 6.1c-.3.3-.3.7 0 1l1 1c.2.2.7.2.9 0l6.1-6.1c.2-.2.4-.2.6 0l6.1 6.1c.2.2.7.2.9 0l1-1c.3-.3.3-.7 0-1l-6-6c-.2-.2-.2-.5 0-.7z" />
				}
				closeIconSize={48}
				open={this.props.open}
				onClose={this.onCloseModal}
				center
			>
				{this.state.navigateToPLM ? (
					<React.Fragment>
						{this.renderModalHeader()}
						<div
							className={
								"fa-product-modal fa-modal-body " +
								(this.state.panel
									? "panel-open"
									: "panel-closed")
							}
						>
							<div
								id="PLMComponent"
								style={{ minHeight: "150px" }}
							></div>
						</div>
					</React.Fragment>
				) : (
					<React.Fragment>
						{this.renderModalHeader()}
						<div
							className={
								"fa-product-modal fa-modal-body " +
								(this.state.panel
									? "panel-open"
									: "panel-closed")
							}
						>
							<div className="fa-modal-panel">
								<div className="panel-navigation">
									<div
										className="panel-navigation--close"
										onClick={this.togglePanel}
									>
										<Icon
											name="close"
											width="12"
											height="12"
											color="#0070d2"
										/>
										<span>
											{window.SF.labels.btn_Close}
										</span>
									</div>
									<div>
										<div className="fa-modal-product-list-header">
											<div className="header-th">
												<span>
													{
														window.SF.labels
															.modal_categorization_title
													}
												</span>
											</div>
										</div>
										<div className="fa-modal-product-list">
											<ul>
												{this.state.filter.length ? (
													this.state.filter.map(
														(category) => {
															return (
																<div className="fa-modal-product-list-categories">
																	<li
																		key={
																			category.id
																		}
																		onClick={async () =>
																			await this.loadCommercialProducts(
																				category.id
																			)
																		}
																	>
																		<span>
																			{
																				category.name
																			}
																		</span>
																	</li>
																</div>
															);
														}
													)
												) : (
													<div>
														<p>
															{
																window.SF.labels
																	.warning_no_commercial_products_linked
															}
														</p>
													</div>
												)}
											</ul>
										</div>
									</div>
								</div>
								<div className="fa-modal-button-group">
									<button
										onClick={this.resetFilter}
										className="fa-button fa-button--default"
									>
										{
											window.SF.labels
												.modal_categorization_btn_clear
										}
									</button>
								</div>
							</div>

							<div className="fa-modal-table-container">
								<div className="fa-modal-navigation">
									{!this.state.panel ? (
										<div
											className="fa-flex fa-flex-middle"
											onClick={this.togglePanel}
										>
											<div className="fa-modal-categorization-switch">
												<Icon
													name="color_swatch"
													width="14"
													height="14"
													color="#0070d2"
												/>
												<div className="fa-modal-categorization-switch-link">
													{
														window.SF.labels
															.modal_categorization_switch
													}
												</div>
											</div>
										</div>
									) : (
										""
									)}

									<div className="search-container">
										<InputSearch
											placeholder={
												window.SF.labels
													.modal_addProduct_input_search_placeholder
											}
											value={this.state.searchValue}
											onChange={(val) => {
												this.setState({
													productFilter: val,
												});
											}}
										/>
									</div>
								</div>

								<div>
									<div className="fa-modal-product-list-header">
										<div className="header-th">
											{getFieldLabel(
												"cspmb__Price_Item__c",
												"name"
											)}
										</div>
										{this.priceItemFields.map((f) => {
											return (
												<div
													key={f.name}
													className="header-th"
												>
													<span>
														{getFieldLabel(
															"cspmb__Price_Item__c",
															f.name
														) ||
															truncateCPField(
																f.name
															)}
													</span>
												</div>
											);
										})}
									</div>
									<div className="fa-modal-product-list">
										{this.state.commercialProducts
											.filter((cp) => {
												if (
													this.state.productFilter &&
													this.state.productFilter
														.length >= 2
												) {
													return cp.Name.toLowerCase().includes(
														this.state.productFilter.toLowerCase()
													);
												} else {
													return true;
												}
											})
											.paginate(
												this.state.pagination.page,
												this.state.pagination.pageSize
											)
											.map((cp) => {
												return (
													<div
														key={cp.Id}
														className={
															"product-row" +
															(this.state
																.selected ===
															cp.Id
																? " selected"
																: "")
														}
														onClick={() =>
															this.selectProduct(
																cp
															)
														}
													>
														<span>{cp.Name}</span>
														{this.priceItemFields.map(
															(field) => {
																return (
																	<span
																		key={
																			cp.Id +
																			"-" +
																			field.name
																		}
																	>
																		<ProductRow
																			product={
																				cp
																			}
																			fieldName={
																				field.name
																			}
																		/>
																	</span>
																);
															}
														)}
													</div>
												);
											})}
									</div>
								</div>

								<div className="modal-pagination" />
							</div>
						</div>
						<div className="fa-modal-footer">
							<Pagination
								totalSize={this.getCommercialProductsCount()}
								pageSize={this.state.pagination.pageSize}
								page={this.state.pagination.page}
								onPageSizeChange={(newPageSize) => {
									this.setState({
										pagination: {
											...this.state.pagination,
											pageSize: newPageSize,
											page: 1,
										},
									});
								}}
								onPageChange={(newPage) => {
									this.setState({
										pagination: {
											...this.state.pagination,
											page: newPage,
										},
									});
								}}
							/>

							<button
								onClick={this.addProducts}
								className="fa-button fa-button--brand"
								disabled={
									!this.state.selected ||
									this.props.disableFrameAgreementOperations
								}
							>
								{window.SF.labels.btn_CreateOffers}
							</button>
						</div>
					</React.Fragment>
				)}
			</Modal>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		frameAgreements: state.frameAgreements,
		currentFrameAgreement: state.currentFrameAgreement,
		productFields: state.productFields,
		settings: state.settings,
		commercialProducts: state.commercialProducts,
		disableFrameAgreementOperations: state.disableFrameAgreementOperations,
	};
};

const mapDispatchToProps = {
	createFaOffer,
	saveFrameAgreement,
	addFaOffersToFa,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateOffersModal);

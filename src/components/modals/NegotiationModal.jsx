import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Modal from 'react-responsive-modal';
import Icon from '../utillity/Icon';
import InputSearch from '../utillity/inputs/InputSearch';
import Toggle from '../utillity/inputs/Toggle';
import Checkbox from '../utillity/inputs/Checkbox';
import Pagination from '../utillity/Pagination';

import {
	validateAddons,
	validateCharges,
	validateRateCardLines
} from '../negotiation/Validation';
import { setValidation, createToast } from '../../actions';

// import { getFrameAgreements } from '../../actions';

import './NegotiationModal.css';

const ADDON_VALUE_FIELD = 'cspmb__Recurring_Charge__c';
const RATE_VALUE_FIELD = 'cspmb__rate_value__c';

class NegotiationModal extends Component {
	constructor(props) {
		super(props);

		this.discount = React.createRef();

		this.productEllipsis = 3;

		this.onCloseModal = this.onCloseModal.bind(this);
		this.applyDiscount = this.applyDiscount.bind(this);
		this.onPropertyChange = this.onPropertyChange.bind(this);
		this.onPropertyValueChange = this.onPropertyValueChange.bind(this);

		this.commercialProductsMap = {};

		this.commercialProducts = this.props.commercialProducts.filter(product => {
			this.commercialProductsMap[product.Id] = product;
			return this.props.products.includes(product.Id);
		});

		/*********************************************************************************************************************************************************/
		this._addon_assoc = this.commercialProducts.reduce(
			(acc, val) =>
				acc.concat(
					val._addons.map(addon => {
						return { ...addon, ...{ product: val.Id } };
					})
				),
			[]
		);

		this.grouped_addons = this._addon_assoc.reduce(function(acc, level) {
			(acc[level['cspmb__Add_On_Price_Item__c']] =
				acc[level['cspmb__Add_On_Price_Item__c']] || []).push(level);
			return acc;
		}, {});
		/*********************************************************************************************************************************************************/
		this._charges = this.commercialProducts.reduce(
			(acc, val) =>
				acc.concat(
					val._charges.map(ch => {
						return { ...ch, ...{ product: val.Id } };
					})
				),
			[]
		);

		this._chCpMap = {};
		this._charges.forEach(ch => {
			this._chCpMap[ch.Id] = this._chCpMap[ch.Id] || [];
			this._chCpMap[ch.Id].push(ch.product);
		});

		(() => {
			let uniqueCheck = {};
			this._charges = this._charges.filter(ch => {
				if (!uniqueCheck[ch.Id]) {
					uniqueCheck[ch.Id] = true;
					return true;
				}
				return false;
			});
		})();

		/*********************************************************************************************************************************************************/
		// All rate card
		this._rateCards = this.commercialProducts.reduce(
			(acc, val) =>
				acc.concat(
					val._rateCards.map(rc => {
						return { ...rc, ...{ product: val.Id } };
					})
				),
			[]
		);
		// Map rc:[pid]
		this._rcCpMap = {};
		this._rateCards.forEach(rc => {
			this._rcCpMap[rc.Id] = this._rcCpMap[rc.Id] || [];
			this._rcCpMap[rc.Id].push(rc.product);
		});
		// Filter unique rate cards
		(() => {
			let uniqueCheck = {};
			this._rateCards = this._rateCards.filter(rc => {
				if (!uniqueCheck[rc.Id]) {
					uniqueCheck[rc.Id] = true;
					return true;
				}
				return false;
			});
		})();
		/*********************************************************************************************************************************************************/
		// RCL categorization
		var propertyData = {};
		if (this.props.settings.FACSettings.rcl_fields.length) {
			let rateCardLines = Object.values(this._rateCards).reduce((acc, cur) => {
				var crcl = cur.customRateCardLines || [];
				acc = [...acc, ...cur.rateCardLines, ...crcl];
				return acc;
			}, []);

			this.props.settings.FACSettings.rcl_fields.forEach(cf => {
				propertyData[cf] = {};
			});

			rateCardLines.forEach(rcl => {
				this.props.settings.FACSettings.rcl_fields.forEach(cf => {
					if (rcl[cf]) {
						propertyData[cf][rcl[cf]] = true;
					}
				});
			});

			for (var key in propertyData) {
				propertyData[key] = Object.keys(propertyData[key]);
			}
		}
		/*********************************************************************************************************************************************************/

		var attachment = {};
		try {
			attachment = { ...this.props.attachment };
			attachment = JSON.parse(JSON.stringify(this.props.attachment));
		} catch (err) {}

		this.state = {
			tab: Object.keys(this.grouped_addons).length
				? 'addons'
				: this._charges.length
				? 'charges'
				: 'rated',
			discountMode: 'percentage', // fixed
			discount: 0,
			selected: {
				addons: {},
				charges: {},
				rated: {}
			},
			validation: {
				addons: {},
				charges: {},
				rated: {}
			},
			attachment,
			count: {
				addons: 0,
				charges: 0,
				rated: 0
			},
			propertyData,
			selectedProperty: '',
			selectedPropertyValue: '',
			countTotal: 0,
			actionTaken: false,
			filter: {
				unique: false,
				intersection: false
			},
			pagination: {
				page_addons: 1,
				page_charges: 1,
				page_rated: 1,
				pageSize: 10
			}
		};
		// this.priceItemFields = [
		//   ...this.props.settings.FACSettings.price_item_fields
		// ];
		// this.priceItemFields.unshift('Name');
		// console.warn(this.priceItemFields);
		console.log('***********************************');
		console.warn(this.state.attachment);
		console.log('***********************************');
		console.warn(this._addons);
		console.warn(this._charges);
		console.warn(this._rateCards);
		console.log('***********************************');
	}

	componentWillMount() {
		// this._addons
		// this._charges
		// this._rateCards

		let charges = {};

		this.commercialProducts.forEach(cp => {
			if (cp._charges) {
				charges = {
					...charges,
					...validateCharges(
						cp._charges,
						cp.cspmb__Authorization_Level__c,
						this.props.attachment[cp.Id]._charges
					)
				};
			}
		});

		console.log(charges);

		this.setState({
			validation: {
				// addons,
				charges
				// rated
			}
		});
	}

	onCloseModal() {
		this.props.onCloseModal();
	}

	setTab(newTab) {
		this.setState({ tab: newTab });
	}

	selectAll(type) {
		console.log('ALL');
	}

	onPropertyChange(e) {
		var defaultProperty = this.state.propertyData[e.target.value]
			? this.state.propertyData[e.target.value][0]
			: '';
		this.setState({
			selectedProperty: e.target.value || null,
			selectedPropertyValue: defaultProperty
		});
	}

	onPropertyValueChange(e) {
		this.setState({ selectedPropertyValue: e.target.value || null });
	}

	onSelectRow(row, type) {
		let selected = this.state.selected;
		if (selected[type][row.Id]) {
			delete selected[type][row.Id];
		} else {
			selected[type][row.Id] = row;
		}
		this.setState(
			{
				selected: selected,
				count: {
					...this.state.count,
					[type]: Object.keys(selected[type]).length
				}
			},
			() => {
				this.setState({
					countTotal: Object.values(this.state.count).reduce(
						(a, b) => +(a + b),
						0
					)
				});
				console.log(this.state.selected);
			}
		);
	}

	onSelectAddons(addon) {
		let selected = this.state.selected;
		if (selected.addons[addon]) {
			delete selected.addons[addon];
		} else {
			selected.addons[addon] = true;
		}
		this.setState(
			{
				selected: selected,
				count: {
					...this.state.count,
					addons: Object.keys(selected.addons).length
				}
			},
			() => {
				this.setState({
					countTotal: Object.values(this.state.count).reduce(
						(a, b) => +(a + b),
						0
					)
				});
				console.log(this.state.selected);
			}
		);
	}

	applyDiscount() {
		if (!+this.discount.current.value) {
			return;
		}

		const _DISCOUNT = +this.discount.current.value * -1;
		console.log(_DISCOUNT);

		function decimalPlaces(num) {
			var match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
			if (!match) {
				return 0;
			}
			return Math.max(
				0,
				// Number of digits right of decimal point.
				(match[1] ? match[1].length : 0) -
					// Adjust for scientific notation.
					(match[2] ? +match[2] : 0)
			);
		}

		function applyDiscountRate(val, state) {
			val = +val;
			if (state.discountMode === 'fixed') {
				val = val + _DISCOUNT;
			} else {
				var discountSum = (val * Math.abs(_DISCOUNT)) / 100;

				if (_DISCOUNT >= 0) {
					val = val + discountSum;
				} else {
					val = val - discountSum;
				}
			}
			// Max 4 decimal places
			var dp = decimalPlaces(val);
			if (dp > 2) {
				dp = 2;
			}
			return +val.toFixed(dp);
		}

		let selected = { ...this.state.selected };
		let attachment = this.state.attachment;

		if (Object.keys(selected.addons).length) {
			this.commercialProducts.forEach(cp => {
				if (cp._addons) {
					cp._addons.forEach(addon => {
						if (
							selected.addons.hasOwnProperty(addon.cspmb__Add_On_Price_Item__c)
						) {
							attachment[cp.Id]._addons = attachment[cp.Id]._addons || {};
							attachment[cp.Id]._addons[addon.Id] =
								attachment[cp.Id]._addons[addon.Id] || {};

							if (addon.cspmb__One_Off_Charge__c) {
								attachment[cp.Id]._addons[addon.Id].oneOff = applyDiscountRate(
									attachment[cp.Id]._addons[addon.Id].oneOff ||
										addon.cspmb__One_Off_Charge__c,
									this.state
								);
							}
							if (addon.cspmb__Recurring_Charge__c) {
								attachment[cp.Id]._addons[
									addon.Id
								].recurring = applyDiscountRate(
									attachment[cp.Id]._addons[addon.Id].recurring ||
										addon.cspmb__Recurring_Charge__c,
									this.state
								);
							}
						}
					});
				}
			});
		}

		if (Object.keys(selected.charges).length) {
			this.commercialProducts.forEach(cp => {
				if (cp._charges) {
					cp._charges.forEach(charge => {
						if (selected.charges.hasOwnProperty(charge.Id)) {
							attachment[cp.Id]._charges = attachment[cp.Id]._charges || {};
							attachment[cp.Id]._charges[charge.Id] =
								attachment[cp.Id]._charges[charge.Id] || {};
							attachment[cp.Id]._charges[charge.Id][
								charge._type
							] = applyDiscountRate(
								attachment[cp.Id]._charges[charge.Id][charge._type] ||
									charge[charge._type],
								this.state
							);
						}
					});
				}
			});
		}

		if (Object.keys(selected.rated).length) {
			this.commercialProducts.forEach(cp => {
				if (cp._rateCards) {
					cp._rateCards.forEach(rc => {
						rc.rateCardLines.forEach(rcl => {
							if (selected.rated.hasOwnProperty(rcl.Id)) {
								attachment[cp.Id]._rateCards =
									attachment[cp.Id]._rateCards || {};
								attachment[cp.Id]._rateCards[rc.Id] =
									attachment[cp.Id]._rateCards[rc.Id] || {};
								attachment[cp.Id]._rateCards[rc.Id][rcl.Id] = applyDiscountRate(
									attachment[cp.Id]._rateCards[rc.Id][rcl.Id] ||
										rcl.cspmb__rate_value__c,
									this.state
								);
							}
						});
					});
				}
			});
		}

		this.setState({ attachment, actionTaken: true }, () => {
			this.props.createToast(
				'info',
				window.SF.labels.toast_discount_calculated_title,
				window.SF.labels.toast_discount_calculated
			);
			console.log(this.state.attachment);
		});
	}

	render() {
		let tab = {
			addons: null,
			charges: null,
			rated: null
		};

		tab.addons = (
			<div className="table-container">
				<div className="table-list-header">
					<div className="list-cell">
						<Checkbox
							onChange={() => {
								this.selectAll('addons');
							}}
						/>
						{window.SF.labels.modal_charge_table_header_name}
					</div>
					<div className="list-cell">
						{window.SF.labels.modal_charge_table_header_presentIn}
					</div>
					<div className="list-cell">
						{window.SF.labels.modal_charge_table_header_oneOff}
					</div>
					<div className="list-cell">
						{window.SF.labels.modal_charge_table_header_recurring}
					</div>
				</div>

				<ul>
					{Object.keys(this.grouped_addons)
						.paginate(
							this.state.pagination.page_addons,
							this.state.pagination.pageSize
						)
						.map(add => {
							let addons_name = this.grouped_addons[add][0].Name;
							let addons_size = this.grouped_addons[add].length;

							return (
								<li
									onClick={() => {
										this.onSelectAddons(add);
									}}
									key={add}
									className={
										'list-row' +
										(this.state.selected.addons[add] ? ' selected-row' : '')
									}
								>
									<div className="list-cell">
										<Checkbox readOnly={this.state.selected.addons[add]} />{' '}
										{addons_name}
									</div>
									<div className="list-cell">
										{' '}
										{addons_size + '/' + this.commercialProducts.length}
									</div>
									<div className="list-cell">
										{' '}
										{this.grouped_addons[add][0].cspmb__One_Off_Charge__c ||
											'N/A'}
									</div>
									<div className="list-cell">
										{' '}
										{this.grouped_addons[add][0].cspmb__Recurring_Charge__c ||
											'N/A'}
									</div>
								</li>
							);
						})}
				</ul>

				<Pagination
					totalSize={Object.keys(this.grouped_addons).length}
					pageSize={this.state.pagination.pageSize}
					page={this.state.pagination.page_addons}
					onPageSizeChange={newPageSize => {
						this.setState({
							pagination: { ...this.state.pagination, pageSize: newPageSize }
						});
					}}
					onPageChange={newPage => {
						this.setState({
							pagination: { ...this.state.pagination, page_addons: newPage }
						});
					}}
				/>
			</div>
		);

		tab.charges = (
			<div className="table-container">
				<div className="table-list-header">
					<div className="list-cell">
						<Checkbox
							onChange={() => {
								this.selectAll('addons');
							}}
						/>
						{window.SF.labels.modal_charge_table_header_name}
					</div>
					<div className="list-cell">
						{window.SF.labels.modal_charge_table_header_presentIn}
					</div>
					<div className="list-cell">
						{window.SF.labels.modal_charge_table_header_chargeType}
					</div>
					<div className="list-cell">
						{window.SF.labels.modal_charge_table_header_value}
					</div>
				</div>

				<ul className="table-list">
					{this._charges
						// .filter(ch => {
						//   if (this.state.filter.intersection) {
						//     return this._chCpMap[ch.Id].length === this.commercialProducts.length;
						//   }
						//   return true;
						// })
						.paginate(
							this.state.pagination.page_charges,
							this.state.pagination.pageSize
						)
						.map((charge, i) => {
							return (
								<li
									onClick={() => {
										this.onSelectRow(charge, 'charges');
									}}
									key={charge.product + '-' + charge.Id}
									className={
										'list-row' +
										(this.state.selected.charges[charge.Id]
											? ' selected-row'
											: '')
									}
								>
									<div className="list-cell">
										<Checkbox
											readOnly={this.state.selected.charges[charge.Id]}
										/>{' '}
										{charge.Name}
									</div>
									<div className="list-cell">
										{' '}
										{this._chCpMap[charge.Id].length +
											'/' +
											this.commercialProducts.length}
									</div>
									<div className="list-cell">{charge.chargeType}</div>
									<div className="list-cell">
										{charge[charge._type].toFixed(2)}
									</div>
								</li>
							);
						})}
				</ul>
				<Pagination
					totalSize={this._charges.length}
					pageSize={this.state.pagination.pageSize}
					page={this.state.pagination.page_charges}
					onPageSizeChange={newPageSize => {
						this.setState({
							pagination: { ...this.state.pagination, pageSize: newPageSize }
						});
					}}
					onPageChange={newPage => {
						this.setState({
							pagination: { ...this.state.pagination, page_charges: newPage }
						});
					}}
				/>
			</div>
		);

		tab.rated = (
			<div className="table-container">
				<div className="table-list-header">
					<div className="list-cell">
						<Checkbox
							onChange={() => {
								this.selectAll('rated');
							}}
						/>
						{window.SF.labels.modal_charge_table_header_name}
					</div>
					<div className="list-cell">
						{window.SF.labels.modal_charge_table_header_unit}
					</div>
					<div className="list-cell">
						{window.SF.labels.modal_charge_table_header_rateValue}
					</div>
				</div>
				<ul className="rc-list">
					{this._rateCards
						// .filter(rc => {
						//   if (this.state.filter.intersection) {
						//     return this._rcCpMap[rc.Id].length === this.commercialProducts.length;
						//   }
						//   return true;
						// })
						.paginate(
							this.state.pagination.page_rated,
							this.state.pagination.pageSize
						)
						.map((rc, i) => {
							return (
								<li
									key={rc.product + '-' + rc.Id}
									className="list-item selectable"
								>
									<div className="rc-title">
										<div className="title-upper" />
										<div className="title-content">
											<Icon name="announcement" width="14" color="#706e6b" />
											{rc.Name}
											<span className="product-count">
												{this._rcCpMap[rc.Id].length}
											</span>
										</div>
										<div className="title-lower"> </div>
									</div>

									<ul className="table-list">
										{rc.rateCardLines
											.filter(rcl => {
												let retBool = true;
												if (
													this.state.selectedProperty &&
													this.state.selectedPropertyValue
												) {
													if (
														rcl[this.state.selectedProperty] !==
														this.state.selectedPropertyValue
													) {
														retBool = false;
													}
												}
												return retBool;
											})
											.map((rcl, i) => {
												return (
													<li
														onClick={() => {
															this.onSelectRow(rcl, 'rated');
														}}
														key={rcl.Id}
														className={
															'list-row' +
															(this.state.selected.rated[rcl.Id]
																? ' selected-row'
																: '')
														}
													>
														<div className="list-cell">
															<Checkbox
																readOnly={this.state.selected.rated[rcl.Id]}
															/>{' '}
															{rcl.Name}
														</div>
														<div className="list-cell">
															{rcl.cspmb__Cap_Unit__c}
														</div>
														<div className="list-cell">
															{rcl.cspmb__rate_value__c}
															{this.state.selected.rated[rcl.Id] &&
															this.state.selected.rated[rcl.Id]
																.negotiatedValue ? (
																<span>
																	/
																	{
																		this.state.selected.rated[rcl.Id]
																			.negotiatedValue
																	}
																</span>
															) : (
																''
															)}
														</div>
													</li>
												);
											})}
									</ul>
								</li>
							);
						})}
				</ul>

				<Pagination
					totalSize={this._rateCards.length}
					pageSize={this.state.pagination.pageSize}
					page={this.state.pagination.page_rated}
					onPageSizeChange={newPageSize => {
						this.setState({
							pagination: { ...this.state.pagination, pageSize: newPageSize }
						});
					}}
					onPageChange={newPage => {
						this.setState({
							pagination: { ...this.state.pagination, page_rated: newPage }
						});
					}}
				/>
			</div>
		);

		let filterContainer; // onPageChange={(newPage) => {this.setState({pagination: {...this.state.pagination, page_rated: newPage}})}}
		filterContainer = (
			<div className="filter-container">
				{false && (
					<div>
						<div className="fa-padding-bottom-xsm">Intersection Rows</div>
						<Toggle
							onChange={val => {
								this.setState({
									filter: { ...this.state.filter, intersection: val }
								});
							}}
							value={this.state.filter.intersection}
						/>
					</div>
				)}
			</div>
		);

		if (
			this.state.tab === 'rated' &&
			this.props.settings.FACSettings.rcl_fields.length
		) {
			filterContainer = (
				<div className="bulk-filter-container">
					<h4>{window.SF.labels.modal_bluk_rateFilter_title}</h4>

					<div className="bulk-filter-section">
						<label>
							{window.SF.labels.modal_bluk_rateFilter_propertyTitle}
						</label>

						<select
							className="rcm-input_sm"
							value={this.state.selectedProperty || ''}
							onChange={this.onPropertyChange}
						>
							<option value="">
								{window.SF.labels.modal_bluk_rateFilter_dropdownPlaceholder}
							</option>
							{Object.keys(this.state.propertyData).map(key => {
								return (
									<option key={key} value={key}>
										{' '}
										{key}{' '}
									</option>
								);
							})}
						</select>
					</div>

					<div className="bulk-filter-section">
						<label>
							{window.SF.labels.modal_bluk_rateFilter_propertyValueTitle}
						</label>

						<select
							className="rcm-input_sm"
							value={this.state.selectedPropertyValue || ''}
							disabled={
								this.state.propertyData[this.state.selectedProperty]
									? false
									: true
							}
							onChange={this.onPropertyValueChange}
						>
							{this.state.propertyData[this.state.selectedProperty] &&
								this.state.propertyData[this.state.selectedProperty].map(
									val => {
										return (
											<option key={val} value={val}>
												{val}
											</option>
										);
									}
								)}
						</select>
					</div>
				</div>
			);
		}

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
					<h2 className="fa-modal-header-title">{window.SF.labels.modal_bulk_title}</h2>
				</div>
				<div className="negotiation-modal fa-modal-body">
					<div className="products-container">
						<div className="label-text">
							{window.SF.labels.modal_bulk_selected_title}
						</div>
						<ul className="fa-tag-group">
							{this.commercialProducts
								.slice(0, this.productEllipsis)
								.map(product => {
									return (
										<li className="fa-tag" key={product.Id}>
											{product.Name}
										</li>
									);
								})}
							{this.commercialProducts.length > this.productEllipsis ? (
								<li className="product-ellipsis">
									(+{this.commercialProducts.length - this.productEllipsis})
								</li>
							) : (
								''
							)}
						</ul>
					</div>

					<section className="fa-section fa-section-transparent">
						<div className="box fa-padding-left-xxsm">
							<div className="fa-button-group toggle-buttons">
								<button
									disabled={!Object.keys(this.grouped_addons).length}
									className={
										'fa-margin-right-sm fa-button button--' +
										(this.state.tab === 'addons' ? 'brand' : 'neutral')
									}
									onClick={() => {
										this.setTab('addons');
									}}
								>
									{window.SF.labels.products_addons}{' '}
									{this.state.count.addons ? (
										<span>({this.state.count.addons})</span>
									) : (
										''
									)}
								</button>

								<button
									disabled={!this._charges.length}
									className={
										'fa-margin-right-sm fa-button button--' +
										(this.state.tab === 'charges' ? 'brand' : 'neutral')
									}
									onClick={() => {
										this.setTab('charges');
									}}
								>
									{window.SF.labels.products_charges}{' '}
									{this.state.count.charges ? (
										<span>({this.state.count.charges})</span>
									) : (
										''
									)}
								</button>

								<button
									disabled={!this._rateCards.length}
									className={
										'fa-button button--' +
										(this.state.tab === 'rated' ? 'brand' : 'neutral')
									}
									onClick={() => {
										this.setTab('rated');
									}}
								>
									{window.SF.labels.products_rates}{' '}
									{this.state.count.rated ? (
										<span>({this.state.count.rated})</span>
									) : (
										''
									)}
								</button>
							</div>
						</div>
					</section>

					{filterContainer}

					<div className="tab-content-container">{tab[this.state.tab]}</div>

					<div className="action-container">
						<div className="fa-discount">
							<div className="fa-discount-item">
								<div className="fa-title fa-title-dark">
									{window.SF.labels.modal_bulk_discount_title}
								</div>
								<div className="fa-button-group-secondary toggle-buttons">
									<button
										className={
											'fa-btn fa-margin-right-sm fa-button-' +
											(this.state.discountMode === 'percentage'
												? 'brand'
												: 'neutral')
										}
										onClick={() => {
											this.setState({ discountMode: 'percentage' });
										}}
									>
										{window.SF.labels.modal_bulk_btn_percentage}
									</button>
									<button
										className={
											'fa-btn fa-button-' +
											(this.state.discountMode === 'fixed'
												? 'brand'
												: 'neutral')
										}
										onClick={() => {
											this.setState({ discountMode: 'fixed' });
										}}
									>
										{window.SF.labels.modal_bulk_btn_fixed}
									</button>
								</div>
							</div>
							<div class="fa-discount-item">
								<div className="fa-title fa-title-dark">
									{window.SF.labels.modal_bulk_discount_input_title}
								</div>
								<input
									type="number"
									min={0}
									name=""
									className="fa-input"
									ref={this.discount}
									placeholder={window.SF.labels.modal_bulk_input_placeholder}
								/>
							</div>
							<div class="fa-discount-item">
								<button
									disabled={!this.state.countTotal}
									className="fa-discount-item fa-button button--neutral"
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
						className="fa-button button--neutral"
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
	setValidation,
	createToast
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(NegotiationModal);

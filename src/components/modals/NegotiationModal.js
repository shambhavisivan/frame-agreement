import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Modal from 'react-responsive-modal';
import Icon from '../utillity/Icon';
import InputSearch from '../utillity/inputs/InputSearch';
import Toggle from '../utillity/inputs/Toggle';
import Checkbox from '../utillity/inputs/Checkbox';

import {
	validateAddons,
	validateCharges,
	validateRateCardLines
} from '../negotiation/Validation';
import { setValidation, createToast } from '../../actions';

// import { getFrameAgreements } from '../../actions';

import './Modal.css';
import './NegotiationModal.css';

const ADDON_VALUE_FIELD = 'cspmb__Recurring_Charge__c';
const RATE_VALUE_FIELD = 'cspmb__rate_value__c';

class NegotiationModal extends Component {
	constructor(props) {
		super(props);

		this.discount = React.createRef();

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
			tab: 'addons',
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
			filter: {
				unique: false,
				intersection: false
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

		this.setState({ attachment }, () => {
			this.props.createToast(
				'info',
				'Discount calculated',
				'Changes have to be saved to Frame Agreement.'
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
						Name
					</div>
					<div className="list-cell">Present In</div>
					<div className="list-cell">Original One-Off</div>
					<div className="list-cell">Original Recurring</div>
				</div>

				<ul className="table-list">
					{Object.keys(this.grouped_addons).map(add => {
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
						Name
					</div>
					<div className="list-cell">Present In</div>
					<div className="list-cell">Charge Type</div>
					<div className="list-cell">Original Value</div>
				</div>

				<ul className="table-list">
					{this._charges
						.filter(ch => {
							if (this.state.filter.intersection) {
								return (
									this._chCpMap[ch.Id].length === this.commercialProducts.length
								);
							}
							return true;
						})
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
						Name
					</div>
					<div className="list-cell">Unit</div>
					<div className="list-cell">Rate Value</div>
				</div>
				<ul className="rc-list">
					{this._rateCards
						.filter(rc => {
							if (this.state.filter.intersection) {
								return (
									this._rcCpMap[rc.Id].length === this.commercialProducts.length
								);
							}
							return true;
						})
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
			</div>
		);

		let filterContainer;
		filterContainer = (
			<div className="filter-container">
				<div>
					<div className="label-text">Intersection Rows</div>
					<Toggle
						onChange={val => {
							this.setState({
								filter: { ...this.state.filter, intersection: val }
							});
						}}
						value={this.state.filter.intersection}
					/>
				</div>
			</div>
		);
		if (
			this.state.tab === 'rated' &&
			this.props.settings.FACSettings.rcl_fields.length
		) {
			filterContainer = (
				<div className="bulk-filter-container">
					<h4>Filter rate card lines</h4>

					<div className="bulk-filter-section">
						<label>Select rate card line property:</label>

						<select
							className="rcm-input_sm"
							value={this.state.selectedProperty || ''}
							onChange={this.onPropertyChange}
						>
							<option value="">-- select an property --</option>
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
						<label>Select value:</label>

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
					modal: 'sf-modal negotiation-modal',
					closeButton: 'close-button'
				}}
				open={this.props.open}
				onClose={this.onCloseModal}
			>
				<div className="modal-header">
					<h2>Bulk Negotiation</h2>
				</div>
				<div className="modal-body">
					<div className="products-container">
						<div className="label-text">Selected products</div>
						<ul className="horizontal-list">
							{this.commercialProducts.map(product => {
								return <li key={product.Id}>{product.Name}</li>;
							})}
						</ul>
					</div>
					{filterContainer}

					<div className="tab-content-container">{tab[this.state.tab]}</div>

					<div className="action-container">
						<div className="label-text">Charges options</div>
						<div className="box">
							<div className="button-group toggle-buttons">
								<button
									className={
										'slds-button slds-button--' +
										(this.state.tab === 'addons' ? 'brand' : 'neutral')
									}
									onClick={() => {
										this.setTab('addons');
									}}
								>
									Addons{' '}
									{this.state.count.addons ? (
										<span>({this.state.count.addons})</span>
									) : (
										''
									)}
								</button>
								<button
									className={
										'slds-button slds-button--' +
										(this.state.tab === 'charges' ? 'brand' : 'neutral')
									}
									onClick={() => {
										this.setTab('charges');
									}}
								>
									Charges{' '}
									{this.state.count.charges ? (
										<span>({this.state.count.charges})</span>
									) : (
										''
									)}
								</button>
								<button
									className={
										'slds-button slds-button--' +
										(this.state.tab === 'rated' ? 'brand' : 'neutral')
									}
									onClick={() => {
										this.setTab('rated');
									}}
								>
									Rate Cards{' '}
									{this.state.count.rated ? (
										<span>({this.state.count.rated})</span>
									) : (
										''
									)}
								</button>
							</div>
						</div>
						<div className="box filter-container">
							<div>
								<span>Discount options</span>
								<div className="button-group toggle-buttons">
									<button
										className={
											'slds-button slds-button--' +
											(this.state.discountMode === 'percentage'
												? 'brand'
												: 'neutral')
										}
										onClick={() => {
											this.setState({ discountMode: 'percentage' });
										}}
									>
										Percentage
									</button>
									<button
										className={
											'slds-button slds-button--' +
											(this.state.discountMode === 'fixed'
												? 'brand'
												: 'neutral')
										}
										onClick={() => {
											this.setState({ discountMode: 'fixed' });
										}}
									>
										Fixed Amount
									</button>
								</div>
							</div>
							<div>
								<span>Discount to selections</span>
								<input
									type="number"
									min={0}
									name=""
									className="search-input"
									ref={this.discount}
									placeholder="Enter discount percentage"
								/>
								<button
									disabled={!this.state.countTotal}
									className="slds-button slds-button--neutral"
									onClick={this.applyDiscount}
								>
									Apply discount
								</button>
							</div>
						</div>
					</div>
				</div>
				<div className="modal-footer">
					<button
						className="slds-button slds-button--neutral"
						onClick={() => {
							this.props.onNegotiate(this.state.attachment);
						}}
					>
						Save to Frame Agreement
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

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

import {
	validateAddons,
	validateCharges,
	validateRateCardLines
} from '../../utils/validation-service';

import { createToast } from '~/src/actions';
import { DiscountInput } from '../utillity/inputs/discount-input';
import { isDiscountAllowed } from '../../utils/shared-service';

import * as Constants from '~/src/utils/constants'
import { frameHookAddonData, frameHookChargesData, frameHookProductChargesData, frameHookRateCardsData } from '../../utils/event-service';
import { isFalsyExceptZero } from '~/src/utils/shared-service';
import { getDiscountSet } from '../../utils/api-data-validation-service';

// import { getFrameAgreements } from '~/src/actions';

const ADDON_VALUE_FIELD = 'cspmb__Recurring_Charge__c';
const RATE_VALUE_FIELD = 'cspmb__rate_value__c';

const BulkNegotiationAction = {
	RESET_NEGOTIATION_ACTION: 'RESET',
	APPLY_NEGOTIATION_ACTION: 'APPLY'
}

class NegotiationModal extends Component {
	constructor(props) {
		super(props);
		this.productEllipsis = 3;
		this.mounted = null;

		this._setState = this._setState.bind(this);
		this.onCloseModal = this.onCloseModal.bind(this);
		this.applyDiscount = this.applyDiscount.bind(this);
		this.onPropertyChange = this.onPropertyChange.bind(this);
		this.onPropertyValueChange = this.onPropertyValueChange.bind(this);
		this.onDiscountInputChange = this.onDiscountInputChange.bind(this);

		this.commercialProductsMap = {};

		this.commercialProducts = [];

		if (props.commercialProductType === Constants.ROLE_OFFER) {
			this.commercialProducts = this.props.offers.filter(product => {
				this.commercialProductsMap[product.Id] = product;
				return this.props.products.includes(product.Id);
			});
		} else {
			this.commercialProducts = this.props.commercialProducts.filter(product => {
				this.commercialProductsMap[product.Id] = product;
				return this.props.products.includes(product.Id);
			});
		}

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

		// this.rateCardsPaginationFormat = this.paginateRateCards(this._rateCards, 10);
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
			updatedAttachment: JSON.parse(JSON.stringify(attachment)),
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
			},
			rateCardsPaginationFormat: this.paginateRateCards(this._rateCards, 10, true)
		};
		/*********************************************************************************************************************************************************/
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

		this._setState({
			validation: {
				// addons,
				charges
				// rated
			}
		});

		(() => {
			// create hardcoded legacy charges for product.
			const legacyProducts = this.commercialProducts.filter(
				(cp) => cp._charges.length === 0
			);

			if (legacyProducts.length) {
				const oneOffCharge = {
					Id: "dummy-id-oneoff",
					Name: "One-off charge (Product)",
					isLegacy: true,
					type:'oneOff'
				};

				const recurringCharge = {
					Id: "dummy-id-recurring",
					Name: "Recurring charge (Product)",
					isLegacy: true,
					type:'recurring'
				};

				this._charges.push(oneOffCharge, recurringCharge);
			}
		})();

		this.eventHookData = {
			type:
				props.commercialProductType === Constants.ROLE_OFFER
					? Constants.EVENT_DATA_OFFER
					: Constants.EVENT_DATA_COMMERCIAL_PRODUCT,
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

	setTab(newTab) {
		this._setState({ tab: newTab });
	}

	paginateRateCards(rcArr, pageSize, overrideState = false) {
		let _rcMap = {};
		rcArr.forEach(rc => {
			_rcMap[rc.Id] = { Id: rc.Id, Name: rc.Name };
			if (rc.hasOwnProperty('authId')) {
				_rcMap[rc.Id].authId = rc.authId;
			}
		});

		let _mergedRcl = rcArr
			.reduce((acc, iterator, i) => {
				return acc.concat([], iterator.rateCardLines);
			}, [])
			.filter(rcl => {
				let retBool = true;
				try {
					if (this.state.selectedProperty && this.state.selectedPropertyValue) {
						if (
							rcl[this.state.selectedProperty].toString() !==
							this.state.selectedPropertyValue.toString()
						) {
							retBool = false;
						}
					}
				} catch (err) {}
				return retBool;
			});

		let _chunked = _mergedRcl.chunk(pageSize);

		let paginated = _chunked.map(_set => {
			let _rcPageMap = {};

			_set.forEach(rcl => {
				if (!_rcPageMap.hasOwnProperty(rcl.cspmb__Rate_Card__c)) {
					_rcPageMap[rcl.cspmb__Rate_Card__c] = {
						..._rcMap[rcl.cspmb__Rate_Card__c]
					};
					_rcPageMap[rcl.cspmb__Rate_Card__c].rateCardLines = [];
				}
				_rcPageMap[rcl.cspmb__Rate_Card__c].rateCardLines.push(rcl);
			});

			return Object.values(_rcPageMap);
		});

		console.log(paginated);

		if (!overrideState) {
			this._setState({ rateCardsPaginationFormat: paginated });
		}

		return paginated;
	}

	selectAll(type) {
		var newSelected = {};

		switch (type) {
			case 'addons':
				var totalCount = Object.keys(this.grouped_addons).length;
				var selectedCount = Object.keys(this.state.selected.addons).length;

				if (totalCount !== selectedCount) {
					Object.keys(this.grouped_addons).forEach(addId => {
						newSelected[addId] = true;
					});
				}
				this._setState({
					selected: { ...this.state.selected, addons: newSelected }
				});

				// code block
				break;
			case 'charges':
				// code block
				var totalCount = this._charges.length;
				var selectedCount = Object.keys(this.state.selected.charges).length;

				var newSelected = {};
				if (totalCount !== selectedCount) {
					this._charges.forEach(ch => {
						newSelected[ch.Id] = true;
					});
				}
				this._setState({
					selected: { ...this.state.selected, charges: newSelected }
				});
				break;
			case 'rated':
				var allRcl = this.state.rateCardsPaginationFormat.reduce((acc, iterator) => {
					return acc.concat(
						[],
						iterator.reduce((acc2, iterator2) => acc2.concat([], iterator2.rateCardLines), [])
					);
				}, []);

				var selectedCount = Object.keys(this.state.selected.rated).length;

				var newSelected = {};

				if (allRcl.length !== selectedCount) {
					allRcl.forEach(rcl => {
						newSelected[rcl.Id] = true;
					});
				}

				this._setState({
					selected: { ...this.state.selected, rated: newSelected }
				});

				break;
		}

		this._setState(
			{
				count: {
					...this.state.count,
					[type]: Object.keys(newSelected).length
				}
			},
			() => {
				this._setState({
					countTotal: Object.values(this.state.count).reduce((a, b) => +(a + b), 0)
				});
				console.log(this.state.selected);
			}
		);
	}

	onPropertyChange(e) {
		var defaultProperty = this.state.propertyData[e.target.value]
			? this.state.propertyData[e.target.value][0]
			: '';
		this._setState(
			{
				selectedProperty: e.target.value || null,
				selectedPropertyValue: defaultProperty
			},
			() => {
				this.paginateRateCards(this._rateCards, this.state.pagination.pageSize);
			}
		);
	}

	onPropertyValueChange(e) {
		this._setState({ selectedPropertyValue: e.target.value || null }, () => {
			this.paginateRateCards(this._rateCards, this.state.pagination.pageSize);
		});
	}

	onSelectRow(row, type) {
		let selected = this.state.selected;
		if (selected[type][row.Id]) {
			delete selected[type][row.Id];
		} else {
			selected[type][row.Id] = row;
		}
		this._setState(
			{
				selected: selected,
				count: {
					...this.state.count,
					[type]: Object.keys(selected[type]).length
				}
			},
			() => {
				this._setState({
					countTotal: Object.values(this.state.count).reduce((a, b) => +(a + b), 0)
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
		this._setState(
			{
				selected: selected,
				count: {
					...this.state.count,
					addons: Object.keys(selected.addons).length
				}
			},
			() => {
				this._setState({
					countTotal: Object.values(this.state.count).reduce((a, b) => +(a + b), 0)
				});
				console.log(this.state.selected);
			}
		);
	}

	applyDiscount(actionType) {
		const { discount } = this.state;

		if (!+discount && actionType !== BulkNegotiationAction.RESET_NEGOTIATION_ACTION) {
			return;
		}

		const facSettings = this.props.settings.FACSettings;
		const _DISCOUNT = +discount * -1;
		let showNegotiationSkippedAlert = false;
		let appliedDiscountsCount = 0;

		function applyDiscountRate(prevNegotiatedPrice, state, originalPrice) {

			if (actionType === BulkNegotiationAction.RESET_NEGOTIATION_ACTION) {
				return originalPrice;
			}

			prevNegotiatedPrice = +prevNegotiatedPrice;
			let negotiatedPrice = facSettings.applyBulkDiscountListPrice
				? originalPrice
				: prevNegotiatedPrice;

			if (state.discountMode === 'fixed') {
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

		let selected = { ...this.state.selected };
		let attachment = { ...this.state.attachment };
		let eventHookData = this.eventHookData;

		if (Object.keys(selected.addons).length) {
			this.commercialProducts.forEach(cp => {
				if (cp._addons) {
					cp._addons.forEach(addon => {
						if (selected.addons.hasOwnProperty(addon.cspmb__Add_On_Price_Item__c)) {
							attachment[cp.Id]._addons = attachment[cp.Id]._addons || {};
							attachment[cp.Id]._addons[addon.Id] = attachment[cp.Id]._addons[addon.Id] || {};

							if (addon.cspmb__One_Off_Charge__c && isDiscountAllowed('oneOff', addon)) {
								const oneOffDiscountSet = getDiscountSet(
									addon,
									addon.cspmb__One_Off_Charge__c,
									"oneOff"
								);
								let ignoreHook = false;
								const prevNegotiatedPrice = !isFalsyExceptZero(
									attachment[cp.Id]._addons[addon.Id].oneOff
								)
									? attachment[cp.Id]._addons[addon.Id].oneOff
									: addon.cspmb__One_Off_Charge__c;
								let negotiatedValue = applyDiscountRate(
									prevNegotiatedPrice,
									this.state,
									addon.cspmb__One_Off_Charge__c
								);

								//Reset applied discount to prev negotiated value
								if (oneOffDiscountSet.size) {
									if (
										!oneOffDiscountSet.has(
											negotiatedValue
										) &&
										negotiatedValue !==
											addon.cspmb__One_Off_Charge__c
									) {
										negotiatedValue =
											attachment[cp.Id]._addons[addon.Id]
												.oneOff;
										showNegotiationSkippedAlert = true;
									}
								}

								if (
									negotiatedValue ===
									attachment[cp.Id]._addons[addon.Id].oneOff
								) {
									ignoreHook = true;
								} else {
									appliedDiscountsCount++;
									attachment[cp.Id]._addons[
										addon.Id
									].oneOff = negotiatedValue;
								}

								if (!ignoreHook) {
									eventHookData = frameHookAddonData(
										eventHookData,
										this.state.updatedAttachment,
										cp,
										addon,
										"oneOff",
										negotiatedValue
									);
								}
							}

							if (addon.cspmb__Recurring_Charge__c && isDiscountAllowed('recurring', addon)) {
								const recurringDiscountSet = getDiscountSet(
									addon,
									addon.cspmb__Recurring_Charge__c,
									"recurring"
								);
								let ignoreHook = false;
								const prevNegotiatedPrice = !isFalsyExceptZero(
									attachment[cp.Id]._addons[addon.Id].recurring
								)
									? attachment[cp.Id]._addons[addon.Id].recurring
									: addon.cspmb__Recurring_Charge__c;
								let negotiatedValue = applyDiscountRate(
									prevNegotiatedPrice,
									this.state,
									addon.cspmb__Recurring_Charge__c
								);

								//Reset applied discount to prev negotiated value
								if (recurringDiscountSet.size) {
									if (
										!recurringDiscountSet.has(
											negotiatedValue
										) &&
										negotiatedValue !==
											addon.cspmb__Recurring_Charge__c
									) {
										negotiatedValue =
											attachment[cp.Id]._addons[addon.Id]
												.recurring;
										showNegotiationSkippedAlert = true;
									}
								}

								if (
									negotiatedValue ===
									attachment[cp.Id]._addons[addon.Id]
										.recurring
								) {
									ignoreHook = true;
								} else {
									appliedDiscountsCount++;
									attachment[cp.Id]._addons[
										addon.Id
									].recurring = negotiatedValue;
								}

								if (!ignoreHook) {
									eventHookData = frameHookAddonData(
										eventHookData,
										this.state.updatedAttachment,
										cp,
										addon,
										"recurring",
										negotiatedValue
									);
								}
							}
						}
					});
				}
			});
		}

		if (Object.keys(selected.charges).length) {
			this.commercialProducts.forEach((cp) => {
				if (cp._charges.length) {
					cp._charges.forEach((charge) => {
						if (
							selected.charges.hasOwnProperty(charge.Id) &&
							isDiscountAllowed(charge._type, cp)
						) {
							const chargeDiscountSet = getDiscountSet(
								cp,
								charge[charge._type],
								charge._type,
								charge,
								true
							);
							let ignoreHook = false;
							attachment[cp.Id]._charges = attachment[cp.Id]._charges || {};
							attachment[cp.Id]._charges[charge.Id] =
								attachment[cp.Id]._charges[charge.Id] || {};
							const prevNegotiatedPrice = !isFalsyExceptZero(
								attachment[cp.Id]._charges[charge.Id][
									charge._type
								]
							)
								? attachment[cp.Id]._charges[charge.Id][
										charge._type
								  ]
								: charge[charge._type];
							let negotiatedValue = applyDiscountRate(
								prevNegotiatedPrice,
								this.state,
								charge[charge._type]
							);

							//Reset applied discount to prev negotiated value
							if (chargeDiscountSet.size) {
								if (
									!chargeDiscountSet.has(negotiatedValue) &&
									negotiatedValue !== charge[charge._type]
								) {
									negotiatedValue =
										attachment[cp.Id]._charges[charge.Id][
											charge._type
										];
									showNegotiationSkippedAlert = true;
								}
							}

							if (
								negotiatedValue ===
								attachment[cp.Id]._charges[charge.Id][
									charge._type
								]
							) {
								ignoreHook = true;
							} else {
								appliedDiscountsCount++;
								attachment[cp.Id]._charges[charge.Id][
									charge._type
								] = negotiatedValue;
							}

							if (!ignoreHook) {
								eventHookData = frameHookChargesData(
									eventHookData,
									this.state.updatedAttachment,
									cp,
									charge,
									negotiatedValue
								);
							}
						}
					});
				} else {
					const oneOffCharge = cp.cspmb__One_Off_Charge__c;
					const recurringCharge = cp.cspmb__Recurring_Charge__c;

					if (oneOffCharge || recurringCharge) {
						attachment[cp.Id]._product = attachment[cp.Id]._product || {};
						this._charges.forEach((charge) => {
							if (
								Object.keys(selected.charges).includes(charge.Id) &&
								charge.isLegacy
							) {
								if (
									charge.type == 'oneOff' &&
									oneOffCharge &&
									isDiscountAllowed(charge.type, cp)
								) {
									const oneOffDiscountSet = getDiscountSet(
										cp,
										oneOffCharge,
										charge.type
									);
									let ignoreHook = false;
									const prevNegotiatedPrice = !isFalsyExceptZero(
										attachment[cp.Id]._product.oneOff
									)
										? attachment[cp.Id]._product.oneOff
										: oneOffCharge;
									let negotiatedValue = applyDiscountRate(
										prevNegotiatedPrice,
										this.state,
										oneOffCharge
									);

									//Reset applied discount to prev negotiated value
									if (oneOffDiscountSet.size) {
										if (
											!oneOffDiscountSet.has(
												negotiatedValue
											) &&
											negotiatedValue !== oneOffCharge
										) {
											negotiatedValue =
												attachment[cp.Id]._product
													.oneOff;
											showNegotiationSkippedAlert = true;
										}
									}

									if (
										negotiatedValue ===
										attachment[cp.Id]._product.oneOff
									) {
										ignoreHook = true;
									} else {
										appliedDiscountsCount++;
										attachment[cp.Id]._product.oneOff = negotiatedValue;
									}

									if (!ignoreHook) {
										eventHookData = frameHookProductChargesData(
											eventHookData,
											this.state.updatedAttachment,
											cp,
											"oneOff",
											negotiatedValue
										);
									}
								} else if (
									charge.type == 'recurring' &&
									recurringCharge &&
									isDiscountAllowed(charge.type, cp)
								) {
									const recurringDiscountSet = getDiscountSet(
										cp,
										recurringCharge,
										charge.type
									);
									let ignoreHook = false;
									const prevNegotiatedPrice = !isFalsyExceptZero(
										attachment[cp.Id]._product.recurring
									)
										? attachment[cp.Id]._product.recurring
										: recurringCharge;
									let negotiatedValue = applyDiscountRate(
										prevNegotiatedPrice,
										this.state,
										recurringCharge
									);

									//Reset applied discount to prev negotiated value
									if (recurringDiscountSet.size) {
										if (
											!recurringDiscountSet.has(
												negotiatedValue
											) &&
											negotiatedValue !== recurringCharge
										) {
											negotiatedValue =
												attachment[cp.Id]._product
													.recurring;
											showNegotiationSkippedAlert = true;
										}
									}

									if (
										negotiatedValue ===
										attachment[cp.Id]._product.recurring
									) {
										ignoreHook = true;
									} else {
										appliedDiscountsCount++;
										attachment[cp.Id]._product.recurring = negotiatedValue;
									}

									if (!ignoreHook) {
										eventHookData = frameHookProductChargesData(
											eventHookData,
											this.state.updatedAttachment,
											cp,
											"recurring",
											negotiatedValue
										);
									}
								}
							}
						});
					}
				}
			});
		}

		if (Object.keys(selected.rated).length) {
			this.commercialProducts.forEach(cp => {
				if (cp._rateCards) {
					cp._rateCards.forEach(rc => {
						rc.rateCardLines.forEach(rcl => {
							if (selected.rated.hasOwnProperty(rcl.Id)) {
								attachment[cp.Id]._rateCards = attachment[cp.Id]._rateCards || {};
								attachment[cp.Id]._rateCards[rc.Id] = attachment[cp.Id]._rateCards[rc.Id] || {};
								let ignoreHook = false;
								const prevNegotiatedPrice = !isFalsyExceptZero(
									attachment[cp.Id]._rateCards[rc.Id][rcl.Id]
								)
									? attachment[cp.Id]._rateCards[rc.Id][rcl.Id]
									: rcl.cspmb__rate_value__c;
								const negotiatedValue = applyDiscountRate(
									prevNegotiatedPrice,
									this.state,
									rcl.cspmb__rate_value__c
								);

								//Reset applied discount to prev negotiated value
								if (
									negotiatedValue ===
									attachment[cp.Id]._rateCards[rc.Id][rcl.Id]
								) {
									ignoreHook = true;
								} else {
									appliedDiscountsCount++;
									attachment[cp.Id]._rateCards[rc.Id][rcl.Id] = negotiatedValue;
								}

								if (!ignoreHook) {
									eventHookData = frameHookRateCardsData(
										eventHookData,
										this.state.updatedAttachment,
										cp,
										rc,
										rcl,
										negotiatedValue
									);
								}
							}
						});
					});
				}
			});
		}

		this._setState(
			{ attachment, actionTaken: true },
			() => {
				if (appliedDiscountsCount) {
					this.props.createToast(
						"info",
						window.SF.labels.toast_discount_calculated_title,
						window.SF.labels.toast_discount_calculated
					);
				}
			}
		);

		if (showNegotiationSkippedAlert) {
			this.props.createToast(
				'warning',
				'Some Discounts not applied',
				'Some set values could not be applied to all items due to discount level constraints'
			);
		}
	}

	renderCharges(charge) {
		return charge.isLegacy ? (
			<li
				onClick={() => {
					this.onSelectRow(charge, "charges");
				}}
				key={charge.product + "-" + charge.Id}
				className={
					"list-row" +
					(this.state.selected.charges[charge.Id]
						? " selected-row"
						: "")
				}
			>
				<div className="list-cell">
					<Checkbox
						readOnly={
							this.state.selected.charges[charge.Id]
						}
					/>{" "}
					{charge.Name}
				</div>
			</li>
		) : (
			<li
				onClick={() => {
					this.onSelectRow(charge, "charges");
				}}
				key={charge.product + "-" + charge.Id}
				className={
					"list-row" +
					(this.state.selected.charges[charge.Id]
						? " selected-row"
						: "")
				}
			>
				<div className="list-cell">
					<Checkbox
						readOnly={
							this.state.selected.charges[charge.Id]
						}
					/>{" "}
					{charge.Name}
				</div>
					<div className="list-cell">
						{" "}
						{this._chCpMap[charge.Id]
							.length +
							"/" +
							this.commercialProducts
								.length}
					</div>
					<div className="list-cell">
						{charge.chargeType}
					</div>
					<div className="list-cell">
						<NumberFormat
							value={charge[charge._type]}
						/>
					</div>
			</li>
		)
	}

	onDiscountInputChange(value) {
		this.setState({ discount: value });
	}

	render() {
		let tab = {
			addons: null,
			charges: null,
			rated: null
		};

		tab.addons = (
			<Render if={Object.keys(this.grouped_addons).length}>
				<div className="table-container">
					<div className="table-list-header">
						<div className="list-cell">
							<Checkbox
								value={
									Object.keys(this.grouped_addons).length ===
										Object.keys(this.state.selected.addons).length &&
									Object.keys(this.grouped_addons).length
								}
								onChange={() => {
									this.selectAll('addons');
								}}
							/>
							{window.SF.labels.modal_charge_table_header_name}
						</div>
						<div className="list-cell">{window.SF.labels.modal_charge_table_header_presentIn}</div>
						<div className="list-cell">{window.SF.labels.modal_charge_table_header_oneOff}</div>
						<div className="list-cell">{window.SF.labels.modal_charge_table_header_recurring}</div>
					</div>

					<ul>
						{Object.keys(this.grouped_addons)
							.paginate(this.state.pagination.page_addons, this.state.pagination.pageSize)
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
											'list-row' + (this.state.selected.addons[add] ? ' selected-row' : '')
										}
									>
										<div className="list-cell">
											<Checkbox readOnly={this.state.selected.addons[add]} /> {addons_name}
										</div>
										<div className="list-cell">
											{addons_size + '/' + this.commercialProducts.length}
										</div>
										<div className="list-cell">
											<NumberFormat value={this.grouped_addons[add][0].cspmb__One_Off_Charge__c} />
										</div>
										<div className="list-cell">
											<NumberFormat
												value={this.grouped_addons[add][0].cspmb__Recurring_Charge__c}
											/>
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
							this._setState({
								pagination: {
									...this.state.pagination,
									pageSize: newPageSize,
									page_addons: 1
								}
							});
						}}
						onPageChange={newPage => {
							this._setState({
								pagination: { ...this.state.pagination, page_addons: newPage }
							});
						}}
					/>
				</div>
			</Render>
		);

		tab.charges = (
			<Render if={this._charges.length}>
				<div className="table-container">
					<div className="table-list-header">
						<div className="list-cell">
							<Checkbox
								value={
									this._charges.length === Object.keys(this.state.selected.charges).length &&
									Object.keys(this.state.selected.charges).length
								}
								onChange={() => {
									this.selectAll('charges');
								}}
							/>
							{window.SF.labels.modal_charge_table_header_name}
						</div>
						<div className="list-cell">{window.SF.labels.modal_charge_table_header_presentIn}</div>
						<div className="list-cell">{window.SF.labels.modal_charge_table_header_chargeType}</div>
						<div className="list-cell">{window.SF.labels.modal_charge_table_header_value}</div>
					</div>

					<ul className="table-list">
						{this._charges
							.paginate(this.state.pagination.page_charges, this.state.pagination.pageSize)
							.map((charge, i) => {
								return this.renderCharges(charge)
							})}
					</ul>
					<Pagination
						totalSize={this._charges.length}
						pageSize={this.state.pagination.pageSize}
						page={this.state.pagination.page_charges}
						onPageSizeChange={newPageSize => {
							this._setState({
								pagination: {
									...this.state.pagination,
									pageSize: newPageSize,
									page_charges: 1
								}
							});
						}}
						onPageChange={newPage => {
							this._setState({
								pagination: { ...this.state.pagination, page_charges: newPage }
							});
						}}
					/>
				</div>
			</Render>
		);

		let selectAllRatedChecked =
			this.state.rateCardsPaginationFormat.reduce((acc, iterator) => {
				return acc.concat(
					[],
					iterator.reduce((acc2, iterator2) => acc2.concat([], iterator2.rateCardLines), [])
				);
			}, []).length === Object.keys(this.state.selected.rated).length;

		tab.rated = (
			<Render if={Object.keys(this._rateCards).length}>
				<div className="table-container">
					<div className="table-list-header">
						<div className="list-cell">
							<Checkbox
								value={selectAllRatedChecked}
								onChange={() => {
									this.selectAll('rated');
								}}
							/>
							{window.SF.labels.modal_charge_table_header_name}
						</div>
						<div className="list-cell">{window.SF.labels.modal_charge_table_header_unit}</div>
						<div className="list-cell">{window.SF.labels.modal_charge_table_header_rateValue}</div>
					</div>
					<ul className="fa-modal-list">
						{(this.state.rateCardsPaginationFormat[this.state.pagination.page_rated - 1] || []).map(
							(rc, i) => {
								return (
									<li key={rc.product + '-' + rc.Id} className="list-item selectable">
										<div className="rate-card-title">
											<div className="title-upper" />
											<div className="title-content">
												<Icon name="announcement" width="14" color="#706e6b" />
												{rc.Name}
												<span className="fa-modal-product-count">
													{this._rcCpMap[rc.Id].length}
												</span>
											</div>
											<div className="title-lower"> </div>
										</div>

										<ul className="table-list">
											{rc.rateCardLines.map((rcl, i) => {
												return (
													<li
														onClick={() => {
															this.onSelectRow(rcl, 'rated');
														}}
														key={rcl.Id}
														className={
															'list-row' +
															(this.state.selected.rated[rcl.Id] ? ' selected-row' : '')
														}
													>
														<div className="list-cell">
															<Checkbox readOnly={this.state.selected.rated[rcl.Id]} /> {rcl.Name}
														</div>
														<div className="list-cell">{rcl.cspmb__Cap_Unit__c}</div>
														<div className="list-cell">
															<NumberFormat value={rcl.cspmb__rate_value__c} />
															{this.state.selected.rated[rcl.Id] &&
															this.state.selected.rated[rcl.Id].negotiatedValue ? (
																<span>/{this.state.selected.rated[rcl.Id].negotiatedValue}</span>
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
							}
						)}
					</ul>

					<Pagination
						totalSize={this.state.rateCardsPaginationFormat.length * this.state.pagination.pageSize}
						pageSize={this.state.pagination.pageSize}
						page={this.state.pagination.page_rated}
						onPageSizeChange={newPageSize => {
							// this.paginateRateCards(this._rateCards, this.state.pagination.pageSize);

							this._setState(
								{
									pagination: {
										...this.state.pagination,
										pageSize: newPageSize,
										page_rated: 1
									}
								},
								() => {
									this.paginateRateCards(this._rateCards, this.state.pagination.pageSize);
								}
							);
						}}
						onPageChange={newPage => {
							this._setState({
								pagination: { ...this.state.pagination, page_rated: newPage }
							});
						}}
					/>
				</div>
			</Render>
		);

		let filterContainer; // onPageChange={(newPage) => {this._setState({pagination: {...this.state.pagination, page_rated: newPage}})}}
		filterContainer = (
			<div className="filter-container">
				{false && (
					<div>
						<div className="fa-padding-bottom-xsm">Intersection Rows</div>
						<Toggle
							onChange={val => {
								this._setState({
									filter: { ...this.state.filter, intersection: val }
								});
							}}
							value={this.state.filter.intersection}
						/>
					</div>
				)}
			</div>
		);

		if (this.state.tab === 'rated' && this.props.settings.FACSettings.rcl_fields.length) {
			filterContainer = (
				<div className="fa-modal-filter-container">
					<h4>{window.SF.labels.modal_bluk_rateFilter_title}</h4>

					<div className="fa-modal-filter-section">
						<label>{window.SF.labels.modal_bluk_rateFilter_propertyTitle}</label>

						<select
							className="fa-select"
							value={this.state.selectedProperty || ''}
							onChange={this.onPropertyChange}
						>
							<option value="">{window.SF.labels.modal_bluk_rateFilter_dropdownPlaceholder}</option>
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

					<div className="fa-modal-filter-section">
						<label>{window.SF.labels.modal_bluk_rateFilter_propertyValueTitle}</label>

						<select
							className="fa-select"
							value={this.state.selectedPropertyValue || ''}
							disabled={this.state.propertyData[this.state.selectedProperty] ? false : true}
							onChange={this.onPropertyValueChange}
						>
							{this.state.propertyData[this.state.selectedProperty] &&
								this.state.propertyData[this.state.selectedProperty].map(val => {
									return (
										<option key={val} value={val}>
											{val}
										</option>
									);
								})}
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
				<div className="negotiation-modal fa-modal-body">
					<div className="fa-modal-products-container">
						<div className="fa-modal-product-title">
							{this.commercialProducts.length} {window.SF.labels.modal_bulk_selected_title}
						</div>
						{/*	<ul className="fa-tag-group">
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
						</ul>*/}
					</div>

					<section className="fa-section fa-section-transparent">
						<div className="fa-tab-group fa-tab-group-secondary">
							<ul className="fa-tabs-secondary">
								<li
									disabled={!Object.keys(this.grouped_addons).length}
									className={
										'fa-tabs-secondary__item fa-tabs-secondary__item-' +
										(this.state.tab === 'addons' ? 'brand' : 'neutral')
									}
									onClick={() => {
										this.setTab('addons');
									}}
								>
									{window.SF.labels.products_addons}
									{this.state.count.addons ? <span>({this.state.count.addons})</span> : ''}
								</li>

								<li
									disabled={!this._charges.length}
									className={
										'fa-tabs-secondary__item fa-tabs-secondary__item-' +
										(this.state.tab === 'charges' ? 'brand' : 'neutral')
									}
									onClick={() => {
										this.setTab('charges');
									}}
								>
									{window.SF.labels.products_charges}
									{this.state.count.charges ? <span>({this.state.count.charges})</span> : ''}
								</li>

								<li
									disabled={!this._rateCards.length}
									className={
										'fa-tabs-secondary__item fa-tabs-secondary__item-' +
										(this.state.tab === 'rated' ? 'brand' : 'neutral')
									}
									onClick={() => {
										this.setTab('rated');
									}}
								>
									{window.SF.labels.products_rates}
									{this.state.count.rated ? <span>({this.state.count.rated})</span> : ''}
								</li>
							</ul>
						</div>
					</section>

					{filterContainer}

					<div className="tab-content-container">{tab[this.state.tab]}</div>

					<div className="fa-modal-action-container">
						<div className="fa-modal-discount">
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
								<h4 className="fa-modal-discount-title">
									{window.SF.labels.modal_bulk_discount_input_title}
								</h4>
								<DiscountInput
									value={this.state.discount}
									mode={this.state.discountMode}
									onChange={this.onDiscountInputChange}
								/>
							</div>
							<div className="fa-modal-discount-item">
								<button
									disabled={!this.state.countTotal}
									className="fa-button fa-button--brand"
									onClick={() => this.applyDiscount(BulkNegotiationAction.APPLY_NEGOTIATION_ACTION)}
								>
									{window.SF.labels.modal_bulk_btn_apply}
								</button>
							</div>
							<div className="fa-modal-discount-item">
								<button
									disabled={!this.state.countTotal}
									className="fa-button fa-button--brand"
									onClick={() => this.applyDiscount(BulkNegotiationAction.RESET_NEGOTIATION_ACTION)}
								>
									{'Reset Negotiations'}
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
							this.onCloseModal();
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
		offers: state.offers,
		validation: state.validation,
		settings: state.settings
	};
};

const mapDispatchToProps = {
	createToast
};

export default connect(mapStateToProps, mapDispatchToProps)(NegotiationModal);

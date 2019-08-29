import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import { DebounceInput } from 'react-debounce-input';
import Select from 'react-select';

import {
	decodeEntities,
	log,
	IsJsonString,
	truncateCPField
} from '../../../utils/shared-service';
import Icon from '../../utillity/Icon';
import DGTargets from '../utility/DGTargets';

import CommercialProductSkeleton from '../../skeletons/CommercialProductSkeleton';

import { CustomOption, filterOptions } from '../utility/CustomOption';

import '../utility/customTabs.scss';

let ACTIVE_FA = null;

const getTargetObjectCode = targetObject => {
	let str;
	if (targetObject === 'Commercial Product') {
		str = 'pi';
	} else if (targetObject === 'Rate Card Line') {
		str = 'rcl';
	}

	return str;
};

const negotiateDiscountCodesForProducts = async (data, removed_group) => {
	// get discount codes
	// group all rcl codes
	// group all cp codes

	// Loop cp
	// do they have rate cards?
	// get all rate card lines from cp._rateCards > rateCardLines (FOI: Id, cspmb__Rate_Card__c, cspmb__rate_value__c)

	// Loop these rcl
	// cross reference rcl with rcl codes
	// Match?
	// you have original price, and negotiation info from group
	// append it to negoArray
	// in case of multiple codes being applied to same rcl, apply last one (overwrite while looping codes)

	// ********************************

	// get products (from data)
	// Loop cp
	// cross reference the list with cp codes
	// Match?
	// check code for oneOff/recc
	// apply appropriate discount and append to negoArray
	// in case of multiple codes being applied to same cp, apply last one (overwrite while looping codes)

	// ********************************
	// send negoArray to negotiate API

	// resetCode is used for removing discount code, it will reset the product negotiation and then refresh all negotiation

	let _commercialProducts;
	let active_fa = await window.FAM.api.getActiveFrameAgreement();

	// window.FAM.api.resetNegotiation(active_fa.Id);

	if (!data) {
		_commercialProducts = active_fa._ui.commercialProducts;
	} else {
		_commercialProducts = active_fa._ui.commercialProducts.filter(cp =>
			data.includes(cp.Id)
		);
	}

	// **************************************** HELPERS
	function calculateDiscount(type, discount, original) {
		// Used to calculate discount based on a) type (absolute/percentage), b) discount (value) c) original (value of charge)
		let result;
		discount = Math.abs(+discount);

		if (type === 'Amount') {
			result = original - discount;
		} else {
			result = original - (original * discount) / 100;
		}

		var dp = decimalPlaces(result);
		if (dp > 2) {
			dp = 2;
		}

		return +result.toFixed(dp);
	}

	function decimalPlaces(num) {
		// Used to determine adequate decimal points
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
	// ****************************************
	// Will hold negotiation API compliant structure
	let _negoArray = [];

	let discountCodes = await window.FAM.api.getCustomData(active_fa.Id);
	discountCodes = discountCodes.codes || [];

	if (!discountCodes.length) {
		if (removed_group) {
			window.FAM.api.resetNegotiation(active_fa.Id);
			log.bg.red('---NEGOTIATION RESET');
		}

		// WE'RE DONE HERE
		Promise.resolve(data);
		return;
	}

	window.FAM.api.resetNegotiation(active_fa.Id);
	log.bg.red('---NEGOTIATION RESET');

	// Group codes by target to avoid wasteful looping
	let rcl_codes = discountCodes.filter(
		dc => dc.csfamext__target_object__c === 'Rate Card Line'
	);
	let cp_codes = discountCodes.filter(
		dc => dc.csfamext__target_object__c === 'Commercial Product'
	);

	// Generate map of original charges for product
	let _originalProductValues = active_fa._ui.commercialProducts.reduce(
		(acc, iter) => {
			let _data = {};
			if (iter.hasOwnProperty('cspmb__Recurring_Charge__c')) {
				_data.recurring = +iter.cspmb__Recurring_Charge__c;
			}
			if (iter.hasOwnProperty('cspmb__One_Off_Charge__c')) {
				_data.oneOff = +iter.cspmb__One_Off_Charge__c;
			}
			return { ...acc, [iter.Id]: _data };
		},
		{}
	);

	_commercialProducts.forEach(cp => {
		if (cp._rateCards && cp._rateCards.length && rcl_codes.length) {
			// rcl is nested inside rc, flatten this structure to avoid nested loop
			let _rateCardLines = cp._rateCards.reduce(
				(acc, iter) => [...acc, ...iter.rateCardLines],
				[]
			);

			_rateCardLines.forEach(rcl => {
				// This will be overriten for every discount code, last one will be applied
				let _negoFormatRcl = null;
				rcl_codes.forEach(rclc => {
					if (rclc.records[rcl.Id]) {
						_negoFormatRcl = {};
						_negoFormatRcl.priceItemId = cp.Id;
						_negoFormatRcl.rateCard = rcl.cspmb__Rate_Card__c;
						_negoFormatRcl.rateCardLine = rcl.Id;
						_negoFormatRcl.value = calculateDiscount(
							rclc.csfamext__discount_type__c,
							rclc.csfamext__rate_value__c,
							rcl.cspmb__rate_value__c
						);
					}
				});
				_negoFormatRcl && _negoArray.push(_negoFormatRcl);
			});
		}

		if (cp._charges.length) {
			// Apply to charges

			cp._charges.forEach(charge => {
				cp_codes.forEach(cpc => {
					if (cpc.records[cp.Id]) {
						let _negoFormatCharge = {};
						_negoFormatCharge.priceItemId = cp.Id;
						_negoFormatCharge.charge = charge.Id;
						_negoFormatCharge.value = {};

						if (
							!!cpc.csfamext__recurring_charge__c &&
							charge.hasOwnProperty('recurring')
						) {
							_negoFormatCharge.value.recurring = calculateDiscount(
								cpc.csfamext__discount_type__c,
								cpc.csfamext__recurring_charge__c,
								charge.recurring
							);
						}

						if (
							!!cpc.csfamext__one_off_charge__c &&
							charge.hasOwnProperty('oneOff')
						) {
							_negoFormatCharge.value.oneOff = calculateDiscount(
								cpc.csfamext__discount_type__c,
								cpc.csfamext__one_off_charge__c,
								charge.oneOff
							);
						}

						_negoArray.push(_negoFormatCharge);
					}
				});
			});
		} else {
			// Apply to product charges
			cp_codes.forEach(cpc => {
				if (cpc.records[cp.Id]) {
					let _negoFormatCp = {};
					_negoFormatCp.priceItemId = cp.Id;
					_negoFormatCp.value = {};

					if (
						!!cpc.csfamext__recurring_charge__c &&
						_originalProductValues[cp.Id].hasOwnProperty('recurring')
					) {
						_negoFormatCp.value.recurring = calculateDiscount(
							cpc.csfamext__discount_type__c,
							cpc.csfamext__recurring_charge__c,
							_originalProductValues[cp.Id].recurring
						);
					}

					if (
						!!cpc.csfamext__one_off_charge__c &&
						_originalProductValues[cp.Id].hasOwnProperty('oneOff')
					) {
						_negoFormatCp.value.oneOff = calculateDiscount(
							cpc.csfamext__discount_type__c,
							cpc.csfamext__one_off_charge__c,
							_originalProductValues[cp.Id].oneOff
						);
					}

					_negoArray.push(_negoFormatCp);
				}
			});
		}
	});
	// Return length of applied groups
	console.log('Discount negotiating:', _negoArray);
	return window.FAM.api
		.negotiate(active_fa.Id, _negoArray)
		.then(r => _negoArray.length);
};

window.FAM.subscribe('onAfterAddProducts', data => {
	return new Promise(async resolve => {
		negotiateDiscountCodesForProducts(data).then(r => {
			window.FAM.api.toast('info', 'Discount codes applied!', '');
			resolve(data);
		});
	});
});

class DiscountCodesTab extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			loading: true,
			selectGroups: [],
			groups: [],
			added: {},
			open: null,
			targetingResults: {}
		};

		this.customSettings = {};

		this.updateSelectListGroups = this.updateSelectListGroups.bind(this);
		this.updateCustomData = this.updateCustomData.bind(this);
		this.onAddGroup = this.onAddGroup.bind(this);
		this.targetRecords = this.targetRecords.bind(this);
		this.blank = '';
		this.activeFa = null;
	}

	componentDidMount() {
		// ***********************************

		let _getGroupsPromise = window.FAM.api
			.performAction(
				'csfamext.DynamicGroupDataProvider',
				'{"method": "getDynamicGroups"}'
			)
			.then(response => {
				let errorFlag = false;

				try {
					response = JSON.parse(decodeEntities(response));
				} catch (err) {
					console.error(
						'Cannot parse response by getDynamicGroups. (response below)'
					);
					console.log(decodeEntities(response));
					errorFlag = true;
				}

				if (!errorFlag) {
					response = response.filter(
						g => g.csfamext__group_type__c === 'Discount Code'
					);

					response = response.map(dg => {
						delete dg.csfamext__logic_components_JSON__c;
						delete dg.attributes;
						return dg;
					});

					return response;
				}
			});
		// ************************************
		let _getCustomSettingsPromise = window.FAM.api
			.performAction(
				'csfamext.DynamicGroupDataProvider',
				'{"method": "getCustomSettings"}'
			)
			.then(response => JSON.parse(decodeEntities(response)))
			.then(response => {
				for (var key in response) {
					response[key] = response[key]
						? response[key].replace(/\s/g, '').split(',')
						: [];
				}
				return response;
			});
		// ************************************

		Promise.all([
			_getCustomSettingsPromise,
			_getGroupsPromise,
			window.FAM.api.getCustomData(ACTIVE_FA.Id)
		]).then(response => {
			this.customSetting = response[0];

			let _response_codes = response[1] || [];
			let _response_data = response[2];

			if (typeof _response_data === 'string' && IsJsonString(_response_data)) {
				_response_data = JSON.parse(_response_data);
			}

			let _needsUpdateFlag = false;

			let _codesMap = {};
			// Enrich the groups
			_response_codes.forEach(group => {
				group.csfamext__one_off_charge__c =
					group.csfamext__one_off_charge__c || 0;
				group.csfamext__recurring_charge__c =
					group.csfamext__recurring_charge__c || 0;
				group.csfamext__rate_value__c = group.csfamext__rate_value__c || 0;

				_codesMap[group.Id] = group;
			});

			let _selectGroups = _response_codes.map(group => {
				return {
					value: group.Id,
					label: group.Name,
					description: group.csfamext__description__c || ''
				};
			});

			let _addedCodes = _response_data.codes || [];

			_addedCodes = _addedCodes.map(dg => {
				delete dg.csfamext__logic_components_JSON__c;
				delete dg.attributes;
				return dg;
			});

			(() => {
				let _preFilterLength = _addedCodes.length;
				// Check if added discount codes are deleted or critically changed
				_addedCodes = _addedCodes.filter(
					dc =>
						_codesMap[dc.Id] &&
						_codesMap[dc.Id].csfamext__group_type__c === 'Discount Code'
				);
				// Check if target object has changed for any added types
				_addedCodes.forEach(dc => {
					dc.csfamext__target_object__c =
						_codesMap[dc.Id].csfamext__target_object__c;
				});

				if (_addedCodes.length !== _preFilterLength) {
					console.warn('Some codes have been discarded or changed!');
					_needsUpdateFlag = true;
				}
			})();

			let _addedMap = _addedCodes.reduce(
				(acc, iter) => ({ ...acc, [iter.Id]: iter }),
				{}
			);

			// reject groups that are already added from select options
			_selectGroups = _selectGroups.filter(group => {
				return !_addedMap.hasOwnProperty(group.value);
			});

			this.setState(
				{
					...this.state,
					loading: false,
					selectGroups: _selectGroups,
					groups: _response_codes,
					added: _addedMap
				},
				() => {
					if (_needsUpdateFlag) {
						console.log(this.state);
						this.updateCustomData(true);
					}
				}
			);
		});
		// ****************************
	}

	componentDidUpdate(prevProps, prevState) {
		if (
			this.state.open &&
			this.state.added[this.state.open] &&
			prevState.open !== this.state.open
		) {
			if (
				!this.state.targetingResults.hasOwnProperty([
					this.state.added[this.state.open].Id
				])
			) {
				this.targetRecords();
			}
		}
	}

	getTargetRecords(fromCode, whereClause) {
		return new Promise(resolve => {
			let _params = {};
			_params.method = 'executeQuery';
			_params.whereClause = whereClause;
			_params.fromCode = fromCode;

			window.FAM.api
				.performAction(
					'csfamext.DynamicGroupDataProvider',
					JSON.stringify(_params)
				)
				.then(response => {
					return JSON.parse(decodeEntities(response));
				})
				.then(
					response => {
						if (response.hasOwnProperty('error')) {
							let _errArr = response.error.split(': ');
							let _errTitle = _errArr.splice(0, 1);
							let _errBody = _errArr.join(': ');

							window.FAM.api.toast('error', _errTitle, _errBody, 8000);
						}

						response.results = response.results || [];

						let _results = response.results.map(cp => {
							let _cp = JSON.parse(JSON.stringify(cp));
							delete _cp.attributes;
							return _cp;
						});

						resolve(_results);
					},
					error => {}
				);
		});
	}

	targetRecords() {
		let fromCode = getTargetObjectCode(
			this.state.added[this.state.open].csfamext__target_object__c
		);

		this.getTargetRecords(
			fromCode,
			this.state.added[this.state.open].csfamext__expression__c
		).then(response => {
			this.setState({
				targetingResults: {
					...this.state.targetingResults,
					[this.state.added[this.state.open].Id]: response
				}
			});
		});
	}

	onAddGroup(selected_group) {
		// Find group
		let _group = this.state.groups.find(
			group => group.Id === selected_group.value
		);

		_group.records = {};

		let fromCode = getTargetObjectCode(_group.csfamext__target_object__c);

		this.getTargetRecords(fromCode, _group.csfamext__expression__c).then(
			response => {
				//apply records
				response.forEach(target => {
					_group.records[target.Id] = target.Id;
				});

				this.setState(
					{
						added: { ...this.state.added, [_group.Id]: _group },
						targetingResults: {
							...this.state.targetingResults,
							[_group.Id]: response
						}
					},
					() => {
						this.blank = '';
						this.updateSelectListGroups();
						this.updateCustomData().then(response => {
							// negotiateDiscountCodesForProducts().then(r => {
							// 	window.FAM.api.toast(
							// 		'info',
							// 		'Discount codes',
							// 		'applied to ' + Object.keys(_group.records).length + ' items!'
							// 	);
							// });
						});
					}
				);
			}
		);
	}

	onApplyCodes() {
		negotiateDiscountCodesForProducts().then(r => {
			window.FAM.api.toast('info', 'Discount codes applied!', '');
		});
	}

	onRemoveGroup(removed_group) {
		let _added = this.state.added;
		delete _added[removed_group.Id];

		this.setState(
			{
				added: _added
			},
			() => {
				this.blank = '';
				this.updateSelectListGroups();
				this.updateCustomData().then(response => {
					negotiateDiscountCodesForProducts(null, removed_group);
				});
			}
		);
	}

	updateSelectListGroups() {
		this.setState({
			selectGroups: this.state.groups
				.filter(group => {
					return !this.state.added[group.Id];
				})
				.map(group => ({
					value: group.Id,
					label: group.Name,
					description: group.csfamext__description__c
				}))
		});
	}

	onChangeDiscount(groupId, type, value) {
		this.setState(
			{
				added: {
					...this.state.added,
					[groupId]: { ...this.state.added[groupId], [type]: value }
				}
			},
			this.updateCustomData
		);
	}

	async updateCustomData(enforceSave) {
		let customData = await window.FAM.api.getCustomData(ACTIVE_FA.Id);

		if (typeof customData === 'string' && IsJsonString(customData)) {
			customData = JSON.parse(customData);
		}

		customData = customData === '' ? {} : customData;
		customData.codes = Object.values(this.state.added);

		let setResponse = await window.FAM.api.setCustomData(
			ACTIVE_FA.Id,
			customData
		);
		console.log('Custom data saved:', this.state);
		if (enforceSave) {
			return window.FAM.api.saveFrameAgreement(ACTIVE_FA.Id);
		} else {
			return Promise.resolve();
		}
	}

	render() {
		let _active = this.state.added[this.state.open];

		if (this.state.loading) {
			return <CommercialProductSkeleton count={1} />;
		}

		return (
			<div id="dynamic-group-tab" className="card products-card">
				<div className="products-card__inner">
					<div className="products-card__header">
						<span className="products__title">Dynamic groups</span>
						<div className="header__inputs">
							<Select
								className="dg-select"
								placeholder="Add group..."
								value={this.blank}
								options={this.state.selectGroups}
								onChange={this.onAddGroup}
								formatOptionLabel={CustomOption}
								filterOption={filterOptions}
							/>
						</div>
					</div>

					<div className="product-card__container commercial-product-container-bare product-card__container--header">
						<div className="container__header">
							<div className="container__fields">
								<span className="list-cell">Group name</span>
								{this.customSetting.dynamic_group_fields.map(f => {
									return (
										<div key={f} className="list-cell">
											<span>{truncateCPField(f)}</span>
										</div>
									);
								})}
							</div>
						</div>
					</div>

					{Object.values(this.state.added).map(group => (
						<div
							className={
								'product-card__container' +
								(this.state.open === group.Id ? ' product-open' : '')
							}
							key={group.Id}
						>
							<div
								className="container__header"
								onClick={() => {
									this.setState({
										open: this.state.open === group.Id ? null : group.Id
									});
								}}
							>
								<div className="container__fields">
									<div className="fields__item fields__item--title">
										{group.Name}
									</div>
									{this.customSetting.dynamic_group_fields.map(f => {
										return (
											<div key={f} className="fields__item">
												<span>
													{group.hasOwnProperty(f) ? group[f].toString() : '-'}
												</span>
											</div>
										);
									})}
								</div>
								<div
									className="container__checkbox"
									onClick={e => {
										e.preventDefault();
										return this.onRemoveGroup(group);
									}}
								>
									<Icon name="delete" height="14" width="14" color="#0070d2" />
								</div>
							</div>

							{this.state.open === group.Id ? (
								<div className="commercial-product-body">
									<div className="tab-body-left">
										{group.csfamext__expression__c ? (
											<div className="input-box big">
												<label className="dg-label">Expression</label>
												<div className="">
													<pre>{group.csfamext__expression__c}</pre>
												</div>
											</div>
										) : null}

										<div className="input-box big dynamic-group-discounts">
											<div>
												<label>Discount type</label>
												<select
													value={group.csfamext__discount_type__c}
													placeholder="Add Dynamic Group"
													disabled
												>
													<option value="">--none</option>
													<option value={'Amount'}>Amount</option>
													<option value={'Percentage'}>Percentage</option>
												</select>
											</div>

											{group.csfamext__target_object__c ===
											'Commercial Product' ? (
												<React.Fragment>
													<div>
														<label>One-Off charge</label>
														<DebounceInput
															debounceTimeout={300}
															spellCheck="false"
															className=""
															type="number"
															onChange={e => {
																this.onChangeDiscount(
																	group.Id,
																	'csfamext__one_off_charge__c',
																	+e.target.value
																);
															}}
															value={group.csfamext__one_off_charge__c}
														/>
													</div>

													<div>
														<label>Recurring charge</label>
														<DebounceInput
															debounceTimeout={300}
															spellCheck="false"
															className=""
															type="number"
															onChange={e => {
																this.onChangeDiscount(
																	group.Id,
																	'csfamext__recurring_charge__c',
																	+e.target.value
																);
															}}
															value={group.csfamext__recurring_charge__c}
														/>
													</div>
												</React.Fragment>
											) : (
												''
											)}

											{group.csfamext__target_object__c === 'Rate Card Line' ? (
												<div>
													<label>Value</label>
													<DebounceInput
														debounceTimeout={300}
														spellCheck="false"
														className=""
														type="number"
														onChange={e => {
															this.onChangeDiscount(
																group.Id,
																'csfamext__rate_value__c',
																+e.target.value
															);
														}}
														value={group.csfamext__rate_value__c}
													/>
												</div>
											) : (
												''
											)}
										</div>
									</div>
									<div className="tab-body-right">
										{this.state.targetingResults[
											this.state.added[this.state.open].Id
										] ? (
											<DGTargets
												results={
													this.state.targetingResults[
														this.state.added[this.state.open].Id
													]
												}
												fields={
													this.customSetting[
														_active.csfamext__target_object__c ===
														'Commercial Product'
															? 'price_item_fields'
															: 'rcl_fields'
													]
												}
												onTest={this.targetRecords}
											/>
										) : (
											''
										)}
									</div>
								</div>
							) : null}
						</div>
					))}
				</div>
				{Object.values(this.state.added).length ? (
					<div className="discount-codes-footer">
						<button
							className="fa-button fa-button--brand"
							onClick={() => this.onApplyCodes()}
						>
							Apply
						</button>
					</div>
				) : null}
			</div>
		);
	}
}

function initialiseDiscountCodesTab(id) {
	ReactDOM.render(<DiscountCodesTab />, document.getElementById(id));
}

window.FAM.subscribe('onLoad', data => {
	return new Promise(resolve => {
		window.FAM.registerMethod('discountCodesTabEnter', id => {
			return new Promise(async resolve => {
				ACTIVE_FA = await window.FAM.api.getActiveFrameAgreement();
				console.log('Entered tab with id:' + id);
				initialiseDiscountCodesTab(id);
				resolve();
			});
		});
		resolve(data);
	});
});

window.FAM.subscribe('onFaSelect', data => {
	return new Promise(resolve => {
		negotiateDiscountCodesForProducts().then(r => {
			r &&
				window.FAM.api.toast(
					'info',
					'Discount codes',
					'applied to ' + r + ' items!'
				);
		});
		resolve(data);
	});
});

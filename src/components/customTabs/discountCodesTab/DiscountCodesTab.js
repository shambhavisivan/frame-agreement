import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import { DebounceInput } from 'react-debounce-input';
import Select from 'react-select';

import {
	decodeEntities,
	log,
	validateCSV,
	isJson,
	truncateCPField,
	isDiscountAllowed,
	sortDynamicGroupsBySequence,
	hasValidExpression,
} from '../../../utils/shared-service';

import Icon from '../../utillity/Icon';
import DGTargets from '../utility/DGTargets';

import CommercialProductSkeleton from '../../skeletons/CommercialProductSkeleton';

import { CustomOption, filterOptions } from '../utility/CustomOption';

import '../utility/customTabs.scss';

let ACTIVE_FA = null;

const DEFAULT_DESCRIPTION = '--new dynamic group description';

const SUBSCRIPTIONS = {};

const COMMERCIAL_PRODUCT = 'COMMERCIAL_PRODUCT';
const OFFER = 'OFFER';

const isObjectEmpty = obj => {
	return Object.entries(obj).length === 0 && obj.constructor === Object;
};

const getTargetObjectCode = targetObject => {
	let str;
	if (targetObject === 'Commercial Product') {
		str = 'product';
	} else if (targetObject === 'Rate Card Line') {
		str = 'rcl';
	}

	return str;
};

const isGroupLegacy = group => {
	return (
		!isJson(group.csfamext__expression__c) && typeof group.csfamext__expression__c === 'string'
	);
};

const formatGroup = group => {
	if (isJson(group.csfamext__expression__c)) {
		group.csfamext__expression__c = JSON.parse(group.csfamext__expression__c);
	} else if (typeof group.csfamext__expression__c === 'string') {
		group.csfamext__expression__c = {
			[getTargetObjectCode(group.csfamext__target_object__c)]: group.csfamext__expression__c,
		};
	}

	return group;
};

const getLabel = field =>
	window.SF.fieldLabels.csfamext__Dynamic_Group__c.hasOwnProperty(field)
		? window.SF.fieldLabels.csfamext__Dynamic_Group__c[field]
		: truncateCPField(field);

const getPicklistLabel = field =>
	window.SF.customPicklistLabels.hasOwnProperty(field)
		? window.SF.customPicklistLabels[field]
		: null;

function calculateDiscount(type, discount, original) {
	/*
		Used to calculate discount based on
		a) 2type (absolute/percentage)
		b) discount (value)
		c) original (value of charge)
	*/
	let result;
	let facSettings = redux_store.getState().settings.FACSettings;
	if (type === 'Amount') {
		result = original - discount;
	} else {
		result = original - (original * discount) / 100;
	}

	/*
		if restriction is enabled or if it's based on percentage
		ignore discounts that result in negative values or values
		greater than the original values
	*/
	if (facSettings.input_minmax_restriction || type === 'Percentage') {
		return (result < 0 || result > original) ? original : result;
	}

	return result;
}

async function negotiateData(data, active_fa, removed_group) {
    let _negoArray = [];

	let discountCodes = await window.FAM.api.getCustomData(active_fa.Id);

	discountCodes = discountCodes.codes || [];

	if (removed_group) {
		await window.FAM.api.resetNegotiation(active_fa.Id, removed_group.records);
		window.FAM.api.saveFrameAgreement(active_fa.Id);
		await window.FAM.publish('DCE_onAfterRemoveCodes', discountCodes);
		// log.bg.red('---NEGOTIATION RESET');
	}

	if (!discountCodes.length) {
		// WE'RE DONE HERE
		return _negoArray;
	}

	discountCodes.sort(sortDynamicGroupsBySequence);

	// window.FAM.api.resetNegotiation(active_fa.Id);
	// log.bg.red('---NEGOTIATION RESET');

	// Group codes by target to avoid wasteful looping
	let both_codes = discountCodes.filter(dc => dc.csfamext__target_object__c === 'Both');

	let rcl_codes = discountCodes.filter(dc => dc.csfamext__target_object__c === 'Rate Card Line');

	let cp_codes = discountCodes.filter(dc => dc.csfamext__target_object__c === 'Commercial Product');

	rcl_codes = [...rcl_codes, ...both_codes];
	cp_codes = [...cp_codes, ...both_codes];

	let targeted_cp = new Set(
		discountCodes.reduce((acc, iter) => {
			return [...acc, ...Object.keys(iter.records.product || {})];
		}, [])
	);

	// Generate map of original charges for product
	let _originalProductValues = active_fa._ui.commercialProducts
		.concat(active_fa._ui.offers)
		.reduce((acc, iter) => {
			let _data = {};

			if (iter._charges.length) {
				iter._charges.forEach((c) => {
					_data[c._type] = c[c._type];
				});
			} else {
				if (iter.hasOwnProperty("cspmb__Recurring_Charge__c")) {
					_data.recurring = +iter.cspmb__Recurring_Charge__c;
				}

				if (iter.hasOwnProperty("cspmb__One_Off_Charge__c")) {
					_data.oneOff = +iter.cspmb__One_Off_Charge__c;
				}
			}

			return { ...acc, [iter.Id]: _data };
		}, {});

	data.forEach(cp => {
		if (rcl_codes.length && cp._rateCards?.length) {
			// rcl is nested inside rc, flatten this structure to avoid nested loop
			let _rateCardLines = cp._rateCards.reduce((acc, iter) => [...acc, ...iter.rateCardLines], []);

			_rateCardLines.forEach(rcl => {
				let _value = rcl.cspmb__rate_value__c;

				rcl_codes.forEach(rclc => {
					if (rclc.records.rcl[rcl.Id]) {
						_value = calculateDiscount(
							rclc.csfamext__discount_type__c,
							rclc.csfamext__rate_value__c,
							_value
						);

						_negoArray.push({
							priceItemId: cp.Id,
							rateCard: rcl.cspmb__Rate_Card__c,
							rateCardLine: rcl.Id,
							value: _value,
						});
					}
				});
			});
		}

		// Looping all CP is only done for RCL
		// there is no need for the rest of this scope
		// if cp is not targeted by dc

		if (!targeted_cp.has(cp.Id)) {
			return; // skip iteration
		}

		if (cp._charges.length) {
			// Apply to charges

			cp._charges.forEach(charge => {
				let _recurring = charge.recurring;
				let _oneOff = charge.oneOff;

				cp_codes.forEach(cpc => {
					if (cpc.records.product[cp.Id]) {
						if (
							cpc.hasOwnProperty('csfamext__recurring_charge__c') &&
							charge.hasOwnProperty('recurring') &&
							isDiscountAllowed('recurring', cp)
						) {
							_recurring = calculateDiscount(
								cpc.csfamext__discount_type__c,
								cpc.csfamext__recurring_charge__c,
								_recurring
							);
						}

						if (
							cpc.hasOwnProperty('csfamext__one_off_charge__c') &&
							charge.hasOwnProperty('oneOff') &&
							isDiscountAllowed('oneOff', cp)
						) {
							_oneOff = calculateDiscount(
								cpc.csfamext__discount_type__c,
								cpc.csfamext__one_off_charge__c,
								_oneOff
							);
						}
					}
				});

				let _negoFormatCharge = {};
				_negoFormatCharge.priceItemId = cp.Id;
				_negoFormatCharge.charge = charge.Id;
				_negoFormatCharge.value = {};

				if (_recurring !== undefined) {
					_negoFormatCharge.value.recurring = _recurring;
				}

				if (_oneOff !== undefined) {
					_negoFormatCharge.value.oneOff = _oneOff;
				}

				if (Object.keys(_negoFormatCharge.value).length) {
					_negoArray.push(_negoFormatCharge);
				}
			});
		} else {
			// Apply to product charges
			let _recurring = _originalProductValues[cp.Id].recurring;
			let _oneOff = _originalProductValues[cp.Id].oneOff;

			cp_codes
				.filter(cpc => cpc.records.product.hasOwnProperty(cp.Id))
				.forEach(cpc => {
					if (
						!!cpc.hasOwnProperty('csfamext__recurring_charge__c') &&
						_originalProductValues[cp.Id].hasOwnProperty('recurring') &&
						isDiscountAllowed('recurring', cp)
					) {
						_recurring = calculateDiscount(
							cpc.csfamext__discount_type__c,
							cpc.csfamext__recurring_charge__c,
							_recurring
						);
					}

					if (
						!!cpc.hasOwnProperty('csfamext__one_off_charge__c') &&
						_originalProductValues[cp.Id].hasOwnProperty('oneOff') &&
						isDiscountAllowed('oneOff', cp)
					) {
						_oneOff = calculateDiscount(
							cpc.csfamext__discount_type__c,
							cpc.csfamext__one_off_charge__c,
							_oneOff
						);
					}
				});

			let _negoFormatCp = {};
			_negoFormatCp.priceItemId = cp.Id;
			_negoFormatCp.value = {};

			if (_recurring !== undefined) {
				_negoFormatCp.value.recurring = _recurring;
			}

			if (_oneOff !== undefined) {
				_negoFormatCp.value.oneOff = _oneOff;
			}

			if (Object.keys(_negoFormatCp.value).length) {
				_negoArray.push(_negoFormatCp);
			}
		}
	});

	return _negoArray;
}

const negotiateDiscountCodesForItems = async (data, removed_group, type = COMMERCIAL_PRODUCT) => {
	let cpsOrOffers;
	let active_fa = await window.FAM.api.getActiveFrameAgreement();

	if (!data) {
		cpsOrOffers =
			type === COMMERCIAL_PRODUCT
				? active_fa._ui.commercialProducts
				: active_fa._ui.offers;
	} else {
		cpsOrOffers =
			type === COMMERCIAL_PRODUCT
				? active_fa._ui.commercialProducts.filter((cp) =>
						data.includes(cp.Id)
				  )
				: active_fa._ui.offers.filter((offer) =>
						data.includes(offer.Id)
				);
	}

	// Will hold negotiation API compliant structure
	const _negoArray = await negotiateData(cpsOrOffers, active_fa, removed_group);
	if (type === COMMERCIAL_PRODUCT) {
		await window.FAM.api.negotiate(active_fa.Id, _negoArray);
	} else if (type === OFFER) {
		await window.FAM.api.negotiateOffers(active_fa.Id, _negoArray);
	}

	await window.FAM.api.saveFrameAgreement(active_fa.Id);

	return _negoArray.length;
};

//TODO: change this implementation when merging FAM and FAM-EXT
let addedCps;
let addedOffers;
setTimeout(() => {
	window.FAM.subscribe('onBeforeAddProducts', data => {
		return new Promise(resolve => {
			addedCps = data
			resolve(data);
		});
	});

	window.FAM.subscribe('onBeforeAddOffers', data => {
		return new Promise(resolve => {
			addedOffers = data
			resolve(data);
		});
	});
}, 0);

window.FAM.subscribe('onAfterAddProducts', data => {
	return new Promise(async resolve => {
		negotiateDiscountCodesForItems(addedCps).then(r => {
			// resolves length of impacted entitites
			r && window.FAM.api.toast('info', window.SF.labels.famext_toast_dc_applied, '');
			resolve(data);
		});
	});
});

window.FAM.subscribe('onAfterAddOffers', data => {
	return new Promise(async resolve => {
		negotiateDiscountCodesForItems(addedOffers, null, OFFER).then(r => {
			// resolves length of impacted entitites
			r && window.FAM.api.toast('info', window.SF.labels.famext_toast_dc_applied, '');
			resolve(data);
		});
	});
})

class DiscountCodesTab extends React.Component {
	constructor(props, context) {
		super(props, context);

		let _facSettings = redux_store.getState().settings.FACSettings;

		this.state = {
			loading: true,
			currentTarget: 'product', // Which target is being tested
			availableGroups: [], // For dropdown
			groups: [], // groups from RM
			editable: _facSettings.fa_editable_statuses.has(ACTIVE_FA.csconta__Status__c),
			added: {}, // added groups, loaded from CustomSettings
			minmax_res: _facSettings.input_minmax_restriction,
			unapplied: [],
			open: null, // open group
			targetingResults: {}, // results for a group
		};

		this.customSetting = {};

		this.updateSelectListGroups = this.updateSelectListGroups.bind(this);
		this.updateCustomData = this.updateCustomData.bind(this);
		this.loadRecordsForDg = this.loadRecordsForDg.bind(this);
		this.getMinMax = this.getMinMax.bind(this);
		this.onAddGroup = this.onAddGroup.bind(this);
		this.blank = '';

		window.dcscope = this;
	}

	componentDidMount() {
		if (SUBSCRIPTIONS['onBeforeSaveFrameAgreement']) {
			const { unsubscribe } = SUBSCRIPTIONS['onBeforeSaveFrameAgreement'];
			typeof unsubscribe === 'function' && unsubscribe();
		}

		SUBSCRIPTIONS['onBeforeSaveFrameAgreement'] = window.FAM.subscribe('onBeforeSaveFrameAgreement', data => {
			return new Promise(async resolve => {
				if (this.state.unapplied.length) {
					window.FAM.api.toast(
						'warning',
						window.SF.labels.famext_toast_dc_appliance_warning_title,
						window.SF.labels.famext_toast_dc_appliance_warning_message
					);
				}

				resolve(data);
			});
		});

		let _getGroupsPromise = window.FAM.api
			.performAction('csfamext.DynamicGroupDataProvider', '{"method": "getDynamicGroups"}')
			.then(response => {
				let errorFlag = false;

				try {
					response = JSON.parse(decodeEntities(response));
				} catch (err) {
					console.error('Cannot parse response by getDynamicGroups. (response below)');
					console.log(decodeEntities(response));
					errorFlag = true;
				}

				if (!errorFlag) {
					response = response.filter(g => {
						return (
							g.csfamext__group_type__c === "Discount Code" &&
							hasValidExpression(g)
						);
					});

					let _legacyCheck = false;

					response = response.map(dg => {
						delete dg.csfamext__logic_components_JSON__c;
						delete dg.attributes;
						_legacyCheck = isGroupLegacy(dg);
						return formatGroup(dg);
					});

					if (_legacyCheck) {
						window.FAM.api.toast(
							'info',
							'Legacy group detected!',
							'Please launch DGManager to auto-convert dynamic groups.'
						);
					}

					return response;
				}
			});
		// ************************************
		let _getCustomSettingsPromise = window.FAM.api
			.performAction('csfamext.DynamicGroupDataProvider', '{"method": "getCustomSettings"}')
			.then(response => JSON.parse(decodeEntities(response)))
			.then(response => {
				response.rcl_fields = validateCSV(response.rcl_fields)
					? response.rcl_fields.replace(/\s/g, '').split(',')
					: [];
				response.price_item_fields = validateCSV(response.price_item_fields)
					? response.price_item_fields.replace(/\s/g, '').split(',')
					: [];
				response.dynamic_group_fields = validateCSV(response.dynamic_group_fields)
					? response.dynamic_group_fields.replace(/\s/g, '').split(',')
					: [];
				// response.universal_discount_fields
				return response;
			});
		// ************************************

		Promise.all([
			_getCustomSettingsPromise,
			_getGroupsPromise,
			window.FAM.api.getCustomData(ACTIVE_FA.Id),
		]).then(async response => {
			let _customPicklistLabels = response[0].picklist_values || {};
			window.SF.customPicklistLabels = window.SF.customPicklistLabels || {};
			window.SF.customPicklistLabels = {
				...window.SF.customPicklistLabels,
				..._customPicklistLabels,
			};

			this.customSetting = response[0];

			let _response_codes = response[1] || [];
			let _response_data = response[2];

			_response_codes = await window.FAM.publish('DCE_onLoadDiscountCodes', _response_codes);

			if (typeof _response_data === 'string' && isJson(_response_data)) {
				_response_data = JSON.parse(_response_data);
			}

			let _needsUpdateFlag = false;

			let _codesMap = {};
			// Enrich the groups
			_response_codes
				.sort(sortDynamicGroupsBySequence)
				.forEach((group) => {
					group.csfamext__one_off_charge__c = group.csfamext__one_off_charge__c || 0;
					group.csfamext__recurring_charge__c = group.csfamext__recurring_charge__c || 0;
					group.csfamext__rate_value__c = group.csfamext__rate_value__c || 0;

					_codesMap[group.Id] = group;
				});

			let _availableGroups = _response_codes.map(group => {
				return {
					value: group.Id,
					label: group.Name,
					description: group.csfamext__description__c || '',
				};
			});

			let _addedCodes = _response_data.codes || [];

			_addedCodes = _addedCodes.map(dg => {
				let _target = getTargetObjectCode(dg.csfamext__target_object__c);

				if (isJson(dg.csfamext__expression__c)) {
					dg.csfamext__expression__c = JSON.parse(dg.csfamext__expression__c);
				} else if (typeof dg.csfamext__expression__c === 'string') {
					_needsUpdateFlag = true;

					dg.csfamext__expression__c = {
						[_target]: dg.csfamext__expression__c,
					};
				}

				if (!(dg.records.hasOwnProperty('rcl') || dg.records.hasOwnProperty('product'))) {
					if (_target) {
						dg.records = {
							[_target]: dg.records,
						};
					} else {
						dg.records = {
							rcl: {},
							product: {},
						};
					}
				}

				delete dg.csfamext__logic_components_JSON__c;
				delete dg.attributes;
				return dg;
			});

			(() => {
				let _preFilterLength = _addedCodes.length;
				// Check if added discount codes are deleted or critically changed
				_addedCodes = _addedCodes.filter(
					dc => _codesMap[dc.Id] && _codesMap[dc.Id].csfamext__group_type__c === 'Discount Code'
				);
				// Check if target object has changed for any added types
				_addedCodes.forEach(dc => {
					dc.csfamext__target_object__c = _codesMap[dc.Id].csfamext__target_object__c;
				});

				if (_addedCodes.length !== _preFilterLength) {
					console.warn('Some codes have been discarded or changed!');
					_needsUpdateFlag = true;
				}
			})();

			let _addedMap = _addedCodes.reduce((acc, iter) => ({ ...acc, [iter.Id]: iter }), {});

			// reject groups that are already added from select options
			_availableGroups = _availableGroups.filter(group => {
				return !_addedMap.hasOwnProperty(group.value);
			});

			this.setState(
				{
					...this.state,
					loading: false,
					availableGroups: _availableGroups,
					groups: _response_codes,
					added: _addedMap,
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
		let _editable = window.FAM.api.isAgreementEditable(ACTIVE_FA.Id);

		if (_editable !== this.state.editable) {
			this.setState({ editable: _editable });
		}
	}

	getTargetRecords(fromCode, whereClause) {
		return new Promise(resolve => {
			let _params = {};
			_params.method = 'executeQuery';
			_params.whereClause = whereClause;
			_params.fromCode = fromCode;

			window.FAM.api
				.performAction('csfamext.DynamicGroupDataProvider', JSON.stringify(_params))
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

						let _results = response.results.map(record => {
							let _record = JSON.parse(JSON.stringify(record));
							delete _record.attributes;
							return _record;
						});

						resolve(_results);
					},
					error => {}
				);
		});
	}

	async loadRecordsForDg(dgId, overrideFromCode) {
		function convertRecordsToMap(arr) {
			return arr.reduce((acc, iter) => {
				return { ...acc, [iter.Id]: iter };
			}, {});
		}

		let _dg = this.state.added[dgId];
		let _recordObj = {};

		let fromCode = overrideFromCode || getTargetObjectCode(_dg.csfamext__target_object__c);

		if (!fromCode) {
			let response = await Promise.all([
				this.getTargetRecords('product', _dg.csfamext__expression__c['product']),
				this.getTargetRecords('rcl', _dg.csfamext__expression__c['rcl']),
			]);

			_recordObj = {
				product: convertRecordsToMap(response[0]),
				rcl: convertRecordsToMap(response[1]),
			};
		} else {
			let response = await this.getTargetRecords(fromCode, _dg.csfamext__expression__c[fromCode]);
			_recordObj = { [fromCode]: convertRecordsToMap(response) };
		}

		this.setState({
			currentTarget: fromCode,
			added: {
				...this.state.added,
				[dgId]: {
					...this.state.added[dgId],
					records: { ...this.state.added[dgId].records, ..._recordObj },
				},
			},
		});

		return _recordObj;
	}

	onAddGroup(selected_group) {
		// Find group
		let _group = this.state.groups.find(group => group.Id === selected_group.value);

		this.setState(
			{
				added: { ...this.state.added, [_group.Id]: _group },
				unapplied: [...this.state.unapplied, _group.Id],
			},
			() => {
				this.blank = '';
				this.updateSelectListGroups();
				this.loadRecordsForDg(_group.Id);
			}
		);
	}
	async onApplyCodes() {
		let res = await window.FAM.publish('DCE_onBeforeApplyCodes', Object.values(this.state.added));

		if (res === null) {
			return;
		}

		await this.updateCustomData();

		Promise.all([
			negotiateDiscountCodesForItems(),
			negotiateDiscountCodesForItems(null, null, OFFER)
		]).then(negotiatedResults => {
			if (negotiatedResults.some(result => result)) {
				window.FAM.api.toast('info', window.SF.labels.famext_toast_dc_applied, '');
				window.FAM.publish('DCE_onApplyCodes', Object.values(this.state.added));
			}
		});
	}

	async onRemoveGroup(removed_group) {
		await window.FAM.publish('DCE_onBeforeRemoveCodes', removed_group);

		let _added = this.state.added;
		delete _added[removed_group.Id];

		this.setState(
			{
				added: _added,
				unapplied: this.state.unapplied.filter(g => g !== removed_group.Id),
				open: this.state.open === removed_group.Id ? null : this.state.open,
			},
			() => {
				this.blank = '';
				this.updateSelectListGroups();
				this.updateCustomData().then(response => {
					negotiateDiscountCodesForItems(null, removed_group);
					negotiateDiscountCodesForItems(null, removed_group, OFFER);
				});
			}
		);
	}

	updateSelectListGroups() {
		this.setState({
			availableGroups: this.state.groups
				.filter(group => {
					return !this.state.added[group.Id];
				})
				.map(group => ({
					value: group.Id,
					label: group.Name,
					description: group.csfamext__description__c,
				})),
		});
	}

	onChangeDiscount(groupId, type, value) {
		let _active = this.state.added[groupId];

		let revertChange = () => {
			this.setState({
				added: {
					...this.state.added,
					[groupId]: { ...this.state.added[groupId], [type]: this.state.added[groupId][type] },
				},
			});
		};

		if (this.state.minmax_res) {
			if (value < 0) {
				revertChange();
				return;
			}

			if (_active.csfamext__discount_type__c === 'Percentage' && value > 100) {
				revertChange();
				return;
			}
		}

		this.setState({
			added: {
				...this.state.added,
				[groupId]: { ...this.state.added[groupId], [type]: value },
			},
		});
	}

	onChangeDiscountType(groupId, value) {
		let isChanged = value !== this.state.added[groupId].csfamext__discount_type__c;

		this.setState(
			{
				added: {
					...this.state.added,
					[groupId]: { ...this.state.added[groupId], csfamext__discount_type__c: value },
				},
			},
			() => {
				if (!isChanged || !this.state.minmax_res) {
					return;
				}
				// Negotiation type has changed and we need to ensure that restrict min/max is still persisted
				let _group = this.state.added[groupId];
				// Reset previous value changes
				let _groupTarget = _group.csfamext__target_object__c;
				let _resetObj = {};

				if (_group.csfamext__target_object__c === 'Both') {
					_resetObj = {
						csfamext__rate_value__c: 0,
						csfamext__one_off_charge__c: 0,
						csfamext__recurring_charge__c: 0,
					};
				} else if (_group.csfamext__target_object__c === 'Commercial Product') {
					_resetObj = { csfamext__one_off_charge__c: 0, csfamext__recurring_charge__c: 0 };
				} else {
					_resetObj = { csfamext__rate_value__c: 0 };
				}

				this.setState({
					added: {
						...this.state.added,
						[groupId]: { ...this.state.added[groupId], ..._resetObj },
					},
				});
			}
		);
	}

	getMinMax(discType) {
		let min = null,
			max = null;

		if (this.state.minmax_res) {
			min = 0;
			if (discType === 'Percentage') {
				max = 100;
			}
		}

		return { min, max };
	}

	async updateCustomData(enforceSave) {
		let customData = await window.FAM.api.getCustomData(ACTIVE_FA.Id);

		if (typeof customData === 'string' && isJson(customData)) {
			customData = JSON.parse(customData);
		}

		customData = customData === '' ? {} : customData;
		customData.codes = Object.values(this.state.added).sort(
			sortDynamicGroupsBySequence
		);

		let setResponse = await window.FAM.api.setCustomData(ACTIVE_FA.Id, customData);

		this.setState({
			unapplied: [],
		});

		console.log('Custom data saved:', this.state);
		if (enforceSave) {
			window.FAM.api.saveFrameAgreement(ACTIVE_FA.Id);
		}

		return customData;
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
								isDisabled={!this.state.editable}
								placeholder="Add code..."
								value={this.blank}
								options={this.state.availableGroups}
								onChange={this.onAddGroup}
								formatOptionLabel={CustomOption}
								filterOption={filterOptions}
							/>
						</div>
					</div>

					<div className="product-card__container commercial-product-container-bare product-card__container--header">
						<div className="container__header">
							<div className="container__fields">
								<span className="list-cell">
									{getLabel("name")}
								</span>
								{this.customSetting.dynamic_group_fields.map(
									(f) => {
										return (
											<div key={f} className="list-cell">
												<span>{getLabel(f)}</span>
											</div>
										);
									}
								)}
							</div>
						</div>
					</div>

					{Object.values(this.state.added)
						.sort(sortDynamicGroupsBySequence)
						.map((group) => (
							<div
								className={
									"product-card__container" +
									(this.state.open === group.Id
										? " product-open"
										: "")
								}
								key={group.Id}
							>
								<div
									className="container__header"
									onClick={() => {
										this.setState({
											open:
												this.state.open === group.Id
													? null
													: group.Id,
										});
									}}
								>
									<div className="container__fields">
										<div className="fields__item fields__item--title">
											{group.Name}
										</div>
										{this.customSetting.dynamic_group_fields.map(
											(f) => {
												let _fieldLabel = "-";
												if (group.hasOwnProperty(f)) {
													if (getPicklistLabel(f)) {
														_fieldLabel = getPicklistLabel(
															f
														)[group[f]];
													} else {
														_fieldLabel = group[
															f
														].toString();
													}
												}

												return (
													<div
														key={f}
														className="fields__item"
													>
														<span>
															{_fieldLabel}
														</span>
													</div>
												);
											}
										)}
									</div>

									{this.state.editable ? (
										<div
											className="container__checkbox"
											onClick={(e) => {
												e.preventDefault();
												return this.onRemoveGroup(
													group
												);
											}}
										>
											<Icon
												name="delete"
												height="14"
												width="14"
												color="#0070d2"
											/>
										</div>
									) : null}
								</div>

								{this.state.open === group.Id &&
								_active.records ? (
									<div className="commercial-product-body">
										<div className="tab-body-left">
											<div className="input-box big dynamic-group-discounts">
												<div>
													<label>Discount type</label>
													<select
														value={
															group.csfamext__discount_type__c
														}
														placeholder="Add Dynamic Group"
														disabled={
															!this.state
																.editable ||
															!group.csfamext__fam_editable__c
														}
														onChange={(e) => {
															this.onChangeDiscountType(
																group.Id,
																e.target.value
															);
														}}
													>
														<option value="">
															{
																window.SF.labels
																	.fa_none
															}
														</option>
														<option
															value={"Amount"}
														>
															{
																window.SF
																	.customPicklistLabels
																	.csfamext__discount_type__c
																	.Amount
															}
														</option>
														<option
															value={"Percentage"}
														>
															{
																window.SF
																	.customPicklistLabels
																	.csfamext__discount_type__c
																	.Percentage
															}
														</option>
													</select>
												</div>

												{group.csfamext__target_object__c ===
													"Commercial Product" ||
												(group.csfamext__target_object__c ===
													"Both" &&
													!this.customSetting
														.universal_discount_fields) ? (
													<React.Fragment>
														<div>
															<label>
																{
																	window.SF
																		.labels
																		.famext_oneOff
																}
															</label>
															<DebounceInput
																debounceTimeout={
																	300
																}
																disabled={
																	!this.state
																		.editable
																}
																spellCheck="false"
																min={
																	this.getMinMax(
																		group.csfamext__discount_type__c
																	).min
																}
																max={
																	this.getMinMax(
																		group.csfamext__discount_type__c
																	).max
																}
																className=""
																type="number"
																onChange={(
																	e
																) => {
																	this.onChangeDiscount(
																		group.Id,
																		"csfamext__one_off_charge__c",
																		+e
																			.target
																			.value
																	);
																}}
																value={
																	group.csfamext__one_off_charge__c
																}
															/>
														</div>

														<div>
															<label>
																Recurring charge
															</label>
															<DebounceInput
																debounceTimeout={
																	300
																}
																disabled={
																	!this.state
																		.editable
																}
																spellCheck="false"
																min={
																	this.getMinMax(
																		group.csfamext__discount_type__c
																	).min
																}
																max={
																	this.getMinMax(
																		group.csfamext__discount_type__c
																	).max
																}
																className=""
																type="number"
																onChange={(
																	e
																) => {
																	this.onChangeDiscount(
																		group.Id,
																		"csfamext__recurring_charge__c",
																		+e
																			.target
																			.value
																	);
																}}
																value={
																	group.csfamext__recurring_charge__c
																}
															/>
														</div>
													</React.Fragment>
												) : (
													""
												)}

												{group.csfamext__target_object__c ===
													"Rate Card Line" ||
												(group.csfamext__target_object__c ===
													"Both" &&
													!this.customSetting
														.universal_discount_fields) ? (
													<div>
														<label>Value</label>
														<DebounceInput
															debounceTimeout={
																300
															}
															spellCheck="false"
															className=""
															min={
																this.getMinMax(
																	group.csfamext__discount_type__c
																).min
															}
															max={
																this.getMinMax(
																	group.csfamext__discount_type__c
																).max
															}
															type="number"
															onChange={(e) => {
																this.onChangeDiscount(
																	group.Id,
																	"csfamext__rate_value__c",
																	+e.target
																		.value
																);
															}}
															value={
																group.csfamext__rate_value__c
															}
														/>
													</div>
												) : (
													""
												)}

												{this.customSetting
													.universal_discount_fields &&
												group.csfamext__target_object__c ===
													"Both" ? (
													<div>
														<label>Discount</label>
														<DebounceInput
															debounceTimeout={
																300
															}
															spellCheck="false"
															className=""
															min={
																this.getMinMax(
																	group.csfamext__discount_type__c
																).min
															}
															max={
																this.getMinMax(
																	group.csfamext__discount_type__c
																).max
															}
															type="number"
															onChange={(e) => {
																this.onChangeDiscount(
																	group.Id,
																	"csfamext__rate_value__c",
																	+e.target
																		.value
																);
																this.onChangeDiscount(
																	group.Id,
																	"csfamext__one_off_charge__c",
																	+e.target
																		.value
																);
																this.onChangeDiscount(
																	group.Id,
																	"csfamext__recurring_charge__c",
																	+e.target
																		.value
																);
															}}
															value={
																group.csfamext__rate_value__c
															}
														/>
													</div>
												) : (
													""
												)}
											</div>
										</div>
										<div className="tab-body-right">
											<DGTargets
												target={getTargetObjectCode(
													_active.csfamext__target_object__c
												)}
												results={_active.records}
												bothEntities={
													_active.csfamext__target_object__c ===
													"Both"
												}
												fields={
													this.customSetting[
														this.state
															.currentTarget ===
														"product"
															? "price_item_fields"
															: "rcl_fields"
													]
												}
												onTest={(target) =>
													this.loadRecordsForDg(
														_active.Id,
														target
													)
												}
											/>
										</div>
									</div>
								) : null}
							</div>
						))}
				</div>
				{Object.values(this.state.added).length ? (
					<div className="discount-codes-footer">
						<button
							disabled={!this.state.editable}
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

				if (!window.SF.fieldLabels.hasOwnProperty('csfamext__Dynamic_Group__c')) {
					window.SF.invokeAction('getFieldLabels', ['csfamext__Dynamic_Group__c']).then(r => {
						window.SF.fieldLabels['csfamext__Dynamic_Group__c'] = r;
					});
				}

				initialiseDiscountCodesTab(id);
				resolve();
			});
		});
		resolve(data);
	});
});

// window.FAM.subscribe('onFaSelect', data => {
// 	return new Promise(resolve => {
// 		negotiateDiscountCodesForProducts().then(r => {
// 			r &&
// 				window.FAM.api.toast(
// 					'info',
// 					'Discount codes',
// 					'applied to ' + r + ' items!'
// 				);
// 		});
// 		resolve(data);
// 	});
// });

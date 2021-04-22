import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import { DebounceInput } from 'react-debounce-input';
import Select from 'react-select';

import {
	decodeEntities,
	getFieldLabel,
	isJson,
	validateCSV,
	makeId,
	truncateCPField,
	sortDynamicGroupsBySequence,
} from '../../../utils/shared-service';
import LogicForm from '../utility/LogicForm';
import Icon from '../../utillity/Icon';
import DGTargets from '../utility/DGTargets';

import CommercialProductSkeleton from '../../skeletons/CommercialProductSkeleton';

import { CustomOption, filterOptions } from '../utility/CustomOption';

import '../utility/customTabs.scss';

const BLANK_CIRCUITS = '{"logic":"","circuits":[]}';
let ACTIVE_FA = null;

const getPicklistLabel = field =>
	window.SF.customPicklistLabels.hasOwnProperty(field)
		? window.SF.customPicklistLabels[field]
		: null;

class DynamicGroupTab extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			loading: true,
			selectGroups: [],
			groups: [],
			added: {},
			editable: window.FAM.api.isAgreementEditable(ACTIVE_FA.Id),
			open: null,
			targetingResults: {},
		};

		this.customSettings = {};

		this.updateSelectListGroups = this.updateSelectListGroups.bind(this);
		this.updateCustomData = this.updateCustomData.bind(this);
		this.onAddGroup = this.onAddGroup.bind(this);
		this.testTargeting = this.testTargeting.bind(this);
		this.blank = '';
	}

	componentDidMount() {
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
					response = response.filter(g => g.csfamext__group_type__c === 'Dynamic Group');
					response = response.map(g => this.processGroup_old(g));
					return response;
				}
			});

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
				return response;
			});

		Promise.all([
			_getCustomSettingsPromise,
			_getGroupsPromise,
			window.FAM.api.getCustomData(ACTIVE_FA.Id),
		]).then(response => {
			let _customPicklistLabels = response[0].picklist_values || {};
			window.SF.customPicklistLabels = window.SF.customPicklistLabels || {};
			window.SF.customPicklistLabels = {
				...window.SF.customPicklistLabels,
				..._customPicklistLabels,
			};

			this.customSetting = response[0];

			let _response_groups = response[1] || [];
			let _response_data = response[2];

			let _needsUpdateFlag = false;

			let _groupsMap = {};
			// Enrich the groups
			_response_groups
				.sort(sortDynamicGroupsBySequence)
				.forEach((group) => {
					group.csfamext__one_off_charge__c = group.csfamext__one_off_charge__c || 0;
					group.csfamext__recurring_charge__c = group.csfamext__recurring_charge__c || 0;
					group.csfamext__rate_value__c = group.csfamext__rate_value__c || 0;

					_groupsMap[group.Id] = group;
				});

			let _selectGroups = _response_groups.map(group => {
				return {
					value: group.Id,
					label: group.Name,
					description: group.csfamext__description__c || '',
				};
			});

			let _addedGroups = _response_data.group || [];

			(() => {
				let _preFilterLength = _addedGroups.length;
				// Check if added discount codes are deleted or critically changed
				_addedGroups = _addedGroups.filter(
					dc => _groupsMap[dc.Id] && _groupsMap[dc.Id].csfamext__group_type__c === 'Dynamic Group'
				);
				// Check if target object has changed for any added types
				_addedGroups.forEach(dc => {
					dc.csfamext__target_object__c = _groupsMap[dc.Id].csfamext__target_object__c;
					dc.csfamext__fam_editable__c = _groupsMap[dc.Id].csfamext__fam_editable__c;
				});

				if (_addedGroups.length !== _preFilterLength) {
					console.warn('Some codes have been discarded or changed!');
					_needsUpdateFlag = true;
				}
			})();

			let _addedMap = _addedGroups.reduce((acc, iter) => ({ ...acc, [iter.Id]: iter }), {});

			// reject groups that are already added from select options
			_selectGroups = _selectGroups.filter(group => {
				return !_addedMap.hasOwnProperty(group.value);
			});

			this.setState(
				{
					...this.state,
					loading: false,
					selectGroups: _selectGroups,
					groups: _response_groups,
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
	}

	processGroup_old(g) {
		let target = g.csfamext__target_object__c === 'Rate Card Line' ? 'rcl' : 'product';

		g = JSON.parse(JSON.stringify(g));

		if (isJson(g.csfamext__logic_components_JSON__c)) {
			g.csfamext__logic_components_JSON__c = JSON.parse(g.csfamext__logic_components_JSON__c);
		} else {
			g.csfamext__logic_components_JSON__c = JSON.parse(BLANK_CIRCUITS);
		}

		if (isJson(g.csfamext__expression__c)) {
			g.csfamext__expression__c = JSON.parse(decodeEntities(g.csfamext__expression__c))[target];
		}

		if (!g.csfamext__logic_components_JSON__c.hasOwnProperty('logic')) {
			g.csfamext__logic_components_JSON__c = g.csfamext__logic_components_JSON__c[target];
		}

		g.logic = g.csfamext__logic_components_JSON__c.logic;

		g.circuits = g.csfamext__logic_components_JSON__c.circuits.map(circ => {
			circ.Id = 'cc-' + makeId();
			circ.parsable = isJson(circ.value);

			if (circ.parsable) {
				circ.parsed = circ.parsed;
			}
			return circ;
		});

		delete g.csfamext__logic_components_JSON__c;
		return g;
	}

	processGroup(group) {
		let is_group_valid = isJson(decodeEntities(group.csfamext__logic_components_JSON__c));

		group.logicComponents = is_group_valid
			? JSON.parse(decodeEntities(group.csfamext__logic_components_JSON__c))
			: {};

		group.csfamext__target_object__c =
			group.csfamext__target_object__c === 'Rate Card Line'
				? 'Rate Card Line'
				: 'Commercial Products';

		if (is_group_valid) {
			// legacy config
			if (group.logicComponents.hasOwnProperty('circuits')) {
				// Find out whats the target record
				let _new_data = {};
				let _target = group.csfamext__target_object__c === 'Commercial Product' ? 'product' : 'rcl';
				_new_data[_target] = group.logicComponents;

				let _expression = null;

				if (!isJson(group.csfamext__expression__c)) {
					_expression = {
						[_target]: decodeEntities(group.csfamext__expression__c),
					};

					group.csfamext__expression__c = _expression;
				}

				console.warn('Legacy group detected! Updating...');

				window.SF.invokeAction('saveDynamicGroupLogic', [
					group.Id,
					JSON.stringify(_new_data),
					JSON.stringify(_expression),
				]);

				group.logicComponents = _new_data;
			}

			['product', 'rcl'].forEach(target => {
				if (group.logicComponents.hasOwnProperty(target)) {
					group.logicComponents[target].circuits = group.logicComponents[target].circuits.map(
						circ => {
							circ.Id = 'cc-' + makeId();
							circ.parsable = isJson(circ.value);

							if (circ.parsable) {
								circ.parsed = circ.parsed;
							}

							return circ;
						}
					);
				}
			});
		}

		group.csfamext__expression__c = decodeEntities(group.csfamext__expression__c);

		return group;
	}

	onAddGroup(selected_group) {
		// Find group
		let _group = this.state.groups.find(group => group.Id === selected_group.value);

		console.log(_group);

		this.setState(
			{
				open: null,
				added: { ...this.state.added, [_group.Id]: _group },
			},
			() => {
				this.blank = '';
				this.updateCustomData();
				this.updateSelectListGroups();
			}
		);
	}

	onRemoveGroup(removed_group) {
		let _added = this.state.added;
		delete _added[removed_group.Id];

		this.setState(
			{
				added: _added,
			},
			() => {
				this.blank = '';
				this.updateCustomData();
				this.updateSelectListGroups();
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
					description: group.csfamext__description__c,
				})),
		});
	}

	onChangeDiscount(groupId, type, value) {
		this.setState(
			{
				added: {
					...this.state.added,
					[groupId]: { ...this.state.added[groupId], [type]: value },
				},
			},
			this.updateCustomData
		);
	}

	async updateCustomData(enforceSave) {
		let customData = await window.FAM.api.getCustomData(ACTIVE_FA.Id);

		if (typeof customData === 'string' && isJson(customData)) {
			customData = JSON.parse(customData);
		}

		customData = customData === '' ? {} : customData;
		customData.group = Object.values(this.state.added).sort(
			sortDynamicGroupsBySequence
		);

		let setResponse = await window.FAM.api.setCustomData(ACTIVE_FA.Id, customData);
		console.log('Custom data saved:', this.state);
		if (enforceSave) {
			window.FAM.api.saveFrameAgreement(ACTIVE_FA.Id);
		}
	}

	// **************************************************** DG EDITOR ***************************************************************************
	generateExpression(dgId) {
		let _expression = '';
		let _logic = this.state.added[dgId].logic;
		let _circuits = this.state.added[dgId].circuits;

		if (_logic.length >= 1) {
			const generateCircuitString = index => {
				let circ = _circuits[index];
				let _circuitString = '[' + index + ']';
				try {
					_circuitString =
						circ.field +
						' ' +
						circ.operator +
						' ' +
						(circ.parsed ? circ.value : "'" + circ.value + "'");
				} catch (err) {}
				return _circuitString;
			};

			let _body = _logic.replace(new RegExp('[0-9]', 'g'), match => {
				return generateCircuitString(+match);
			});

			_expression += _body;
		} else {
			_circuits.forEach((circ, i) => {
				_expression +=
					circ.field +
					' ' +
					circ.operator +
					' ' +
					(circ.parsed ? circ.value : "'" + circ.value + "'");
				_expression += _circuits.length - 1 !== i ? ' OR ' : '';
			});
		}

		console.log(_circuits);

		this.setState({
			added: {
				...this.state.added,
				[dgId]: {
					...this.state.added[dgId],
					csfamext__expression__c: _expression,
				},
			},
		});
	}

	setParse(dgId, circId, bool) {
		let _circuits = this.state.added[dgId].circuits;

		_circuits.forEach(circ => {
			if (circ.Id === circId) {
				circ.parsed = bool;
			}
		});

		this.setState(
			{
				added: {
					...this.state.added,
					[dgId]: { ...this.state.added[dgId], circuits: _circuits },
				},
			},
			() => {
				this.updateCustomData();
				this.generateExpression(dgId);
			}
		);
	}

	onChangeLogic(dgId, value) {
		this.setState(
			{
				added: {
					...this.state.added,
					[dgId]: { ...this.state.added[dgId], logic: value },
				},
			},
			() => {
				this.updateCustomData();
				this.generateExpression(dgId);
			}
		);
	}

	onRemoveLogicCircuit(dgId, circuit) {
		let _circuits = this.state.added[dgId].circuits.filter(circ => circ.Id !== circuit.Id);
		this.setState(
			{
				added: {
					...this.state.added,
					[dgId]: { ...this.state.added[dgId], circuits: _circuits },
				},
			},
			() => {
				this.updateCustomData();
				this.generateExpression(dgId);
			}
		);
	}

	onAddLogicCircuit(dgId, circuit) {
		circuit.Id = 'cc-' + makeId();

		circuit.parsable = isJson(circuit.value);

		if (circuit.parsable) {
			circuit.parsed = false;
		}

		this.setState(
			{
				added: {
					...this.state.added,
					[dgId]: {
						...this.state.added[dgId],
						circuits: [...this.state.added[dgId].circuits, ...[circuit]],
					},
				},
			},
			() => {
				this.updateCustomData();
				this.generateExpression(dgId);
			}
		);
	}
	// **************************************************** DG EDITOR ***************************************************************************

	getTargetObjectCode() {
		let str;
		if (this.state.added[this.state.open].csfamext__target_object__c === 'Commercial Product') {
			str = 'product';
		} else if (this.state.added[this.state.open].csfamext__target_object__c === 'Rate Card Line') {
			str = 'rcl';
		}

		return str;
	}

	testTargeting() {
		let fromCode = this.getTargetObjectCode();

		console.log(fromCode);

		/******************************/
		let _params = {};
		_params.method = 'executeQuery';
		_params.whereClause = this.state.added[this.state.open].csfamext__expression__c;
		_params.fromCode = fromCode;

		window.FAM.api
			.performAction('csfamext.DynamicGroupDataProvider', JSON.stringify(_params))
			.then(response => {
				return JSON.parse(decodeEntities(response));
			})
			.then(
				response => {
					console.log(response);

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
						return cp;
					});

					this.setState({
						targetingResults: {
							...this.state.targetingResults,
							[this.state.open]: _results,
						},
					});
				},
				error => {}
			);
	}

	render() {
		let _active = this.state.added[this.state.open];

		return this.state.loading ? (
			<CommercialProductSkeleton count={1} />
		) : (
			<div id="dynamic-group-tab" className="card products-card">
				<div className="products-card__inner">
					<div className="products-card__header">
						<span className="products__title">
							{window.SF.labels.famext_dynamic_groups_title}
						</span>
						<div className="header__inputs">
							<Select
								className="dg-select"
								isDisabled={!this.state.editable}
								placeholder={
									window.SF.labels.famext_placeholder_addGroup
								}
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
								<span className="list-cell">
									{getFieldLabel(
										"csfamext__Dynamic_Group__c",
										"name"
									)}
								</span>
								{this.customSetting.dynamic_group_fields.map(
									(f) => {
										return (
											<div key={f} className="list-cell">
												<span>
													{getFieldLabel(
														"csfamext__Dynamic_Group__c",
														f
													) || truncateCPField(f)}
												</span>
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
										console.log(this.state);
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

								{this.state.open === group.Id ? (
									<div className="commercial-product-body">
										<div className="tab-body-left">
											{group.csfamext__expression__c ? (
												<div className="input-box">
													<label className="dg-label">
														{
															window.SF.labels
																.famext_expression
														}
													</label>
													<div className="">
														<pre>
															{
																group.csfamext__expression__c
															}
														</pre>
													</div>
												</div>
											) : (
												""
											)}

											{group.csfamext__fam_editable__c &&
											this.state.editable ? (
												<React.Fragment>
													<div className="input-box">
														<label className="dg-label">
															{
																window.SF.labels
																	.famext_logic
															}
														</label>
														<div className="input-field">
															<DebounceInput
																spellCheck="false"
																placeholder="(0 OR 1) AND (2 OR 3)"
																debounceTimeout={
																	300
																}
																disabled={
																	!group
																		.circuits
																		.length
																}
																className="dg-input dg-input-large"
																type="text"
																onChange={(
																	e
																) => {
																	this.onChangeLogic(
																		group.Id,
																		e.target
																			.value
																	);
																}}
																value={
																	group.logic
																}
															/>
														</div>
													</div>

													{group.circuits.length ? (
														<div className="input-box">
															<label className="dg-label">
																{
																	window.SF
																		.labels
																		.famext_expression_comp
																}
															</label>

															<div className="dg-group-circuits">
																{group.circuits.map(
																	(
																		circ,
																		i
																	) => {
																		return (
																			<div
																				className="dg-circuit"
																				key={
																					circ.Id
																				}
																			>
																				<div className="dg-circuit-index">
																					{i +
																						") "}
																				</div>
																				<div className="dg-circuit-configuration">
																					{circ.field +
																						" " +
																						circ.operator +
																						" " +
																						circ.value}
																				</div>

																				{circ.parsable ? (
																					<div
																						className={
																							"dg-circuit-parsed " +
																							(circ.parsed
																								? "checked"
																								: "")
																						}
																						onClick={() => {
																							this.setParse(
																								group.Id,
																								circ.Id,
																								!circ.parsed
																							);
																						}}
																					>
																						<span>
																							{
																								window
																									.SF
																									.labels
																									.famext_manager_parse
																							}
																							:{" "}
																							{circ.parsed
																								? "On"
																								: "Off"}
																						</span>
																					</div>
																				) : (
																					""
																				)}

																				<div
																					className="dg-circuit-remove"
																					onClick={() =>
																						this.onRemoveLogicCircuit(
																							group.Id,
																							circ
																						)
																					}
																				>
																					<Icon
																						name="delete"
																						height="14"
																						width="14"
																						color="white"
																					/>
																				</div>
																			</div>
																		);
																	}
																)}
															</div>
														</div>
													) : (
														""
													)}

													<div className="input-box">
														<label className="dg-label">
															{
																window.SF.labels
																	.famext_manager_add_new_comp
															}
														</label>
														<LogicForm
															onAdd={(circuit) =>
																this.onAddLogicCircuit(
																	group.Id,
																	circuit
																)
															}
														/>
													</div>
												</React.Fragment>
											) : (
												""
											)}

											<div className="input-box dynamic-group-discounts">
												<div>
													<label>
														{
															window.SF.labels
																.famext_discount_type
														}
													</label>
													<select
														value={
															group.csfamext__discount_type__c
														}
														disabled={
															!this.state.editable
														}
														placeholder={
															window.SF.labels
																.famext_placeholder_addGroup
														}
														onChange={(e) => {
															this.onChangeDiscount(
																group.Id,
																"csfamext__discount_type__c",
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
												"Commercial Product" ? (
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
																minLength={1}
																disabled={
																	!this.state
																		.editable
																}
																spellCheck="false"
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
																{
																	window.SF
																		.labels
																		.famext_recurring
																}
															</label>
															<DebounceInput
																debounceTimeout={
																	300
																}
																minLength={1}
																disabled={
																	!this.state
																		.editable
																}
																spellCheck="false"
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
													<div>
														<label>
															{
																window.SF.labels
																	.famext_value
															}
														</label>
														<DebounceInput
															debounceTimeout={
																300
															}
															minLength={1}
															spellCheck="false"
															className=""
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
												)}
											</div>
										</div>
										<div className="tab-body-right">
											{this.state.targetingResults[
												this.state.added[
													this.state.open
												].Id
											] ? (
												<DGTargets
													results={
														this.state
															.targetingResults[
															this.state.added[
																this.state.open
															].Id
														]
													}
													fields={
														this.customSetting[
															_active.csfamext__target_object__c ===
															"Commercial Product"
																? "price_item_fields"
																: "rcl_fields"
														]
													}
													onTest={this.testTargeting}
												/>
											) : (
												<div className="add-product-box">
													<span className="box-header-1">
														{
															window.SF.labels
																.famext_targeting_not_initiated
														}
													</span>

													<div className="box-button-container">
														<button
															className="fa-button fa-button--brand"
															onClick={
																this
																	.testTargeting
															}
														>
															{
																window.SF.labels
																	.famext_btn_test_targeting
															}
														</button>
													</div>
												</div>
											)}
										</div>
									</div>
								) : (
									""
								)}
							</div>
						))}
				</div>
			</div>
		);
	}
}

function initialiseDynamicGroupTab(id) {
	ReactDOM.render(<DynamicGroupTab />, document.getElementById(id));
}

window.FAM.subscribe('onLoad', data => {
	window.FAM.api.getProductsForFrameAgreement = async () => {
		let activFa = await window.FAM.api.getActiveFrameAgreement();

		let param = {};
		param.method = 'getProductsForFrameAgreement';
		param.faId = activFa.Id;

		return window.FAM.api
			.performAction('csfamext.DynamicGroupDataProvider', JSON.stringify(param))
			.then(r => {
				try {
					return JSON.parse(decodeEntities(r));
				} catch (err) {
					console.warn('Cannot parse query!');
					console.warn(r);
				}
			});
	};

	window.FAM.dynamicGroup = {};

	window.FAM.dynamicGroup.getRecordsFromDynamicGroup = fromCode => {
		return new Promise(async resolve => {
			// ****************************

			let _customData = await window.FAM.api.getCustomData(ACTIVE_FA.Id);
			// ****************************
			if (!_customData) {
				resolve([]);
				return [];
			}

			let _groups = _customData.group;
			let _expressions = _groups.map(group => group.csfamext__expression__c);

			if (_expressions.length > 1) {
				_expressions = _expressions.join(') OR (');
				_expressions = '(' + _expressions + ')';
			} else {
				_expressions = _expressions[0];
			}

			let _params = {};
			_params.method = 'executeQuery';
			_params.whereClause = _expressions;
			_params.fromCode = fromCode;

			window.FAM.api
				.performAction('csfamext.DynamicGroupDataProvider', JSON.stringify(_params))
				.then(response => {
					// FILTER DYNAMIC GROUPS ONLY FOR DYNAMIC GROUPS
					resolve(JSON.parse(decodeEntities(response)));
				});
		});
	};

	return new Promise(resolve => {
		window.FAM.registerMethod('dynamicGroupTabEnter', id => {
			return new Promise(async resolve => {
				ACTIVE_FA = await window.FAM.api.getActiveFrameAgreement();

				setTimeout(() => {
					// ****************************
					console.log('Entered tab with id:' + id);
					// Get DG labels
					if (!window.SF.fieldLabels.hasOwnProperty('csfamext__Dynamic_Group__c')) {
						window.SF.invokeAction('getFieldLabels', ['csfamext__Dynamic_Group__c']).then(r => {
							window.SF.fieldLabels['csfamext__Dynamic_Group__c'] = r;
						});
					}
					initialiseDynamicGroupTab(id);
					// ****************************
					resolve();
				});
			});
		});
		resolve(data);
	});
});

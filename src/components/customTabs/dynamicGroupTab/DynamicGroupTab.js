import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import { DebounceInput } from 'react-debounce-input';
import Select from 'react-select';

import {
	decodeEntities,
	IsJsonString,
	makeId,
	truncateCPField
} from '../../../utils/shared-service';
import Icon from '../../utillity/Icon';
import LogicForm from '../utility/LogicForm';
import DGTargets from '../utility/DGTargets';

import CommercialProductSkeleton from '../../skeletons/CommercialProductSkeleton';

import { CustomOption, filterOptions } from '../utility/CustomOption';

import '../utility/customTabs.scss';

const BLANK_CIRCUITS = '{"logic":"","circuits":[]}';
let ACTIVE_FA = null;

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
			targetingResults: {}
		};

		this.customSettings = {};

		this.updateSelectListGroups = this.updateSelectListGroups.bind(this);
		this.updateCustomData = this.updateCustomData.bind(this);
		this.onAddGroup = this.onAddGroup.bind(this);
		this.testTargeting = this.testTargeting.bind(this);
		this.blank = '';

		window.FAM.api.getProductsForFrameAgreement = async () => {
			let activFa = await window.FAM.api.getActiveFrameAgreement();

			let param = {};
			param.method = 'getProductsForFrameAgreement';
			param.faId = activFa.Id;

			return window.FAM.api
				.performAction(
					'csfamext.DynamicGroupDataProvider',
					JSON.stringify(param)
				)
				.then(r => JSON.parse(decodeEntities(r)));
		};
	}

	componentDidMount() {
		// ************************************
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
						g => g.csfamext__group_type__c === 'Dynamic Group'
					);
					response = response.map(g => this.processGroup(g));
					return response;
				}
			});
		// ************************************
		let _getCustomSettingsPromise = window.FAM.api
			.performAction(
				'csfamext.DynamicGroupDataProvider',
				'{"method": "getCustomSettings"}'
			)
			.then(response => {
				response = decodeEntities(response);

				if (typeof response === 'string' && IsJsonString(response)) {
					response = JSON.parse(response);
				}

				return response;
			})
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

			let _response_groups = response[1] || [];
			let _response_data = response[2];

			let _needsUpdateFlag = false;

			let _groupsMap = {};
			// Enrich the groups
			_response_groups.forEach(group => {
				group.csfamext__one_off_charge__c =
					group.csfamext__one_off_charge__c || 0;
				group.csfamext__recurring_charge__c =
					group.csfamext__recurring_charge__c || 0;
				group.csfamext__rate_value__c = group.csfamext__rate_value__c || 0;

				_groupsMap[group.Id] = group;
			});

			let _selectGroups = _response_groups.map(group => {
				return {
					value: group.Id,
					label: group.Name,
					description: group.csfamext__description__c || ''
				};
			});

			let _addedGroups = _response_data.group || [];

			(() => {
				let _preFilterLength = _addedGroups.length;
				// Check if added discount codes are deleted or critically changed
				_addedGroups = _addedGroups.filter(
					dc =>
						_groupsMap[dc.Id] &&
						_groupsMap[dc.Id].csfamext__group_type__c === 'Dynamic Group'
				);
				// Check if target object has changed for any added types
				_addedGroups.forEach(dc => {
					dc.csfamext__target_object__c =
						_groupsMap[dc.Id].csfamext__target_object__c;
					dc.csfamext__fam_editable__c =
						_groupsMap[dc.Id].csfamext__fam_editable__c;
				});

				if (_addedGroups.length !== _preFilterLength) {
					console.warn('Some codes have been discarded or changed!');
					_needsUpdateFlag = true;
				}
			})();

			let _addedMap = _addedGroups.reduce(
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
					groups: _response_groups,
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

	processGroup(g) {
		g = JSON.parse(JSON.stringify(g));
		if (IsJsonString(g.csfamext__logic_components_JSON__c)) {
			g.csfamext__logic_components_JSON__c = JSON.parse(
				g.csfamext__logic_components_JSON__c
			);
		} else {
			g.csfamext__logic_components_JSON__c = JSON.parse(BLANK_CIRCUITS);
		}

		g.logic = g.csfamext__logic_components_JSON__c.logic;

		g.circuits = g.csfamext__logic_components_JSON__c.circuits.map(circ => {
			circ.Id = 'cc-' + makeId();
			circ.parsable = IsJsonString(circ.value);

			if (circ.parsable) {
				circ.parsed = circ.parsed;
			}
			return circ;
		});

		delete g.csfamext__logic_components_JSON__c;
		return g;
	}

	onAddGroup(selected_group) {
		// Find group
		let _group = this.state.groups.find(
			group => group.Id === selected_group.value
		);

		console.log(_group);

		this.setState(
			{
				open: null,
				added: { ...this.state.added, [_group.Id]: _group }
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
				added: _added
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
		customData.group = Object.values(this.state.added);

		let setResponse = await window.FAM.api.setCustomData(
			ACTIVE_FA.Id,
			customData
		);
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

		if (_logic && _logic.length >= 1) {
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
					csfamext__expression__c: _expression
				}
			}
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
					[dgId]: { ...this.state.added[dgId], circuits: _circuits }
				}
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
					[dgId]: { ...this.state.added[dgId], logic: value }
				}
			},
			() => {
				this.updateCustomData();
				this.generateExpression(dgId);
			}
		);
	}

	onRemoveLogicCircuit(dgId, circuit) {
		let _circuits = this.state.added[dgId].circuits.filter(
			circ => circ.Id !== circuit.Id
		);
		this.setState(
			{
				added: {
					...this.state.added,
					[dgId]: { ...this.state.added[dgId], circuits: _circuits }
				}
			},
			() => {
				this.updateCustomData();
				this.generateExpression(dgId);
			}
		);
	}

	onAddLogicCircuit(dgId, circuit) {
		circuit.Id = 'cc-' + makeId();

		circuit.parsable = IsJsonString(circuit.value);

		if (circuit.parsable) {
			circuit.parsed = false;
		}

		this.setState(
			{
				added: {
					...this.state.added,
					[dgId]: {
						...this.state.added[dgId],
						circuits: [...this.state.added[dgId].circuits, ...[circuit]]
					}
				}
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
		if (
			this.state.added[this.state.open].csfamext__target_object__c ===
			'Commercial Product'
		) {
			str = 'pi';
		} else if (
			this.state.added[this.state.open].csfamext__target_object__c ===
			'Rate Card Line'
		) {
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
		_params.whereClause = this.state.added[
			this.state.open
		].csfamext__expression__c;
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
							[this.state.open]: _results
						}
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
						<span className="products__title">Dynamic groups</span>
						<div className="header__inputs">
							<Select
								className="dg-select"
								isDisabled={!this.state.editable}
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
								<span className="list-cell">Group Name</span>
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
									console.log(this.state);
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
								{this.state.editable ? (
									<div
										className="container__checkbox"
										onClick={e => {
											e.preventDefault();
											return this.onRemoveGroup(group);
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
												<label className="dg-label">Expression</label>
												<div className="">
													<pre>{group.csfamext__expression__c}</pre>
												</div>
											</div>
										) : (
											''
										)}

										{group.csfamext__fam_editable__c && this.state.editable ? (
											<React.Fragment>
												<div className="input-box">
													<label className="dg-label">Logic</label>
													<div className="input-field">
														<input
															spellCheck="false"
															placeholder="(0 OR 1) AND (2 OR 3)"
															className="dg-input dg-input-large"
															type="text"
															disabled={!group.circuits.length}
															value={group.logic}
															onChange={e => {
																this.onChangeLogic(group.Id, e.target.value);
															}}
														/>
													</div>
												</div>

												{group.circuits.length ? (
													<div className="input-box">
														<label className="dg-label">
															Expression components
														</label>

														<div className="dg-group-circuits">
															{group.circuits.map((circ, i) => {
																return (
																	<div className="dg-circuit" key={circ.Id}>
																		<div className="dg-circuit-index">
																			{i + ') '}
																		</div>
																		<div className="dg-circuit-configuration">
																			{circ.field +
																				' ' +
																				circ.operator +
																				' ' +
																				circ.value}
																		</div>

																		{circ.parsable ? (
																			<div
																				className={
																					'dg-circuit-parsed ' +
																					(circ.parsed ? 'checked' : '')
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
																					Parse: {circ.parsed ? 'On' : 'Off'}
																				</span>
																			</div>
																		) : (
																			''
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
															})}
														</div>
													</div>
												) : (
													''
												)}

												<div className="input-box">
													<label className="dg-label">Add new component</label>
													<LogicForm
														onAdd={circuit =>
															this.onAddLogicCircuit(group.Id, circuit)
														}
													/>
												</div>
											</React.Fragment>
										) : (
											''
										)}

										<div className="input-box dynamic-group-discounts">
											<div>
												<label>Discount type</label>
												<select
													value={group.csfamext__discount_type__c}
													disabled={!this.state.editable}
													placeholder="Add Dynamic Group"
													onChange={e => {
														this.onChangeDiscount(
															group.Id,
															'csfamext__discount_type__c',
															e.target.value
														);
													}}
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
															minLength={1}
															disabled={!this.state.editable}
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
															minLength={1}
															disabled={!this.state.editable}
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
												<div>
													<label>Value</label>
													<DebounceInput
														debounceTimeout={300}
														minLength={1}
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
												onTest={this.testTargeting}
											/>
										) : (
											<div className="add-product-box">
												<span className="box-header-1">
													Lorem ipsum dolor sit amett
												</span>
												<span className="box-header-2">
													sed do eiusmod tempor incididunt ut labore
												</span>

												<div className="box-button-container">
													<button
														className="fa-button fa-button--brand"
														onClick={this.testTargeting}
													>
														Test targeting
													</button>
												</div>
											</div>
										)}
									</div>
								</div>
							) : (
								''
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
				.performAction(
					'csfamext.DynamicGroupDataProvider',
					JSON.stringify(_params)
				)
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
					initialiseDynamicGroupTab(id);
					// ****************************
					resolve();
				});
			});
		});
		resolve(data);
	});
});

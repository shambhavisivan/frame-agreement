import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import { DebounceInput } from 'react-debounce-input';
import Select from 'react-select';

import {
	decodeEntities,
	IsJsonString,
	makeId
} from '../../../utils/shared-service';
import Icon from '../../utillity/Icon';
import DGTargets from "../utility/DGTargets";

import "../utility/customTabs.scss";

const BLANK_CIRCUITS = '{"logic":"","circuits":[]}';

class DiscountCodesTab extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			loading: true,
			selectGroups: [],
			groups: [],
			added: {},
			open: null,
			targetingResults: null
		};

		this.customSettings = {};

		this.updateSelectListGroups = this.updateSelectListGroups.bind(this);
		this.updateCustomData = this.updateCustomData.bind(this);
		this.onAddGroup = this.onAddGroup.bind(this);
		this.testTargeting = this.testTargeting.bind(this);
		this.blank = '';
	}

	componentWillMount() {
		// ************************************
		let _getGroupsPromise = window.FAM.api
			.performAction(
				'DynamicGroupDataProvider',
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
					response = response.filter(g => g.group_type__c === "Discount Code");
					response = response.map(g => this.processGroup(g));
					return response;
				}
			});
		// ************************************
		let _getCustomSettingsPromise = window.FAM.api.performAction("DynamicGroupDataProvider", '{"method": "getCustomSettings"}')
		.then(response => JSON.parse(decodeEntities(response)))
		.then(response => {
			for (var key in response) {
				response[key] = response[key] ? response[key].replace(/\s/g, '').split(',') : [];
			}
			return response;
		});
		// ************************************

		Promise.all([_getCustomSettingsPromise, _getGroupsPromise, window.FAM.api.getCustomData()]).then(
			response => {
				this.customSetting = response[0];

				let _response_groups = response[1] || [];
				let _response_data = response[2];

				// Enrich the groups
				_response_groups = _response_groups.map(group => {
					return { ...group, discount: '', oneOff: 0, recurring: 0 };
				});

				let _selectGroups = _response_groups.map(group => {
					return { value: group.Id, label: group.Name };
				});

				let _addedGroups = [];

				try {
					_addedGroups = JSON.parse(_response_data).group;
				} catch (err) { }

				let _addedMap = _addedGroups.reduce(
					(acc, iter) => ({ ...acc, [iter.Id]: iter }),
					{}
				);

				let _needsUpdateFlag = false;

				if (_addedGroups.length) {
					let dynamicGroupsMap = {};

					_response_groups.forEach(group => {
						dynamicGroupsMap[group.Id] = group;
					});

					// Validate custom data (in case some groups are deleted)
					// _groups
					let _groupsFiltered = _addedGroups.filter(group => {
						return !!dynamicGroupsMap[group.Id];
					});

					// reject groups that are already added from select options
					_selectGroups = _selectGroups.filter(group => {
						return !_addedMap.hasOwnProperty(group.value);
					});

					if (_groupsFiltered.length !== _addedGroups.length) {
						_needsUpdateFlag = true;
					}
				}

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
							this.updateCustomData();
						}
					}
				);
			}
		);
		// ****************************
	}

	processGroup(g) {
		g = JSON.parse(JSON.stringify(g));
		if (IsJsonString(g.Logic_Components_JSON__c)) {
			g.Logic_Components_JSON__c = JSON.parse(g.Logic_Components_JSON__c);
		} else {
			g.Logic_Components_JSON__c = JSON.parse(BLANK_CIRCUITS);
		}

		g.logic = g.Logic_Components_JSON__c.logic;

		g.circuits = g.Logic_Components_JSON__c.circuits.map(circ => {
			circ.Id = 'cc-' + makeId();
			circ.parsable = IsJsonString(circ.value);

			if (circ.parsable) {
				circ.parsed = circ.parsed;
			}
			return circ;
		});

		delete g.Logic_Components_JSON__c;
		return g;
	}

	onAddGroup(selected_group) {
		// Find group
		let _group = this.state.groups.find(
			group => group.Id === selected_group.value
		);

		this.setState(
			{
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
				.map(group => ({ value: group.Id, label: group.Name }))
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

	updateCustomData() {
		window.FAM.api.getCustomData().then(response => {
			let customData = response === '' ? {} : JSON.parse(response);
			customData.group = Object.values(this.state.added);

			window.FAM.api
				.setCustomData(JSON.stringify(customData))
				.then(response => {
					console.log('Custom data saved!');
					console.log(this.state);
				});
		});
	}

	testTargeting() {
		let fromCode = 'pi'
		window.FAM.dynamicGroup.getCommercialProductsByDynamicGroup(fromCode).then(
			response => {
				console.log(response);
				response.results = [];
				response.results = response.results || [];

				let _results = response.results.map(cp => {
					let _cp = JSON.parse(JSON.stringify(cp));
					delete _cp.attributes;
					return cp;
				})

				this.setState({
					targetingResults: _results
				});
			},
			error => {}
		);
	}

	render() {
		return this.state.loading ? (
			''
		) : (
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
								/>
							</div>
						</div>

						<div className="product-card__container commercial-product-container-bare product-card__container--header">
							<div className="container__header">
								<div className="container__fields">
									<span className="list-cell">Group name</span>
									<span className="list-cell">Group id</span>
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
										<div className="fields__item">{group.Id}</div>
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
										<div className='tab-body-left'>
											{group.Expression__c ? (
												<div className="input-box big">
													<label className="dg-label">Expression</label>
													<div className="">
														<pre>{group.Expression__c}</pre>
													</div>
												</div>
											) : (
													''
												)}

											<div className="input-box big dynamic-group-discounts">
												<div>
													<label>Discount type</label>
													<select
														value={group.discount}
														placeholder="Add Dynamic Group"
														onChange={e => {
															this.onChangeDiscount(
																group.Id,
																'discount',
																e.target.value
															);
														}}
													>
														<option value="">--none</option>
														<option value={'Amount'}>Amount</option>
														<option value={'Percentage'}>Percentage</option>
													</select>
												</div>

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
																'oneOff',
																+e.target.value
															);
														}}
														value={group.oneOff}
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
																'recurring',
																+e.target.value
															);
														}}
														value={group.recurring}
													/>
												</div>
											</div>
										</div>
										<div className='tab-body-right'>
											{this.state.targetingResults ? (<React.Fragment>
												<DGTargets results={this.state.targetingResults} fields={this.customSetting.price_item_fields} />
												<div className='box-button-container'>
													<button className='fa-button fa-button--brand' onClick={this.testTargeting}>
														Test targeting
													</button>
												</div>
											</React.Fragment>) : (
													<div className='add-product-box'>
														<span className='box-header-1'>Lorem ipsum dolor sit amett</span>
														<span className='box-header-2'>sed do eiusmod tempor incididunt ut labore</span>

														<div className='box-button-container'>
															<button className='fa-button fa-button--brand' onClick={this.testTargeting}>
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

function initialiseDiscountCodesTab(id) {
	ReactDOM.render(<DiscountCodesTab />, document.getElementById(id));
}

window.FAM.subscribe('onLoad', data => {
	window.FAM.dynamicGroup = {};
	window.FAM.dynamicGroup.getCommercialProductsByDynamicGroup = (fromCode) => {
		return new Promise(async resolve => {
			// ****************************
			let _customData = await window.FAM.api.getCustomData();
			// ****************************
			if (!_customData) {
				resolve([]);
				return [];
			}

			let _groups = JSON.parse(_customData).group;
			let _expressions = _groups.map(group => group.Expression__c);

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
				.performAction('DynamicGroupDataProvider', JSON.stringify(_params))
				.then(response => {
					// FILTER DYNAMIC GROUPS ONLY FOR DISCOUNT CODES
					resolve(JSON.parse(decodeEntities(response)));
				});
		});
	};

	return new Promise(resolve => {
		window.FAM.registerMethod('discountCodesTabEnter', id => {
			return new Promise(resolve => {
				setTimeout(() => {
					// ****************************
					console.log('Entered tab with id:' + id);
					initialiseDiscountCodesTab(id);
					// ****************************
					resolve();
				});
			});
		});
		resolve(data);
	});
});

import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import { DebounceInput } from 'react-debounce-input';
import Select from 'react-select';

import { decodeEntities } from '../../utils/shared-service';
import Group from './Group';
import Checkbox from '../utillity/inputs/Checkbox';
import Icon from '../utillity/Icon';

import './CustomTab.scss';

class CustomTab extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			loading: true,
			selectGroups: [],
			groups: [],
			added: {},
			open: null
		};

		this.updateSelectListGroups = this.updateSelectListGroups.bind(this);
		this.updateCustomData = this.updateCustomData.bind(this);
		this.onAddGroup = this.onAddGroup.bind(this);
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
					return response;
				}
			});
		// ************************************

		Promise.all([_getGroupsPromise, window.FAM.api.getCustomData()]).then(
			response => {
				let _response_groups = response[0] || [];
				let _response_data = response[1];

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
				} catch (err) {}

				let _addedMap = _addedGroups.reduce(
					(acc, iter) => ({ ...acc, [iter.Id]: iter }),
					{}
				);

				let _needsUpdateFlag = false;

				if (_addedGroups.length) {
					let dynamicGroupsMap = {};
					_response_groups.forEach(group => {
						dynamicGroupsMap[group.Id] = group;

						if (_addedMap[group.Id]) {
							group.discount = _addedMap[group.Id].discount || '';
							group.oneOff = _addedMap[group.Id].oneOff || 0;
							group.recurring = _addedMap[group.Id].recurring || 0;
						}
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
							this.updateCustomData();
						}
					}
				);
			}
		);
		// ****************************
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
								<span className="list-cell" />
							</div>
						</div>
					</div>

					{Object.values(this.state.added).map(group => (
						<div className="product-card__container" key={group.Id}>
							<div className="container__header">
								<div
									className="container__fields"
									onClick={() => {
										this.setState({
											open: this.state.open === group.Id ? null : group.Id
										});
									}}
								>
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
									{group.csfam__Expression__c ? (
										<div className="commercial-product-description">
											<span>Expression: </span>
											<pre>{group.csfam__Expression__c}</pre>
										</div>
									) : (
										''
									)}

									<div className="dynamic-group-description">
										<div className="negotiate-select-wrapper">
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

function initialiseCustomTab(id) {
	ReactDOM.render(<CustomTab />, document.getElementById(id));
}

window.FAM.subscribe('onLoad', data => {
	window.FAM.dynamicGroup = {};
	window.FAM.dynamicGroup.getCommercialProductsByDynamicGroup = () => {
		return new Promise(async resolve => {
			// ****************************
			let _customData = await window.FAM.api.getCustomData();
			// ****************************
			if (!_customData) {
				resolve([]);
				return [];
			}

			let _groups = JSON.parse(_customData).group;
			let _expressions = _groups.map(group => group.csfam__Expression__c);

			if (_expressions.length > 1) {
				_expressions = _expressions.join(') OR (');
				_expressions = '(' + _expressions + ')';
			} else {
				_expressions = _expressions[0];
			}

			let _params = {};
			_params.method = 'executeQuery';
			_params.whereClause = _expressions;

			window.FAM.api
				.performAction('DynamicGroupDataProvider', JSON.stringify(_params))
				.then(function(response) {
					resolve(response);
				});
		});
	};

	return new Promise(resolve => {
		window.FAM.registerMethod('customTabEnter', id => {
			return new Promise(resolve => {
				setTimeout(() => {
					// ****************************
					console.log('Entered tab with id:' + id);
					initialiseCustomTab(id);
					// ****************************
					resolve();
				});
			});
		});
		resolve(data);
	});
});

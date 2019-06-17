import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import { DebounceInput } from 'react-debounce-input';

import {
	decodeEntities,
	IsJsonString,
	makeId
} from '../../utils/shared-service';
import Checkbox from '../utillity/inputs/Checkbox';
import Icon from '../utillity/Icon';

import './DiscountCodesTab.scss';

const BLANK_CIRCUITS = '{"logic":"","circuits":[]}';

class DiscountCodesTab extends React.Component {
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
		this.setState({ loading: false });
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

	render() {
		return this.state.loading ? (
			''
		) : (
			<div id="dynamic-group-tab" className="card products-card">
				<div className="products-card__inner">
					<div className="products-card__header">
						<span className="products__title">Discount Codes</span>
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

			window.FAM.api
				.performAction('DynamicGroupDataProvider', JSON.stringify(_params))
				.then(response => {
					// FILTER DYNAMIC GROUPS ONLY FOR DISCOUNT CODES
					resolve(response);
				});
		});
	};

	return new Promise(resolve => {
		window.FAM.registerMethod('dynamicGroupTabEnter', id => {
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

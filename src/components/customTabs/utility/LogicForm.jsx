import React, { Component } from 'react';
import Icon from '../../utillity/Icon';

const OPERATORS = [
	{
		label: 'Equals',
		value: '='
	},
	{
		label: 'Not equals',
		value: '!='
	},
	{
		label: 'Less than',
		value: '<'
	},
	{
		label: 'Less or equal',
		value: '<='
	},
	{
		label: 'Greater than',
		value: '>'
	},
	{
		label: 'Greater or equal',
		value: '>='
	},
	{
		label: 'Like',
		value: 'like'
	},
	{
		label: 'In',
		value: 'in'
	},
	{
		label: 'Not In',
		value: 'not in'
	}
];

class LogicForm extends React.Component {
	constructor(props, context) {
		super(props);
		// this.props.group

		this.state = {
			field: '',
			operator: '=',
			value: ''
		};
	}

	render() {
		return (
			<div className="dg-logic-form">
				<input
					className="new-logic-field"
					type="text"
					name=""
					value={this.state.field}
					placeholder="Field"
					onChange={event => {
						this.setState({ field: event.target.value });
					}}
				/>

				<select
					className="new-logic-field"
					value={this.state.operator}
					onChange={event => {
						this.setState({ operator: event.target.value });
					}}
				>
					{OPERATORS.map((operator, i) => {
						return (
							<option key={'operator-' + i} value={operator.value}>
								{operator.label.toUpperCase()}
							</option>
						);
					})}
				</select>

				<input
					className="new-logic-field"
					type="text"
					name=""
					value={this.state.value}
					placeholder="Value"
					onChange={event => {
						this.setState({ value: event.target.value });
					}}
				/>

				<button
					className="new-logic-field"
					disabled={!this.state.field || !this.state.value}
					onClick={() => {
						this.props.onAdd(JSON.parse(JSON.stringify(this.state)));
					}}
				>
					<Icon name="add" height="14" width="14" color="white" />
				</button>
			</div>
		);
	}
}

export default LogicForm;

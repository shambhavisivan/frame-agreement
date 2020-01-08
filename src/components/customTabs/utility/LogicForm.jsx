import React, { Component } from 'react';
import Icon from '../../utillity/Icon';

const OPERATORS = [
	{
		label: window.SF.labels.famext_operator_equals || 'Equals',
		value: '='
	},
	{
		label: window.SF.labels.famext_operator_not_equals || 'Not equals',
		value: '!='
	},
	{
		label: window.SF.labels.famext_operator_less_than || 'Less than',
		value: '<'
	},
	{
		label: window.SF.labels.famext_operator_less_or_equal || 'Less or equal',
		value: '<='
	},
	{
		label: window.SF.labels.famext_operator_greater_than || 'Greater than',
		value: '>'
	},
	{
		label:
			window.SF.labels.famext_operator_greater_or_equal || 'Greater or equal',
		value: '>='
	},
	{
		label: window.SF.labels.famext_operator_like || 'Like',
		value: 'like'
	},
	{
		label: window.SF.labels.famext_operator_in || 'In',
		value: 'in'
	},
	{
		label: window.SF.labels.famext_operator_not_in || 'Not In',
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
					placeholder={window.SF.labels.famext_field}
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
					placeholder={window.SF.labels.famext_value}
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

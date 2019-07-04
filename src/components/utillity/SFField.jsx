import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Icon from './Icon';
import SFDatePicker from './datepicker/SFDatePicker';
import InputText from './inputs/InputText';
import InputTextArea from './inputs/InputTextArea';
import LookupField from './inputs/LookupField';
import Toggle from './inputs/Toggle';

class SFField extends Component {
	constructor(props) {
		super(props);
		this.onChange = this.onChange.bind(this);

		this.state = {
			render: true
		};
	}

	onChange(value) {
		this.props.onChange(this.props.field.field, value);
	}

	render() {
		let field;
		if (this.props.field.type === 'date') {
			field = (
				<SFDatePicker
					disabled={!this.props.editable}
					initialDate={this.props.value}
					onDateChange={this.onChange}
					placeholderText="Enter date from"
				/>
			);
		} else if (
			this.props.field.type === 'text' ||
			this.props.field.type === 'number'
		) {
			field = (
				<InputText
					disabled={!this.props.editable}
					type={this.props.field.type}
					onChange={this.onChange}
					value={this.props.value}
				/>
			);
		} else if (this.props.field.type === 'boolean') {
			field = (
				<Toggle
					onChange={this.onChange}
					disabled={!this.props.editable}
					value={this.props.value}
				/>
			);
		} else if (this.props.field.type === 'textarea') {
			field = (
				<InputTextArea
					disabled={!this.props.editable}
					onChange={this.onChange}
					value={this.props.value}
				/>
			);
		} else if (this.props.field.type === 'formula') {
			field = (
				<InputText
					disabled={true}
					formula={true}
					onChange={this.onChange}
					value={this.props.value}
				/>
			);
		} else if (this.props.field.type === 'picklist') {
			field = (
				<select
					className="fa-select fa-input-border"
					value={this.props.value}
					onChange={e => this.onChange(e.target.value)}
				>
					<option value="">-none</option>
					{this.props.field.options.map(option => {
						return (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						);
					})}
				</select>
			);
		} else if (this.props.field.type === 'lookup') {
			// "field": "csconta__Account__c",
			// "readOnly": false,
			// "label": "Account",
			// "type": "lookup",
			// "grid": 4,
			// "lookupData": {
			//     "columns": ["Name", "Type"],
			//     "whereClause": "name != 'invalidTest'"
			// }

			field = (
				<LookupField
					disabled={!this.props.editable}
					label={this.props.field.label}
					onChange={this.onChange}
					field={this.props.field.field}
					columns={this.props.field.lookupData.columns}
					filter={this.props.field.lookupData.whereClause}
					value={this.props.value}
				/>
			);
		}

		return (
			<div
				className={'row__element ' + (this.props.editable ? 'editable' : '')}
				style={{ width: (100 / 12) * this.props.field.grid + '%' }}
			>
				<label className="element__label">
					<span className="label__title">{this.props.field.label}</span>
					<Icon
						svg-class="form-edit-icon"
						name="edit"
						width="11"
						height="11"
						color="#4bca81"
					/>
				</label>
				<div className="element__field">{this.state.render ? field : ''}</div>
			</div>
		);
	}
}

// SFField.propTypes = {
//     label: PropTypes.string,
//     editable: PropTypes.bool,
//     value: PropTypes.oneOfType([
//         PropTypes.string,
//         PropTypes.number
//     ]),
//     type: PropTypes.oneOf(['text', 'date'])
// }

export default SFField;

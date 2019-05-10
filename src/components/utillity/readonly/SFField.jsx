import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '../Icon';
import SFDatePicker from '../datepicker/SFDatePicker';
import InputText from '../inputs/InputText';
import InputTextArea from '../inputs/InputTextArea';
import Lookup from '../inputs/Lookup';
import Toggle from '../inputs/Toggle';

class SFField extends Component {
	constructor(props) {
		super(props);

		this.onChange = this.onChange.bind(this);

		// this.props.editable

		this.state = {
			value: this.props.value
		};
	}

	onChange(value) {
		this.setState({
			value: value
		});
		this.props.onChange(this.props.field.field, value);
	}

	render() {
		let field;
		if (this.props.field.type === 'date') {
			field = (
				<SFDatePicker
					disabled={!this.props.editable}
					initialDate={this.state.value}
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
					onBlur={() => {
						this.setState({ edit: false });
					}}
					value={this.state.value}
				/>
			);
		} else if (this.props.field.type === 'boolean') {
			field = (
				<Toggle
					onChange={this.onChange}
					disabled={!this.props.editable}
					value={this.state.value}
				/>
			);
		} else if (this.props.field.type === 'textarea') {
			field = (
				<InputTextArea
					disabled={!this.props.editable}
					onChange={this.onChange}
					onBlur={() => {
						this.setState({ edit: false });
					}}
					value={this.state.value}
				/>
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
				<Lookup
					disabled={!this.props.editable}
					label={this.props.field.label}
					onChange={this.onChange}
					field={this.props.field.field}
					columns={this.props.field.lookupData.columns}
					filter={this.props.field.lookupData.whereClause}
					value={this.state.value}
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
				<div className="element__field">{field}</div>
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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from '../Icon';
import SFDatePicker from '../datepicker/SFDatePicker';
import InputText from '../inputs/InputText';
import InputTextArea from '../inputs/InputTextArea';
import Toggle from '../inputs/Toggle';

import './SFField.css';

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
		}

		return (
			<div
				className={'fa-flex-item ' + (this.props.editable ? 'editable' : '')}
				style={{ width: (100 / 12) * this.props.field.grid + '%' }}
			>
				<label className={this.state.edit ? 'edit' : ''}>
					<span className="fa-title">{this.props.field.label}</span>
					<Icon
						svg-class="form-edit-icon"
						name="edit"
						width="11"
						height="11"
						color="#4bca81"
					/>
				</label>
				<div>{field}</div>
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
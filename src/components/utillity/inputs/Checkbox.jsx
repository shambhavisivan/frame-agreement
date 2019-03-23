import React, { Component } from 'react';
import './Toggle.css';

import Icon from '../Icon';
import './Checkbox.scss';

class Checkbox extends React.Component {
	constructor(props) {
		super(props);

		this.onChange = this.onChange.bind(this);

		let initialState = false;

		if (this.props.hasOwnProperty('value')) {
			initialState = this.props.value;
		}
	}

	onChange(val) {
		this.props.onChange && this.props.onChange();
	}

	render() {
		if (this.props.hasOwnProperty('readOnly')) {
			return (
				<div
					className={
						'checkbox' +
						(this.props.readOnly ? ' checked' : '') +
						(this.props.disabled ? ' disabled' : '') +
						(this.props.small ? ' small' : '')
					}
				>
					{this.props.readOnly && (
						<Icon
							svg-class="checkbox-icon"
							name="check"
							width={this.props.small ? 8 : 12}
							height={this.props.small ? 8 : 12}
							color="white"
						/>
					)}
				</div>
			);
		} else {
			return (
				<div
					className={'checkbox' + (this.props.value ? ' checked' : '')}
					onClick={this.onChange}
				>
					{this.props.value && (
						<Icon
							svg-class="checkbox-icon"
							name="check"
							width={this.props.small ? 8 : 12}
							height={this.props.small ? 8 : 12}
							color="white"
						/>
					)}
				</div>
			);
		}
	}
}

export default Checkbox;

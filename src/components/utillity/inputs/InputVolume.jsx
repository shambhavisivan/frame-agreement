import React, { Component } from 'react';
import { DebounceInput } from 'react-debounce-input';
import Icon from '../Icon';

class InputVolume extends Component {
	constructor(props) {
		super(props);
		// this.props.readOnly
		// this.props.value
		// this.props.onChange
		// this.props.unit?

		this.onChange = this.onChange.bind(this);
		this.onFocus = this.onFocus.bind(this);
		this.onBlur = this.onBlur.bind(this);

		this.state = {
			focus: false
		};
	}

	onChange(e) {
		this.props.onChange(+e.target.value);
	}

	onFocus() {
		this.setState({ focus: true });
	}

	onBlur() {
		this.setState({ focus: false });
	}

	render() {
		if (this.props.readOnly) {
			return (
				<div className="negotiate-input-wrapper readOnly">
					<span>{this.props.value || 0}</span>
				</div>
			);
		} else {
			return (
				<div
					className={
						'negotiate-input-wrapper' + (this.state.focus ? ' focused' : '')
					}
				>
					<Icon
						svg-class="negotiate-icon"
						name="edit"
						width="14"
						height="14"
						color={this.state.focus ? '#0070d2' : '#747474'}
					/>
					<DebounceInput
						debounceTimeout={300}
						placeholder="0"
						spellCheck="false"
						className="negotiate-input"
						type="number"
						onChange={this.onChange}
						onBlur={this.onBlur}
						onFocus={this.onFocus}
						value={this.props.value || 0}
					/>
				</div>
			);
		}
	}
}

export default InputVolume;

import React, { Component } from 'react';
import { DebounceInput } from 'react-debounce-input';

import Icon from '../Icon';

import './InputSearch.css';

class InputSearch extends React.Component {
	constructor(props) {
		super(props);

		this.onTextChange = this.onTextChange.bind(this);


		this.state = {
			value: this.props.value
		};

		this.bordered = this.props.bordered || false;
	}

	onTextChange(e) {
		this.setState({
			value: e.target.value
		});
		this.props.onChange(e.target.value);
	}

	// onTextChange(event) {
	//     this.setState({
	//         value: event.target.value
	//     });
	// }

	render() {
		return (
		<div className={"fa-input-search" + (this.bordered ? ' fa-input-search-border-bottom' : '')}>
				<Icon name="search" width="16" height="16" color="#cccccc" />
				<DebounceInput
					minLength={2}
					placeholder={
						this.props.placeholder ||
						window.SF.labels.input_quickSearchPlaceholder
					}
					debounceTimeout={300}
					spellCheck="false"
					className="fa-input fa-input-lg"
					type="text"
					onChange={this.onTextChange}
					value={this.state.value}
				/>
			</div>
		);
	}
}

export default InputSearch;

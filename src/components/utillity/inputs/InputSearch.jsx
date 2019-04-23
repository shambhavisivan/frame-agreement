import React, { Component } from 'react';
import { DebounceInput } from 'react-debounce-input';

import Icon from '../Icon';

class InputSearch extends React.Component {
	constructor(props) {
		super(props);

		this.onTextChange = this.onTextChange.bind(this);

		this.state = {
			value: this.props.value
		};

		this.bordered = this.props.bordered || false;
	}

	onTextChange(value = '') {
		console.log('New value ', value);
		this.setState({
			value: value
		});
		this.props.onChange(value);
	}

	// onTextChange(event) {
	//     this.setState({
	//         value: event.target.value
	//     });
	// }

	render() {
		return (
			<div
				className={
					'fa-input-search' +
					(this.bordered ? ' fa-input-search-border-bottom' : '')
				}
			>
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
					onChange={e => {
						this.onTextChange(e.target.value);
					}}
					value={this.state.value}
				/>
				{this.state.value ? (
					<Icon
						name="close"
						width="16"
						height="16"
						color="#cccccc"
						onClick={() => {
							this.onTextChange();
						}}
					/>
				) : (
					''
				)}
			</div>
		);
	}
}

export default InputSearch;

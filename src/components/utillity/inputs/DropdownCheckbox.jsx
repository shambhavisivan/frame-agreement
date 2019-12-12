import React, { Component } from 'react';

import Icon from '../Icon';
import Checkbox from './Checkbox';

import { truncateCPField, getFieldLabel } from '~/src/utils/shared-service.js';

class DropdownCheckbox extends React.Component {
	constructor(props) {
		super(props);
		this.menu = React.createRef();

		this.showMenu = this.showMenu.bind(this);
		this.toggleVisibility = this.toggleVisibility.bind(this);

		this.state = {
			menu: false
		};

		this.setWrapperRef = this.setWrapperRef.bind(this);

		this.handleClickOutside = this.handleClickOutside.bind(this);
	}

	componentDidMount() {
		document.addEventListener('mousedown', this.handleClickOutside);
	}

	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClickOutside);
	}

	setWrapperRef(node) {
		this.wrapperRef = node;
	}

	handleClickOutside(event) {
		if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
			this.hideMenu();
		}
	}

	showMenu() {
		this.setState({
			menu: !this.state.menu
		});
	}

	hideMenu() {
		this.setState({
			menu: false
		});
	}

	toggleVisibility(index) {
		this.props.onChange(index);
	}

	onChange(e) {}

	render() {
		return (
			<div className="dropdown-checkbox-container" ref={this.setWrapperRef}>
				{this.state.menu && (
					<div
						className="fa-dropdown fa-dropdown--reverse"
						onBlur={this.onBlur}
					>
						{this.props.options.map((option, i) => {
							return (
								<button
									className="fa-dropdown__button"
									key={option.name}
									onClick={() => {
										this.toggleVisibility(i);
									}}
								>
									<Checkbox readOnly={option.visible} />
									<span>
										{getFieldLabel(this.props.object, options.name) ||
											truncateCPField(option.name)}
									</span>
								</button>
							);
						})}
					</div>
				)}

				<div className="dropdown-placeholder" onClick={this.showMenu}>
					<span>{window.SF.labels.products_display_columns}</span>
					<Icon
						name={this.state.menu ? 'chevronup' : 'chevrondown'}
						height="14"
						width="14"
						color="#0070d2"
					/>
				</div>
			</div>
		);
	}
}

export default DropdownCheckbox;

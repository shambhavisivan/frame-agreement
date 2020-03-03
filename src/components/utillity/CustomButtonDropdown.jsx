import React, { Component } from 'react';
import { connect } from 'react-redux';

import Icon from './Icon';

class CustomButtonDropdown extends React.Component {
	constructor(props) {
		super(props);
		this.menu = React.createRef();

		this.showMenu = this.showMenu.bind(this);
		this.hideMenu = this.hideMenu.bind(this);

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
		this.setState({ menu: !this.state.menu });
	}

	hideMenu() {
		this.setState({
			menu: false
		});
	}

	render() {
		return (
			<div className="fa-dropdown-group" ref={this.setWrapperRef}>
				<button
					className={
						'fa-button fa-button--' +
						(this.props.brand ? 'brand' : 'transparent')
					}
					onClick={this.showMenu}
				>
					<span>
						{this.props.label ||
							window.SF.labels.header_customDropdownPlaceholder}
					</span>
					<Icon name={this.state.menu ? 'up' : 'down'} height="14" width="14" />
				</button>
				{this.state.menu && (
					<div aria-hidden={!this.state.menu} className="fa-dropdown">
						{this.props.buttons.map((btnObj, i) => {
							return (
								<button
									aria-expanded={this.state.menu}
									className="fa-dropdown__button"
									key={btnObj.id + i}
									id={btnObj.id}
									onClick={() => {
										this.props.onAction(btnObj);
										this.hideMenu();
									}}
								>
									{btnObj.label}
								</button>
							);
						})}
					</div>
				)}
			</div>
		);
	}
}

export default CustomButtonDropdown;

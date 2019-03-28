import React, { Component } from 'react';
import { connect } from 'react-redux';

import Icon from './Icon';

import './CustomButtonDropdown.css';

class CustomButtonDropdown extends React.Component {
	constructor(props) {
		super(props);
		this.menu = React.createRef();

		this.showMenu = this.showMenu.bind(this);
		this.onBlur = this.onBlur.bind(this);
		this.toggleVisibility = this.toggleVisibility.bind(this);

		this.state = {
			menu: false
		};

		// this.props.buttons
		// this.props.onAction
	}

	showMenu() {
		this.setState(
			{
				menu: true
			},
			() => {
				this.menu.current.focus();
			}
		);
	}

	onBlur() {
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
			<div className="fa-margin-right-sm">
				{this.state.menu && (
					<ul
						ref={this.menu}
						tabIndex="0"
						className="menu"
						onBlur={this.onBlur}
					>
						{this.props.buttons.map((btnObj, i) => {
							return (
								<li
									key={btnObj.id + i}
									id={btnObj.id}
									onClick={() => {
										this.props.onAction(btnObj.method, btnObj.type);
									}}
								>
									{btnObj.label}
								</li>
							);
						})}
					</ul>
				)}

				<button
					className="fa-button fa-button-border-light fa-button-transparent"
					onClick={this.showMenu}
				>
					<span className="fa-margin-right-xsm">
						{window.SF.labels.header_customDropdownPlaceholder}{' '}
					</span>
					<Icon
						name={this.state.menu ? 'up' : 'down'}
						height="14"
						width="14"
						color="white"
					/>
				</button>
			</div>
		);
	}
}

export default CustomButtonDropdown;

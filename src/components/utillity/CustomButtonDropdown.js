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
			<div className="dropdown-button-container">
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
					className="slds-button slds-button-icon slds-button--translucent"
					onClick={this.showMenu}
				>
					Custom{' '}
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

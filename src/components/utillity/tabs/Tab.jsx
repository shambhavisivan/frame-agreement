import React, { Component } from 'react';

class Tab extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.handleTabClick = this.handleTabClick.bind(this);
		// this.props.disabled
	}

	handleTabClick(event) {
		event.preventDefault();
		this.props.onClick(this.props.tabIndex);

		if (!this.props.isActive && this.props.hasOwnProperty('onEnter')) {
			this.props.onEnter();
		}
	}

	render() {
		let tab = '';

		if (this.props.disabled) {
			tab = <li className="fa-tab disabled">{this.props.label}</li>;
		} else {
			tab = (
				<li
					className={`fa-tab ${this.props.isActive ? 'active' : ''}`}
					onClick={this.handleTabClick}
				>
					<a>{this.props.label}</a>
				</li>
			);
		}

		return tab;
	}
}

export default Tab;

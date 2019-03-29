import React, { Component } from 'react';

import './Tab.scss';

class Tab extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.handleTabClick = this.handleTabClick.bind(this);
		// this.props.disabled
	}

	handleTabClick(event) {
		event.preventDefault();
		this.props.onClick(this.props.tabIndex);
	}

	render() {
		let tab = '';

		if (this.props.disabled) {
			tab = <li className="tab disabled">{this.props.label}</li>;
		} else {
			tab = (
				<li
					className={`tab ${this.props.isActive ? 'active' : ''}`}
					onClick={this.handleTabClick}
				>
					<a className="tab-link">{this.props.label}</a>
				</li>
			);
		}

		return tab;
	}
}

export default Tab;

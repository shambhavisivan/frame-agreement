import React, { Component } from 'react';
import './Header.css';

import Icon from './Icon';

class Header extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className={`react-header ${this.props.disabled ? 'disabled' : ''}`}>
				<div
					className="react-header-back-button"
					onClick={this.props.onBackClick}
				>
					<Icon name="back" width="22" height="21" color="#FFFFFF" />
				</div>

				<div className="react-header-title-container">
					<div className="react-header-sub_title">{this.props.subtitle}</div>
					<div className="react-header-title">
						{this.props.title}{' '}
						{this.props.status ? (
							<span className="badge badge-translucent">
								{this.props.status}
							</span>
						) : (
							''
						)}
					</div>
				</div>

				<div className="react-header-child-container">
					{this.props.children}
				</div>
			</div>
		);
	}
}

export default Header;

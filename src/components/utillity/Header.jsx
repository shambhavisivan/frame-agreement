import React, { Component } from 'react';

import Icon from './Icon';

class Header extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div
				className={`fa-secondary-header ${this.props.disabled ? 'error fa-disabled' : ''} ${
					this.props.invalid ? 'error fa-invalid' : ''
				}`}
			>
				<div className="fa-secondary-header__inner">
					<div className="fa-secondary-header__prev" onClick={this.props.onBackClick}>
						<Icon name="back" width="19" height="18" color="#FFFFFF" />
					</div>
					<div className="fa-secondary-header__item">
						<div className="fa-secondary-header__title-wrapper">
							<div className="fa-secondary-header__subtitle">{this.props.subtitle}</div>
							<div className="fa-secondary-header__title">{this.props.title}</div>
						</div>
						{this.props.status ? (
							<span className="fa-chip fa-chip--draft">{this.props.status}</span>
						) : (
							''
						)}
					</div>

					<div className="fa-secondary-header__item fa-secondary-header__item--right">
						{this.props.children}
					</div>
				</div>
			</div>
		);
	}
}

export default Header;

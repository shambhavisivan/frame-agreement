import React, { Component } from 'react';
import './Header.css';

import Icon from './Icon';

class Header extends Component {
	constructor(props) {
		super(props);
		console.log(props);
	}

	render() {
		return (
			<div className={`header-secondary ${this.props.disabled ? 'disabled' : ''}`}>
				<div className="container">
					<div className="header-secondary-body">
						<div className="header-secondary-body-col">
							<div
								onClick={this.props.onBackClick}
							>
								<Icon name="back" width="22" height="21" color="#FFFFFF" />
							</div>
							<div className="margin-left-sm margin-right-sm">
								<small className="fade">{this.props.subtitle}</small>
								<div>{this.props.title}</div>
							</div>
						</div>
						<div>
							{this.props.children}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Header;

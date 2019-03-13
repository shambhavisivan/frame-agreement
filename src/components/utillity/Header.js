import React, { Component } from 'react';
import './Header.css';

import Icon from './Icon';

class Header extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className={`fa-header-secondary ${this.props.disabled ? 'disabled' : ''}`}>
				<div className="fa-container">
					<div className="fa-header-secondary-body">
						<div
							className="fa-header-secondary-prev"
							onClick={this.props.onBackClick}
						>
							<Icon name="back" width="22" height="21" color="#FFFFFF" />
						</div>
						<div className="fa-header-secondary-body-col fa-header-secondary-body-col-left">
							<div>
								<div className="fa-header-secondary-body-sub">{this.props.subtitle}</div>
								<div className="fa-header-secondary-body-title">
									{this.props.title}{' '}
									{this.props.status ? (
										<span className="chip">
											{this.props.status}
										</span>
									) : (
										''
									)}
								</div>
							</div>
						</div>

						<div className="fa-header-secondary-body-col fa-header-secondary-body-col-right">
							{this.props.children}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Header;

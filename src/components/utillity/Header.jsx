import React, { Component } from 'react';

import Icon from './Icon';

class Header extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div
				className={`fa-header-secondary fa-section-shadow ${
					this.props.disabled ? 'error fa-disabled' : ''
				} ${this.props.invalid ? 'error fa-invalid' : ''}`}
			>
				<div className="fa-container">
					<div className="fa-header-secondary-body">
						<div
							className="fa-header-secondary-prev"
							onClick={this.props.onBackClick}
						>
							<Icon name="back" width="19" height="18" color="#FFFFFF" />
						</div>
						<div className="fa-header-secondary-body-col fa-header-secondary-body-col-left">
							<div>
								<div className="fa-header-secondary-body-sub">
									{this.props.subtitle}
								</div>
								<div className="fa-header-secondary-body-title">
									{this.props.title}
								</div>
							</div>
							<div className="fa-padding-left-sm">
								{this.props.status ? (
									<span className="fa-chip fa-chip-transparent">
										{this.props.status}
									</span>
								) : (
									''
								)}
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

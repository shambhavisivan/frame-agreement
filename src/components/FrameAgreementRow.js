import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Icon from './utillity/Icon';

import './FrameAgreementRow.css';

class FrameAgreementRow extends React.Component {
	constructor(props) {
		super(props);
		this.statusClass =
			'badge ' +
			(this.props.agreement.csconta__Status__c === 'Draft' ? '' : 'badge-dark');
		this.showMenu = this.showMenu.bind(this);
		this.onBlur = this.onBlur.bind(this);

		this.menu = React.createRef();

		this.state = {
			menu: false
		};
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

	menuAction(action) {
		this.onBlur();
		this.props.menuAction(action);
	}

	render() {
		return (
			<div className="fa-row-container">
				{this.state.menu && (
					<ul
						ref={this.menu}
						tabIndex="0"
						className="menu"
						onBlur={this.onBlur}
					>
						<li onClick={() => this.menuAction('edit')}>
							<Icon name="edit" height="14" width="14" color="#0070d2" />
							Edit
						</li>
						<li onClick={() => this.menuAction('clone')}>
							<Icon name="copy" height="14" width="14" color="#0070d2" />
							Clone
						</li>
						<li onClick={() => this.menuAction('delete')}>
							<Icon name="delete" height="14" width="14" color="#0070d2" />
							Delete
						</li>
					</ul>
				)}

				<div className="fa-row-menu-container" onClick={this.showMenu}>
					<Icon
						name="threedots_vertical"
						width="16"
						height="16"
						color="#0070d2"
					/>
				</div>

				<Link
					className="fa-row-text-container"
					to={`/agreement/${this.props.agreement.Id}`}
				>
					<span className="fa-row-text">
						{this.props.agreement.csconta__Agreement_Name__c}
					</span>

					<span className={this.statusClass}>
						{this.props.agreement.csconta__Status__c}
					</span>
				</Link>
			</div>
		);
	}
}
export default FrameAgreementRow;

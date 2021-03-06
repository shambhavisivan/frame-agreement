import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { isMaster } from '../utils/shared-service';

import Icon from './utillity/Icon';

class FrameAgreementRow extends React.Component {
	constructor(props) {
		super(props);
		this.statusClass =
			'fa-chip ' +
			(this.props.agreement.csconta__Status__c === 'Draft' ? 'fa-chip--draft' : 'fa-chip--active');

		this.showMenu = this.showMenu.bind(this);
		this.hideMenu = this.hideMenu.bind(this);

		this.state = {
			menu: false
		};

		this.setWrapperRef = this.setWrapperRef.bind(this);
		this.handleClickOutside = this.handleClickOutside.bind(this);
	}

	componentDidMount() {
		document.addEventListener('mousedown', this.handleClickOutside);
	}

	componentWillUnmount() {
		document.removeEventListener('mousedown', this.handleClickOutside);
	}

	setWrapperRef(node) {
		this.wrapperRef = node;
	}

	handleClickOutside(event) {
		if (
			this.wrapperRef &&
			!this.wrapperRef.contains(event.target) &&
			event.target.localName !== 'svg'
		) {
			this.hideMenu();
		}
	}

	showMenu() {
		this.setState({ menu: !this.state.menu });
	}

	hideMenu() {
		this.setState({
			menu: false
		});
	}

	menuAction(action) {
		this.hideMenu();
		this.props.menuAction(action);
	}

	render() {
		let _master = isMaster(this.props.agreement);

		return (
			<div className="fa-panel">
				<Link className="fa-panel-item" to={`/agreement/${this.props.agreement.Id}`}>
					<div className="fa-panel-body">
						<div className="fa-panel-body-col">
							<span>{this.props.agreement.csconta__Agreement_Name__c || '-- anonymous --'}</span>
						</div>
						<div>
							{_master ? (
								<span className="fa-chip fa-chip--master">{window.SF.labels.fa_master_chip}</span>
							) : null}

							{!_master && this.props.agreement.csconta__Status__c ? (
								<span className={this.statusClass}>
									{window.SF.fieldLabels.statuses[this.props.agreement.csconta__Status__c] ||
										this.props.agreement.csconta__Status__c}
								</span>
							) : (
								''
							)}
						</div>
					</div>
				</Link>
				<div className="fa-icon fa-icon-group" onClick={this.showMenu}>
					<button
						className="fa-panel__button"
						aria-label="Dropdown button"
						aria-expanded={this.state.menu}
					>
						<Icon name="threedots_vertical" width="16" height="16" color="#0070d2" />
					</button>
				</div>
				{this.state.menu && !this.props.disabled && (
					<div
						className="fa-dropdown fa-dropdown--secondary"
						aria-hidden={!this.state.menu}
						ref={this.setWrapperRef}
					>
						<button className="fa-dropdown__button" onClick={() => this.menuAction('edit')}>
							<Icon name="edit" height="14" width="14" color="#0070d2" />
							<span>{window.SF.labels.faMenuActionEdit}</span>
						</button>
						<button className="fa-dropdown__button" onClick={() => this.menuAction('clone')}>
							<Icon name="copy" height="14" width="14" color="#0070d2" />
							<span>{window.SF.labels.faMenuActionClone}</span>
						</button>
						<button className="fa-dropdown__button" onClick={() => this.menuAction('delete')}>
							<Icon name="delete" height="14" width="14" color="#0070d2" />
							<span>{window.SF.labels.faMenuActionDelete}</span>
						</button>
						<button className="fa-dropdown__button" onClick={() => this.menuAction('accounts')}>
							<Icon name="people" height="14" width="14" color="#0070d2" />
							<span>{window.SF.labels.faMenuActionAccounts}</span>
						</button>
					</div>
				)}
			</div>
		);
	}
}

export default FrameAgreementRow;

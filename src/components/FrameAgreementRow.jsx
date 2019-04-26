import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Icon from './utillity/Icon';

class FrameAgreementRow extends React.Component {
	constructor(props) {
		super(props);
		this.statusClass =
			'fa-chip ' +
			(this.props.agreement.csconta__Status__c === 'Draft'
				? ''
				: 'fa-chip-dark');

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
		return (
			<div className="fa-panel">
				<Link
					className="fa-panel-item"
					to={`/agreement/${this.props.agreement.Id}`}
				>
					<div className="fa-panel-body">
						<div className="fa-panel-body-col">
							{this.props.agreement.csconta__Agreement_Name__c ||
								'-- anonymous --'}
						</div>
						<div className="fa-panel-body-col">
							<span className={this.statusClass}>
								{this.props.agreement.csconta__Status__c}
							</span>
						</div>
					</div>
				</Link>
				<div className="fa-icon fa-icon-group" onClick={this.showMenu}>
					<button
						className="fa-panel__button"
						aria-label="Dropdown button"
						aria-expanded={this.state.menu}
					>
						<Icon
							name="threedots_vertical"
							width="16"
							height="16"
							color="#0070d2"
						/>
					</button>
				</div>
				{this.state.menu && (
					<div
						className="fa-dropdown fa-dropdown-secondary"
						aria-hidden={!this.state.menu}
						ref={this.setWrapperRef}
					>
						<button
							className="fa-dropdown-button"
							onClick={() => this.menuAction('edit')}
						>
							<Icon name="edit" height="14" width="14" color="#0070d2" />
							<span>{window.SF.labels.faMenuActionEdit}</span>
						</button>
						<button
							className="fa-dropdown-button"
							onClick={() => this.menuAction('clone')}
						>
							<Icon name="copy" height="14" width="14" color="#0070d2" />
							<span>{window.SF.labels.faMenuActionClone}</span>
						</button>
						<button
							className="fa-dropdown-button"
							onClick={() => this.menuAction('delete')}
						>
							<Icon name="delete" height="14" width="14" color="#0070d2" />
							<span>{window.SF.labels.faMenuActionDelete}</span>
						</button>
					</div>
				)}
			</div>
		);
	}
}

export default FrameAgreementRow;

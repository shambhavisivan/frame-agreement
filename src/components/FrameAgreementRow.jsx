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
			<div className="fa-panel">
				<div className="fa-icon fa-icon-group" onClick={this.showMenu}>
					<Icon
						name="threedots_vertical"
						width="16"
						height="16"
						color="#0070d2"
					/>
					{this.state.menu && (
						<ul
							className="fa-dropdown"
							ref={this.menu}
							tabIndex="0"
							onBlur={this.onBlur}
						>
							<li
								className="fa-dropdown-item"
								onClick={() => this.menuAction('edit')}
							>
								<Icon name="edit" height="14" width="14" color="#0070d2" />
								{window.SF.labels.faMenuActionEdit}
							</li>
							<li
								className="fa-dropdown-item"
								onClick={() => this.menuAction('clone')}
							>
								<Icon name="copy" height="14" width="14" color="#0070d2" />
								{window.SF.labels.faMenuActionClone}
							</li>
							<li
								className="fa-dropdown-item"
								onClick={() => this.menuAction('delete')}
							>
								<Icon name="delete" height="14" width="14" color="#0070d2" />
								{window.SF.labels.faMenuActionDelete}
							</li>
						</ul>
					)}
				</div>
				<Link
					className="fa-panel-body"
					to={`/agreement/${this.props.agreement.Id}`}
				>
					<div className="fa-panel-body-col">
						{this.props.agreement.csconta__Agreement_Name__c}
					</div>
					<div className="fa-panel-body-col">
						<span className={this.statusClass}>
							{this.props.agreement.csconta__Status__c}
						</span>
					</div>
				</Link>
			</div>
		);
	}
}
export default FrameAgreementRow;

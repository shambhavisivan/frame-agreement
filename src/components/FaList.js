import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { confirmAlert } from 'react-confirm-alert';

import { withRouter } from 'react-router-dom';
import {
	getFrameAgreements,
	cloneFrameAgreement,
	deleteFrameAgreement
} from '../actions';

import FrameAgreementRow from './FrameAgreementRow';
import InputSearch from './utillity/inputs/InputSearch';
import ConfirmationModal from './modals/ConfirmationModal';

import './FaList.css';

class FaList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchTerm: ''
		};
		this.onSearchChange = this.onSearchChange.bind(this);
	}

	onSearchChange(value) {
		console.log(value);
		this.setState({
			searchTerm: value
		});
	}

	faMenuAction(action, faId) {
		console.log(action);
		console.log(faId);

		switch (action) {
			case 'clone':
				confirmAlert({
					customUI: ({ onClose }) => {
						return (
							<ConfirmationModal
								title="Clone Frame Agreement"
								message="Are you sure you want to clone this frame agreement?"
								onCancel={onClose}
								onConfirm={() => {
									this.props.cloneFrameAgreement(faId);
								}}
								confirmText="Clone"
							/>
						);
					}
				});

				break;

			case 'delete':
				confirmAlert({
					customUI: ({ onClose }) => {
						return (
							<ConfirmationModal
								title="Delete Frame Agreement"
								message="Are you sure you want to delete this frame agreement?"
								onCancel={onClose}
								onConfirm={() => {
									this.props.deleteFrameAgreement(faId);
								}}
								confirmText="Delete"
							/>
						);
					}
				});
				break;
			case 'edit':
				console.log('EDIT');
				break;
			default:
		}
	}

	render() {
		return (
			<div className="fa-list">
				<div className="fa-list-header">
					<div className="fa-list-header-compartment">
						<div className="header-row">
							<div className="logo-container">
								<h1>Frame Agreement Negotiation Console</h1>
								<i className="cloudsense-logo" />
							</div>
							<div className="action-container">
								<button className="slds-button slds-button--brand link-button">
									<Link to="/agreement">Add new Agreement</Link>
								</button>
							</div>
						</div>
						<div className="header-row" style={{ justifyContent: 'center' }}>
							<div className="search-container">
								<InputSearch onChange={this.onSearchChange} />
							</div>
						</div>
						<div
							className="header-row"
							style={{ justifyContent: 'flex-start' }}
						>
							<div className="label-text">Agreement list</div>
						</div>
					</div>
				</div>
				<div className="fa-list-body">
					{Object.values(this.props.frameAgreements)
						.filter(fa => {
							if (this.state.searchTerm) {
								if (
									fa.csconta__Agreement_Name__c
										.toLowerCase()
										.includes(this.state.searchTerm.toLowerCase())
								) {
									return true;
								} else {
									return false;
								}
							} else return true;
						})
						.map(fa => {
							return (
								<FrameAgreementRow
									menuAction={(action, data) => {
										this.faMenuAction(action, fa.Id);
									}}
									key={fa.Id}
									agreement={fa}
								/>
							);
						})}

					{!Object.keys(this.props.frameAgreements).length && (
						<div className="add-product-box" style={{ border: 'none' }}>
							<span className="box-header-1">
								There are no Frame Agreements in here
							</span>
							<span className="box-header-2">
								Create at least one frame agreements
							</span>
							<div className="box-button-container" />
						</div>
					)}
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return { frameAgreements: state.frameAgreements };
};

const mapDispatchToProps = {
	getFrameAgreements,
	deleteFrameAgreement,
	cloneFrameAgreement
};

// const RcmModal = connect(null, mapDispatchToProps)(ConnectedForm);

/*
                <h4>FA PICKER account - {window.SF.param.account}</h4>
                <span><Link to='/agreement'>New Agreement</Link></span>
                    <ul>
                      {Object.values(this.props.frameAgreements).map(fa => {
                         return (
                            <li key={fa.Id}>
                                <Link to={`/agreement/${fa.Id}`}>{fa.Name}</Link>
                            </li>
                          );
                        })}
                    </ul>
*/

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(FaList)
);

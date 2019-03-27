import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { confirmAlert } from 'react-confirm-alert';
import CloudSenseLogo from '../../dist/cloudsense.png';

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
								title={window.SF.labels.alert_cloneFa_title}
								message={window.SF.labels.alert_cloneFa_message}
								onCancel={onClose}
								onConfirm={() => {
									this.props.deleteFrameAgreement(faId);
								}}
								confirmText={window.SF.labels.alert_cloneFa_btn_action}
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
			<div>
				<div className="fa-main-header">
					<div className="fa-container">
						<div className="fa-main-header-container">
								<div className="fa-main-header-item">
									<div className="fa-main-header-group">
										<img className="cloudsense-logo" src={CloudSenseLogo} alt="CloudSense Logo" />
										<h5 className="fa-main-header-title">{window.SF.labels.frameAgreementTitle}</h5>
									</div>
								</div>
								<div className="fa-main-header-item">
									<div className="fa-main-header-search">
										<InputSearch onChange={this.onSearchChange} />
										<Link className="fa-button" to="/agreement">{window.SF.labels.btn_AddNewAgreement}</Link>
									</div>
								</div>
								<div className="fa-main-header-item">
									<h5 className="fa-main-header-title">{window.SF.labels.frameAgreementListTitle}</h5>
								</div>
						</div>
					</div>
				</div>
				<div className="fa-container">
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
								{window.SF.labels.no_fa_message}
							</span>
							<span className="box-header-2">
								{window.SF.labels.no_fa_message_2}
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

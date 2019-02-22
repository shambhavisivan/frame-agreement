import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { withRouter } from 'react-router-dom';
import { getFrameAgreements } from '../actions';

import FrameAgreementRow from './FrameAgreementRow';
import InputSearch from './utillity/inputs/InputSearch';

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
							return <FrameAgreementRow key={fa.Id} agreement={fa} />;
						})}
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return { frameAgreements: state.frameAgreements };
};

const mapDispatchToProps = {
	getFrameAgreements
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

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
			<div>
				<div className="header">
					<div className="container">
						<div className="grid grid-sm">
							<div className="grid-item w-6-md">
								<h5 class="header-col-title">Frame Agreement Negotiation Console</h5>
								<i className="cloudsense-logo" />
							</div>
							<div className="grid-item w-6-md">
								<div className="header-search">
									<InputSearch onChange={this.onSearchChange} />
									<Link className="button margin-left-xsm slds-button slds-button--brand link-button" to="/agreement">Add new Agreement</Link>
								</div>
							</div>
							<div className="grid-item w-12">
								<h5 class="header-col-title">Agreement list</h5>
							</div>
						</div>
					</div>
				</div>
				<div className="container">
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

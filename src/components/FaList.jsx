import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { confirmAlert } from 'react-confirm-alert';
// import CloudSenseLogo from '../../dist/cloudsense.png';

import { withRouter } from 'react-router-dom';
import {
	registerMethod,
	loadAccounts,
	getFrameAgreements,
	cloneFrameAgreement,
	saveFrameAgreement,
	createFrameAgreement,
	deleteFrameAgreement
} from '../actions';

import { publish } from '~/src/api';
import { getFieldLabel } from '~/src/utils/shared-service.js';

import FrameAgreementRow from './FrameAgreementRow';
import InputSearch from './utillity/inputs/InputSearch';
import Toaster from './utillity/Toaster';

import CustomButtonDropdown from './utillity/CustomButtonDropdown';

import ConfirmationModal from './modals/ConfirmationModal';
import AccountsModal from './modals/AccountsModal';
import ActionIframe from '~/src/components/modals/ActionIframe';

const faSort = (ob1, ob2) => {
	if (ob1.LastModifiedDate < ob2.LastModifiedDate) {
		return 1;
	} else if (ob1.LastModifiedDate > ob2.LastModifiedDate) {
		return -1;
	}
	return 0;
};

class FrameAgreement {
	constructor(status, type) {
		this.Id = null;
		this.csconta__Agreement_Name__c = '';
		this.csconta__Status__c = status;
		this.csconta__Account__c = window.SF.param.account;
		this.csconta__Status__c = status;
		this.csconta__Valid_From__c = null;
		this.csconta__Valid_To__c = null;
		this.csconta__agreement_level__c = type;

		this._ui = {
			approval: {
				listProcess: []
			},
			approvalNeeded: false,
			commercialProducts: [],
			attachment: {
				custom: '',
				products: {}
			}
		};
	}
}

class FaList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			searchTerm: '',
			accountsModal: false,
			loadedAccounts: [],
			actionIframe: false,
			actionIframeUrl: '',
			actionIframeObject: null
		};
		this.onSearchChange = this.onSearchChange.bind(this);
		this.onAccountsSave = this.onAccountsSave.bind(this);
		this.createFrameAgreement = this.createFrameAgreement.bind(this);

		this.callHandler = this.callHandler.bind(this);
		this.onCloseIframe = this.onCloseIframe.bind(this);

		window.FAM.registerMethod = this.props.registerMethod;
	}

	componentDidMount() {
		// initial load accounts loadAccounts
		let params = {};
		params.pointedObject = 'Account';
		params.columns = this.props.settings.FACSettings.account_fields || ['Name'];
		params.whereClause = null;
		params.lastId = null;
		params.offset = 20 * 10;

		if (!this.props.accounts.length) {
			this.props.loadAccounts(params);
		}
	}

	async callHandler(btnObj) {
		if (!this.props.handlers.hasOwnProperty(btnObj.method)) {
			this.props.createToast(
				'error',
				window.SF.labels.toast_invalid_handler_title,
				window.SF.labels.toast_invalid_handler + ' (' + btnObj.method + ')'
			);
			return;
		}

		let result = await this.props.handlers[btnObj.method]();
		switch (btnObj.type) {
			case 'action':
				console.log(result);
				break;
			case 'iframe':
				this.setState({
					actionIframe: true,
					actionIframeUrl: result,
					actionIframeObject: btnObj
				});
				break;
			case 'redirect':
				console.log(result);
				window.location.replace(result);
				break;
			default:
		}
	}

	onCloseIframe() {
		publish('onIframeClose', this.state.actionIframeObject.id);

		this.setState({
			actionIframe: false,
			actionIframeUrl: null,
			actionIframeObject: null
		});
	}

	onSearchChange(value) {
		this.setState({
			searchTerm: value
		});
	}

	createFrameAgreement(type) {
		type = type === 'master' ? 'Master Agreement' : 'Frame Agreement';
		let newFa = new FrameAgreement(
			this.props.settings.FACSettings.statuses.draft_status,
			type
		);

		this.props.createFrameAgreement(newFa).then(upsertedFa => {
			this.props.history.push('/agreement/' + upsertedFa.Id);
		});
	}

	onAccountsSave(faId, newAccId) {
		let data = {
			Id: faId,
			csconta__Account__c: newAccId
		};

		return this.props.saveFrameAgreement(
			this.props.frameAgreements[faId],
			data
		);
	}

	faMenuAction(action, faId) {
		switch (action) {
			case 'clone':
				confirmAlert({
					customUI: ({ onClose }) => {
						return (
							<ConfirmationModal
								title={window.SF.labels.alert_cloneFa_title}
								message={window.SF.labels.alert_cloneFa_message}
								onCancel={onClose}
								onConfirm={() => {
									this.props.cloneFrameAgreement(faId);
								}}
								confirmText={window.SF.labels.alert_cloneFa_btn_action}
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
								title={window.SF.labels.alert_deleteProducts_title}
								message={window.SF.labels.alert_deleteProducts_message}
								onCancel={onClose}
								onConfirm={() => {
									this.props.deleteFrameAgreement(faId);
								}}
								confirmText={window.SF.labels.alert_deleteProducts_btn_action}
							/>
						);
					}
				});
				break;
			case 'edit':
				this.props.history.push('/agreement/' + faId);
				break;

			case 'accounts':
				// this.props.history.push('/agreement/' + faId);
				this.setState({ accountsModal: faId });
				break;
			default:
		}
	}

	onCloseAccountsModal() {
		this.setState({ accountsModal: false });
	}

	render() {
		// *******************************************************
		let customButtonContainer = '';

		let customButtons = this.props.settings.ButtonCustomData.filter(
			btnObj => btnObj.location === 'List'
		);

		customButtonContainer = (
			<React.Fragment>
				{customButtons.map((btnObj, i) => {
					return (
						<button
							key={btnObj.id + i}
							id={btnObj.id}
							onClick={() => {
								this.callHandler(btnObj);
							}}
							className="fa-button fa-button--brand"
						>
							{btnObj.label}
						</button>
					);
				})}
			</React.Fragment>
		);
		// *******************************************************

		let _createFaDropdownData = [
			{
				type: 'child',
				label: getFieldLabel('misc', 'Frame Agreement'),
				id: 'createnewchild',
				method: null
			},
			{
				type: 'master',
				label: getFieldLabel('misc', 'Master Agreement'),
				id: 'createnewmaster',
				method: null
			}
		];

		return (
			<div className="fa-app">
				<Toaster />

				{this.state.accountsModal && (
					<AccountsModal
						open={!!this.state.accountsModal}
						faId={this.state.accountsModal}
						accountFields={this.props.settings.FACSettings.account_fields}
						onAccountsSave={this.onAccountsSave}
						onLoadRecords={params => {
							return this.props.loadAccounts(params);
						}}
						records={this.props.accounts}
						onCloseModal={() => this.onCloseAccountsModal()}
					/>
				)}

				<div className="fa-main-header">
					<div className="fa-main-header__inner">
						<div className="fa-main-header__item">
							<img
								className="fa-app-icon"
								src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAYAAAA5ZDbSAAADYklEQVR4Ae3dA4xsCRYG4POMtW3bwdoM1/bu2FY8tq14bNsIRtHY9rO/sae7C3de36r+v+TESdW1DioiIiIiIiIiIiIiIiIiIiIiIiIiIiIi2gtvxj9xLG7AvGfjBhyLf+LNNVgC07EBHjG2R7ABple0H96JC3XvQryjor3wVtygdzfgrRXtg8k4U//OxOSKdsFfNOfPFe2BKbhNc27DlIp2wLc171sV7YBtNW/binbAUZp3ZEU74GLNu7iiHXCW5p1Z0Q44XPMOr2gHrKl5a1S0Az6geR+oaA8cpznHVbQLPoNl+rcMn65oH6yhf6tXtBMmYdu8vRpy+Afm6dw8/KNicOBd2BtzjGwO9sa7KgYTpuOnWA87Phvr4afJw4qIiIiIiHGCN+Gr+DoSfBVvqmGA72OBeLkF+H4NOtwmRnLrMCSkLxYjWYwpNciwsxjJzjUM8D88JgAew/9qmOC9OE4ci/fUsMJvcZ+J5178piYCvAUHmzgOxltqosGPcLPhdRN+WBMZZmMnLDM8lmFHzK54Br6Oawy+q/H1ilfCNGyBRQbPImyOqRWjw6dwkcFxIT5V0TlMwmqYo70ex2qYVL0JvB8naZ8T8f6KZuB/2uP/Fc3DnsbfwRWvDfzR+PtPxVAfwXtUDHV2yK0VzcMXtMfnK5qFzbXHZhXNwmXa49KK5uCdWK4/j2KHZ+NR/VmOd1Q0A//Sn9vwkXoWPoLb9eefFc3AsXp3Lz5eL4OP4169O6aif5iBeXrzED5fI8Dn8bDezMWMiv7gF3ozB1+vMeAbmKM3P6/oD/bRvQX4bnUI38UC3du7oj+4Q3cW42fVJfwci3Xn9ore4cu6swy/6TNne5nufKmiN9hK51bg7w01UVuhc1tW9AZX6twa49R/+orqXuA9WKEzm1bDsJnOrMC7qzuB/+rMNi0Y1/Of6k7gBGPboyVJBsdXdA4zMd/oDsWklZS+e5jRzcfMis7gV0Z3FKbUSoIpOMroflnRGexnZKdi2jh1rT3VyPat6Azu8urOx6waJ5iFC7y6uyr6GpFzBd5Q4wxvwJVe3btqdIGZuNdLXYu3tmyU/HVe6mZMqbEFPo+bsQKn413VMngXzgJch49UdwJT8x/HEBEREREREREREREREREREREREREREU8Ak/ywHmyNofsAAAAASUVORK5CYII="
							/>
							<div className="fa-main-header__title-wrapper">
								<h5 className="fa-main-header__subtitle">
									{window.SF.labels.frameAgreementTitle}
								</h5>
								<h1 className="fa-main-header__title">
									{this.props.settings.account.Name}
								</h1>
							</div>
						</div>
						<div className="fa-main-header__item">
							<div className="fa-main-header__search">
								<InputSearch onChange={this.onSearchChange} bordered={true} />

								{this.props.settings.FACSettings.new_frame_agreement ? (
									<CustomButtonDropdown
										className="fa-dropdown"
										brand={true}
										label={window.SF.labels.btn_AddNewAgreement}
										buttons={_createFaDropdownData}
										onAction={btnObj => {
											this.createFrameAgreement(btnObj.type);
										}}
									/>
								) : (
									''
								)}

								{customButtonContainer}
							</div>
						</div>
					</div>
				</div>
				<div className="fa-main-body">
					<div className="fa-main-body__inner">
						{Object.values(this.props.frameAgreements)
							.sort(faSort)
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
							<div className="add-product-box">
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

				{this.state.actionIframe && this.state.actionIframeUrl && (
					<ActionIframe
						onCloseIframe={this.onCloseIframe}
						open={this.state.actionIframe}
						config={this.state.actionIframeObject}
						url={this.state.actionIframeUrl}
					/>
				)}
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		frameAgreements: state.frameAgreements,
		settings: state.settings,
		accounts: state.accounts,
		handlers: state.handlers
	};
};

const mapDispatchToProps = {
	registerMethod,
	loadAccounts,
	getFrameAgreements,
	saveFrameAgreement,
	cloneFrameAgreement,
	createFrameAgreement,
	deleteFrameAgreement
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(FaList)
);

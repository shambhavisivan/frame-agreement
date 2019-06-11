import React, { Component } from 'react';
import Modal from 'react-responsive-modal';

import { decodeEntities } from '../../utils/shared-service';
import Lookup from '../utillity/Lookup';
import Icon from '../utillity/Icon';

class AccountsModal extends Component {
	constructor(props) {
		super(props);

		// this.props.faId
		// this.props.open
		// this.props.onCloseModal
		// this.props.onAccountsSave
		// this.props.records
		// this.props.onLoadRecords

		this.onCloseModal = this.onCloseModal.bind(this);
		this.onSearchChange = this.onSearchChange.bind(this);

		this.state = {
			mode: 'main',
			main_acc: {},
			associated_accounts: {},
			selected: {},
			count: 0,
			loadingRecords: false,
			loadingOverlay: true,
			searchValue: '',
			searchedRecords: [],
			page: 1
		};
	}

	componentDidMount() {
		window.SF.invokeAction('getAccountsInformation', [
			this.props.faId,
			null
		]).then(
			r => {
				let associated_accounts = {};
				if (r.associated_accounts && r.associated_accounts.length) {
					r.associated_accounts.forEach(acc => {
						associated_accounts[acc.Id] = {
							Id: acc.Id, // Id of association
							accId: acc.csconta__Account__r.Id,
							accName: decodeEntities(acc.csconta__Account__r.Name)
						};
					});
				}

				this.setState({
					count: r.count,
					main_acc: r.main_account,
					loadingOverlay: false,
					associated_accounts
				});
			},
			err => {}
		);
	}

	onCloseModal() {
		this.setState(
			{
				selected: {},
				loadingOverlay: false,
				searchValue: '',
				page: 1
			},
			() => {
				this.props.onCloseModal();
			}
		);
	}

	_delayUnload(callback = () => {}) {
		// The actions of add/remove associations are as cheap, quick and easy to do on UI.
		// But for the sake of governing limits, we cannot afford spamming of this action.
		// therefore there is a motivation to make this action harder to abuse.
		setTimeout(() => {
			this.setState({ loadingOverlay: false }, () => {
				callback();
			});
		}, 1000);
	}

	selectRecord(record) {
		this.setState({ loadingOverlay: true });

		if (this.state.mode === 'main') {
			this.props.onAccountsSave(this.props.faId, record.Id).then(
				response => {
					this._delayUnload(() => {
						this.setState({
							main_acc: record
						});
					});
				},
				error => {
					this.setState({ loadingOverlay: false });
				}
			);
		} else {
			if (this.state.associated_accounts[record.Id]) {
				this.onRemoveAssociation(record.Id);
			} else {
				window.SF.invokeAction('addAccountAssociation', [
					this.props.faId,
					record.Id
				]).then(
					response => {
						let _newAccountAssoc = {
							Id: response.Id,
							accId: response.csconta__Account__c,
							accName: decodeEntities(response.csconta__Account__r.Name)
						};
						let _associations = this.state.associated_accounts;
						_associations[response.Id] = _newAccountAssoc;

						this._delayUnload(() => {
							this.setState({
								associated_accounts: _associations
							});
						});
					},
					error => {
						this.setState({ loadingOverlay: false });
					}
				);
			}
		}
	}

	onRemoveAssociation(assocId) {
		// deleteAccountAssociation(String assocId)
		this.setState({ loadingOverlay: true });

		let associated_accounts = this.state.associated_accounts;
		delete associated_accounts[assocId];
		this.setState({ associated_accounts });

		window.SF.invokeAction('deleteAccountAssociation', [assocId]).then(
			response => {
				this._delayUnload();
			}
		);
	}

	changeMode(mode) {
		this.setState({
			mode: mode,
			page: 1,
			searchValue: '',
			loadingRecords: false,
			loadingOverlay: false,
			searchedRecords: [],
			selected: {}
		});
	}

	pagesToLoad(newPage) {
		let page = newPage;
		let max_items = this.state.count;
		let max_pages = Math.ceil(max_items / 20);

		let min_pages = page >= 7 ? page + 4 : 10;

		let _data = this.state.searchValue
			? this.state.searchedRecords
			: this.props.records;

		var _needPages = Math.min(min_pages, max_pages);
		var _availablePages = Math.ceil(_data.length / 20);

		console.log('*****************************************');
		console.log('You need this much pages:', _needPages);
		console.log(
			'You need this much results:',
			Math.min(max_items, min_pages * 20)
		);
		console.log('This many pages are loaded:', _availablePages);

		let result = _needPages - _availablePages;
		return result < 0 ? 0 : result;

		// return Math.ceil(this.state.records.length / this.state.pagination.pageSize);
	}

	getRecordPage(newPage) {
		let pagesToLoad = this.pagesToLoad(newPage);
		console.warn('Loading ' + pagesToLoad + ' page(s)');

		let parameter = {};

		parameter.pointedObject = 'Account';
		parameter.columns = ['Name'];
		parameter.whereClause = null;
		parameter.lastId = this.props.records[this.props.records.length - 1].Id;
		parameter.offset = 20 * pagesToLoad;

		if (this.state.searchValue) {
			parameter.search = "Name  like '%" + this.state.searchValue + "%'";
			return window.SF.invokeAction('getLookupRecords', [
				JSON.stringify(parameter)
			]);
		} else {
			return this.props.onLoadRecords(parameter);
		}
	}

	onPageChange(newPage) {
		// Fallback for clicky users
		if (this.state.loadingRecords) {
			return;
		}

		let needToLoad = !!this.pagesToLoad(newPage);

		this.setState({
			page: newPage,
			loadingRecords: needToLoad
		});

		if (needToLoad) {
			this.getRecordPage(newPage).then(newSet => {
				this.setState({
					searchedRecords: this.state.searchValue
						? [...this.state.searchedRecords, ...newSet]
						: [],
					loadingRecords: false
				});
			});
		}
	}

	onSearchChange(val) {
		// onSearchChange is isolated event
		// it will not be bubbled to parent component as the scope of lookup results
		// is relevant to this component only

		// onSearchChange is, in comparison to add/remove association actions, already
		this.setState(
			{
				page: 1,
				searchValue: val,
				loadingOverlay: true,
				loadingRecords: val && val !== ''
			},
			() => {
				let params = {};

				if (val && val !== '') {
					params.search = "Name like '%" + val + "%'";
				} else {
					this.setState({ searchedRecords: [] });
					return;
				}

				params.pointedObject = 'Account';
				params.columns = ['Name'];
				params.whereClause = null;
				params.lastId = null;
				params.offset = 20 * 10;

				let _promiseArr = [];

				_promiseArr.push(
					window.SF.invokeAction('getLookupRecords', [JSON.stringify(params)])
				);

				if (params.search) {
					_promiseArr.push(
						window.SF.invokeAction('getAccountsInformation', [
							this.props.faId,
							params.search
						])
					);
				}

				Promise.all(_promiseArr).then(
					response => {
						let records = response[0];
						let info = response[1] || {};

						this.setState({
							count: params.search ? info.count : this.props.count,
							searchedRecords: records,
							loadingOverlay: false,
							loadingRecords: false
						});
					},
					error => {
						this.setState({
							loadingOverlay: false,
							loadingRecords: false
						});
					}
				);
			}
		);
	}

	render() {
		let _main;
		let _empty_assoc;

		if (this.state.main_acc.Id) {
			_main = (
				<p className="vertical-tab-subtitle">
					<span>{this.state.main_acc.Name}</span>
					<Icon name="check" height="12" width="12" color="#4bca81" />
				</p>
			);
		} else if (this.state.loadingOverlay) {
			_main = <p className="vertical-tab-subtitle" />;
		} else {
			_main = (
				<p className="vertical-tab-subtitle">
					{window.SF.labels.accounts_modal_no_main}
				</p>
			);
		}

		_empty_assoc = (
			<p className="vertical-tab-subtitle">
				<span>
					{this.state.loadingOverlay
						? ''
						: window.SF.labels.accounts_modal_no_assoc}
				</span>
			</p>
		);

		return (
			<Modal
				classNames={{
					overlay: 'overlay',
					modal: 'modal fa-modal',
					closeButton: 'close-button'
				}}
				closeIconSvgPath={
					<path d="M14.3 11.7l6-6c.3-.3.3-.7 0-1l-.9-1c-.3-.2-.7-.2-1 0l-6 6.1c-.2.2-.5.2-.7 0l-6-6.1c-.3-.3-.7-.3-1 0l-1 1c-.2.2-.2.7 0 .9l6.1 6.1c.2.2.2.4 0 .6l-6.1 6.1c-.3.3-.3.7 0 1l1 1c.2.2.7.2.9 0l6.1-6.1c.2-.2.4-.2.6 0l6.1 6.1c.2.2.7.2.9 0l1-1c.3-.3.3-.7 0-1l-6-6c-.2-.2-.2-.5 0-.7z" />
				}
				open={this.props.open}
				onClose={this.onCloseModal}
				center
			>
				<div className="fa-modal-header">
					<button className="close-modal-button" onClick={this.onCloseModal}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 52 52"
						>
							<path
								fill="#fff"
								d="m31 25.4l13-13.1c0.6-0.6 0.6-1.5 0-2.1l-2-2.1c-0.6-0.6-1.5-0.6-2.1 0l-13.1 13.1c-0.4 0.4-1 0.4-1.4 0l-13.1-13.2c-0.6-0.6-1.5-0.6-2.1 0l-2.1 2.1c-0.6 0.6-0.6 1.5 0 2.1l13.1 13.1c0.4 0.4 0.4 1 0 1.4l-13.2 13.2c-0.6 0.6-0.6 1.5 0 2.1l2.1 2.1c0.6 0.6 1.5 0.6 2.1 0l13.1-13.1c0.4-0.4 1-0.4 1.4 0l13.1 13.1c0.6 0.6 1.5 0.6 2.1 0l2.1-2.1c0.6-0.6 0.6-1.5 0-2.1l-13-13.1c-0.4-0.4-0.4-1 0-1.4z"
							/>
						</svg>
					</button>
					<h2 className="fa-modal-header-title">Accounts</h2>
				</div>

				<div className="accounts-modal fa-modal-body">
					<div className="accounts-modal--left">
						<div
							className={
								'vertical-tab ' +
								(this.state.mode === 'main' ? 'vertical-tab-selected' : '')
							}
							onClick={() => this.changeMode('main')}
						>
							<h3>Account</h3>
							<div className="vertical-tab-subtitle-wrapper">{_main}</div>
						</div>

						<div
							className={
								'vertical-tab ' +
								(this.state.mode === 'assoc' ? 'vertical-tab-selected' : '')
							}
							onClick={() => this.changeMode('assoc')}
						>
							<h3>Associations</h3>
							<div className="vertical-tab-subtitle-wrapper">
								{Object.values(this.state.associated_accounts).map(acc => {
									return (
										<p key={acc.Id} className="vertical-tab-subtitle">
											<span>{acc.accName}</span>
											<Icon
												onClick={() => this.onRemoveAssociation(acc.Id)}
												name="close"
												height="14"
												width="14"
												color="#0070d2"
											/>
										</p>
									);
								})}
								{Object.values(this.state.associated_accounts).length
									? ''
									: _empty_assoc}
							</div>
						</div>
					</div>
					<div className="accounts-modal--right">
						<Lookup
							key={this.state.mode}
							onChange={record => this.selectRecord(record)}
							onSearch={this.onSearchChange}
							onPageChange={newPage => this.onPageChange(newPage)}
							data={
								this.state.searchValue
									? this.state.searchedRecords
									: this.props.records
							}
							count={this.state.count}
							columns={['Name']}
							selected={this.state.mode === 'main' ? this.state.main_acc : {}}
							disabled={this.state.loadingRecords}
							loading={this.state.loadingOverlay}
						/>
					</div>
				</div>

				<div className="fa-modal-footer">
					<button
						className="fa-button fa-button--default"
						onClick={this.onCloseModal}
					>
						Done
					</button>
				</div>
			</Modal>
		);
	}
}

export default AccountsModal;

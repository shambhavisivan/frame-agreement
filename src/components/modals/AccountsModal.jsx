import React, { Component } from 'react';
import Modal from 'react-responsive-modal';

import { decodeEntities } from '../../utils/shared-service';
import Pagination from '../utillity/Pagination';
import Icon from '../utillity/Icon';
import InputSearch from '../utillity/inputs/InputSearch';

const RecordSkeletonRow = () => {
	let skeletonStyle = {
		width: '120px',
		height: '16px'
	};

	let skeletonContainerStyle = {
		width: '100%',
		borderRadius: '2px',
		background: 'white',
		boxShadow: '0 1px 0 0 rgba(0, 0, 0, 0.22)',
		justifyContent: 'space-between',
		marginBottom: '6px',
		padding: '6px 12px'
	};

	return (
		<div className="skeleton-table-item" style={skeletonContainerStyle}>
			<div className="skeleton-shape" style={skeletonStyle} />
			<div className="skeleton-shape" style={skeletonStyle} />
			<div className="skeleton-shape" style={skeletonStyle} />
			<div className="skeleton-shape" style={skeletonStyle} />
		</div>
	);
};

class AccountsModal extends Component {
	constructor(props) {
		super(props);

		// this.props.faId
		// this.props.open
		// this.props.onCloseModal
		// this.props.onSave
		// this.props.records
		// this.props.onLoadRecords

		/*	To implement:
			deleteAccountAssociation(String assocId)
			addAccountAssociation(String faId, String accountId)
		*/

		this.onOpenAccounts = this.onOpenAccounts.bind(this);
		this.onCloseModal = this.onCloseModal.bind(this);
		this.onSave = this.onSave.bind(this);

		this.state = {
			main_acc: {},
			associated_accounts: [],
			selected: {},
			count: 0,
			loadingRecords: false,
			lookupOpen: false,
			searchValue: '',
			searchedRecords: [],
			page: 1
		};
	}

	componentDidMount() {
		window.SF.invokeAction('getAccountsInformation', [this.props.faId]).then(
			r => {
				console.log(r);
				let associated_accounts = [];
				if (r.associated_accounts && r.associated_accounts.length) {
					associated_accounts = r.associated_accounts.map(acc => {
						return {
							Id: acc.Id, // Id of association
							accId: acc.csconta__Account__r.Id,
							accName: acc.csconta__Account__r.Name
						};
					});
				}

				this.setState({
					count: r.count,
					main_acc: r.main_account,
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
				loadingRecords: false,
				lookupOpen: false,
				searchValue: '',
				page: 1
			},
			() => {
				this.props.onCloseModal();
			}
		);
	}

	selectRecord(record) {
		this.setState({ selected: record });
	}

	onLoadRecords(newRecords) {
		this.props.onLoadRecords(newRecords);
	}

	onOpenAccounts(type) {
		this.setState({ lookupOpen: type, page: 1, loadingRecords: true }, () => {
			if (!this.props.records.length) {
				let params = {};
				params.pointedObject = 'Account';
				params.columns = ['Name'];
				params.whereClause = null;
				params.lastId = null;
				params.offset = 20 * 10;

				// Call remote action
				window.SF.invokeAction('getLookupRecords', [
					JSON.stringify(params)
				]).then(response => {
					this.setState({ loadingRecords: false });

					response = decodeEntities(response);
					this.onLoadRecords(response);
				});
			} else {
				this.setState({ loadingRecords: false });
			}
		});
	}

	onRemoveAssociation(assocId) {
		// deleteAccountAssociation(String assocId)
		window.SF.invokeAction('deleteAccountAssociation', [assocId]).then(
			response => {
				this.setState({
					associated_accounts: [
						...this.state.associated_accounts.filter(acc => acc.Id !== assocId)
					]
				});
			}
		);
	}

	onSave() {
		if (this.state.lookupOpen === 'main') {
			// call remote
			let tempAcc = JSON.parse(JSON.stringify(this.state.selected));
			this.props.onSave(this.props.faId, tempAcc.Id).then(r => {
				this.setState({
					main_acc: tempAcc,
					selected: {},
					lookupOpen: false,
					searchValue: ''
				});
			});
		} else if (this.state.lookupOpen === 'association') {
			// onAddAssociation
			window.SF.invokeAction('addAccountAssociation', [
				this.props.faId,
				this.state.selected.Id
			]).then(
				response => {
					this.setState({
						selected: {},
						searchValue: '',
						lookupOpen: false,
						associated_accounts: [
							...this.state.associated_accounts,
							...[
								{
									Id: response.Id,
									accId: response.csconta__Account__c,
									accName: response.csconta__Account__r.Name
								}
							]
						]
					});
				},
				error => {}
			);
		}
	}

	pagesToLoad(newPage) {
		let page = newPage;
		let max_items = this.state.count;
		let max_pages = Math.ceil(max_items / 20);

		let min_pages = page >= 7 ? page + 4 : 10;

		var _needPages = Math.min(min_pages, max_pages);
		var _availablePages = Math.ceil(this.props.records.length / 20);

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

		if (this.state.searchValue) {
			parameter.search = "Name  like '%" + this.state.searchValue + "%'";
		}

		parameter.lastId = this.props.records[this.props.records.length - 1].Id;
		parameter.offset = 20 * pagesToLoad;

		return window.SF.invokeAction('getLookupRecords', [
			JSON.stringify(parameter)
		]);
	}

	onPageChange(newPage) {
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
				if (!this.state.searchValue) {
					this.onLoadRecords(newSet);
				} else {
					this.setState({
						searchedRecords: [...this.state.searchedRecords, ...newSet]
					});
				}
				this.setState({ loadingRecords: false });
			});
		}
	}

	onSearchChange(val) {
		this.setState(
			{
				page: 1,
				searchValue: val,
				// loadedModal: false,
				loadingRecords: true,
				searchedRecords: val && val !== '' ? this.state.searchedRecords : []
			},
			() => {
				let params = {};
				let infoMergedWhere = null;

				params.pointedObject = 'Account';
				params.columns = ['Name'];
				params.whereClause = null;

				if (val && val !== '') {
					params.search = "Name like '%" + val + "%'";
				} else {
					this.setState({ searchedRecords: [] });
				}

				params.lastId = null;
				params.offset = 20 * 10;

				Promise.all([
					window.SF.invokeAction('getAccountsInformation', [[this.props.faId]]),
					window.SF.invokeAction('getLookupRecords', [JSON.stringify(params)])
				]).then(
					response => {
						let info = response[0];
						let records = decodeEntities(response[1]);

						if (!params.search) {
							this.props.onLoadRecords(records);
						}

						this.setState({
							count: info.count,
							// loadedModal: true,
							searchedRecords: records,
							loadingRecords: false
						});
					},
					error => {
						this.setState({
							// loadedModal: true,
							loadingRecords: false
						});
					}
				);
			}
		);
	}

	render() {
		let footer;
		if (this.state.lookupOpen) {
			footer = (
				<div className="fa-modal-footer">
					<button
						className="fa-button fa-button--default"
						onClick={() => {
							this.setState({ lookupOpen: false });
						}}
					>
						Close
					</button>
					<button
						className="fa-button fa-button--brand"
						disabled={!this.state.selected.Id}
						onClick={() => {
							this.onSave();
						}}
					>
						Save
					</button>
				</div>
			);
		} else {
			footer = (
				<div className="fa-modal-footer">
					<button className="fa-button fa-button--default" onClick={this.onCloseModal}>
						Done
					</button>
				</div>
			);
		}

		let lookup;

		// if ((() => (this.state.searchValue ? this.state.searchedRecords : this.props.records))().length) {
		//   lookup = (
		//     <div className='accounts-lookup'>
		//       <RecordSkeletonRow />
		//       <RecordSkeletonRow />
		//       <RecordSkeletonRow />
		//       <RecordSkeletonRow />
		//       <RecordSkeletonRow />
		//       <RecordSkeletonRow />
		//       <RecordSkeletonRow />
		//       <RecordSkeletonRow />
		//       <RecordSkeletonRow />
		//       <RecordSkeletonRow />
		//     </div>
		//   );
		// } else {
		lookup = (
			<div className="accounts-lookup modal-table-container">
				<div className="modal-navigation">
					<div className="search-container">
						<InputSearch
							placeholder={'Filter accounts'}
							value={this.state.searchValue}
							onChange={val => {
								this.onSearchChange(val);
							}}
						/>
					</div>
				</div>
				<div>
					<div className="fa-modal-product-list-header">
						<span>Name</span>
					</div>
					<div className="fa-modal-product-list">
						{(() =>
							this.state.searchValue
								? this.state.searchedRecords
								: this.props.records)()
							.paginate(this.state.page, 20)
							.map(record => {
								return (
									<div
										key={record.Id}
										className={
											'product-row' +
											(this.state.selected.Id === record.Id ? ' selected' : '')
										}
										onClick={() => this.selectRecord(record)}
									>
										<span>{record.Id}</span>
										<span>{record.Name}</span>
									</div>
								);
							})
						}
					</div>
				</div>
			</div>
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
						<div className="accounts-modal-tab">
							<h3>Account</h3>
							<div>
								<p>{this.state.main_acc.Id}</p>
								<p>{this.state.main_acc.Name}</p>

								<div className="input-group">
									<input
										type="text"
										placeholder="No record selected"
										aria-describedby=""
										readOnly={true}
										value={this.state.main_acc.Name || ''}
									/>
									<button
										className="fa-button fa-button--brand"
										onClick={() => this.onOpenAccounts('main')}
									>
										Choose
									</button>
								</div>
							</div>
						</div>
						<div className="accounts-modal-tab">
							<h3>Associations</h3>
							<div>
								{this.state.associated_accounts.map(acc => {
									return (
										<p key={acc.Id}>
											{acc.accName}
											<Icon
												onClick={() => this.onRemoveAssociation(acc.Id)}
												name="delete"
												height="14"
												width="14"
												color="#0070d2"
											/>
										</p>
									);
								})}
								<p>
									<button
										className="fa-button fa-button--default"
										onClick={() => this.onOpenAccounts('association')}
									>
										Add
									</button>
								</p>
							</div>
						</div>
					</div>
					<div className="accounts-modal--right">
						{this.state.lookupOpen ? lookup : ''}
						{this.state.count && this.state.count > 20 ? (
						<Pagination
							totalSize={this.state.count}
							pageSize={20}
							page={this.state.page}
							restricted={true}
							disabled={this.state.loadingRecords}
							onPageChange={newPage => {
								this.onPageChange(newPage);
							}}
						/>
					) : (
						''
					)}
					</div>
				</div>

				{footer}
			</Modal>
		);
	}
}

export default AccountsModal;

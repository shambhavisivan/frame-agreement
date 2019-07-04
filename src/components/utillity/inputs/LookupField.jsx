import React, { Component } from 'react';
import Modal from 'react-responsive-modal';

import Icon from '../Icon';
import Lookup from '../Lookup';

import { truncateCPField, decodeEntities } from '../../../utils/shared-service';

class LookupField extends React.Component {
	// disabled={!this.props.editable}
	// onChange={this.onChange}
	// field={this.props.field.field}
	// label={this.props.label}
	// columns={this.props.field.lookupData.columns}
	// filter={this.props.field.lookupData.whereClause}
	// value={this.state.value}

	constructor(props) {
		super(props);

		// save original response for filter reset

		this.onSave = this.onSave.bind(this);
		this._setState = this._setState.bind(this);
		this.onCloseModal = this.onCloseModal.bind(this);
		this.onSearchChange = this.onSearchChange.bind(this);
		this.onOpenLookupModal = this.onOpenLookupModal.bind(this);

		this.filter = null;

		if (this.props.filter) {
			this.filter = decodeEntities(this.props.filter).replace(/"/g, "'");
		}

		this.labelField = this.props.columns[0];

		this.state = {
			value: this.props.value,
			recordLabel: '',
			open: false,
			records: [],
			searchValue: '',
			selected: {},
			loadedInput: false,
			fetchingRecords: false,
			loadingOverlay: false,
			count: 0,
			pagination: {
				page: 1
			}
		};
	}

	componentWillMount() {
		this.mounted = true;

		window.SF.invokeAction('getLookupInformation', [
			this.props.field,
			this.props.columns[0],
			this.filter,
			this.props.value || null
		]).then(response => {
			this._setState({
				recordLabel: response.initialLabel || '',
				count: response.count,
				loadedInput: true,
				loadingOverlay: false
			});
		});
	}

	componentWillUnmount() {
		this.mounted = false;
	}

	_setState(newState, callback) {
		if (this.mounted) {
			this.setState(newState, () => {
				callback ? callback() : null;
			});
		}
	}

	// **************************************************************
	onCloseModal(event) {
		this._setState({
			open: false,
			pagination: {
				page: 1
			}
		});
	}

	onSearchChange(val) {
		this._setState(
			{
				pagination: {
					page: 1
				},
				searchValue: val,
				fetchingRecords: true,
				loadingOverlay: true
			},
			() => {
				let params = {};
				let infoMergedWhere = null;

				params.field = this.props.field;
				params.columns = this.props.columns;
				params.whereClause = this.filter;

				if (val && val !== '') {
					params.search = this.labelField + " like '%" + val + "%'";
					infoMergedWhere = params.whereClause + ' and ' + params.search;
				}

				params.lastId = null;
				params.offset = 20 * 10;

				Promise.all([
					window.SF.invokeAction('getLookupInformation', [
						params.field,
						params.columns[0],
						infoMergedWhere,
						null
					]),
					window.SF.invokeAction('getLookupRecords', [JSON.stringify(params)])
				]).then(
					response => {
						let info = response[0];
						let records = decodeEntities(response[1]);

						this._setState({
							count: info.count,
							records: records,
							fetchingRecords: false,
							loadingOverlay: false
						});
					},
					error => {
						this._setState({
							fetchingRecords: false,
							loadingOverlay: false
						});
					}
				);
			}
		);
	}

	async onPageChange(newPage) {
		if (this.state.fetchingRecords) {
			return;
		}

		let needToLoad = !!this.pagesToLoad(newPage);

		this._setState({
			pagination: { ...this.state.pagination, page: newPage },
			fetchingRecords: needToLoad
		});

		if (needToLoad) {
			let newSet = await this.getRecordPage(newPage);

			this._setState(
				{
					records: [...this.state.records, ...newSet],
					fetchingRecords: false
				},
				() => {
					//     	function hasDuplicates(array) {
					//     return (new Set(array)).size !== array.length;
					// }
					// if (hasDuplicates(this.state.records)) {
					// 	alert("Has duplicates!");
					// }
				}
			);
		}
	}

	onSave() {
		let _record = this.state.selected;
		this._setState({ recordLabel: _record[this.labelField] }, () => {
			this.props.onChange(_record.Id);
			this.onCloseModal();
		});
	}

	onOpenLookupModal() {
		this._setState(
			{
				searchValue: '',
				open: true,
				loadingOverlay: true,
				pagination: {
					page: 1
				}
			},
			() => {
				if (!this.state.records.length) {
					let params = {};
					params.field = this.props.field;
					params.columns = this.props.columns;
					params.whereClause = this.filter;
					params.lastId = null;
					params.offset = 20 * 10;

					// Call remote action
					window.SF.invokeAction('getLookupRecords', [
						JSON.stringify(params)
					]).then(
						response => {
							response = decodeEntities(response);

							this._setState({
								records: response,
								loadingOverlay: false
							});
						},
						error => {
							console.error(error);
						}
					);
				} else {
					this._setState({
						loadingOverlay: false
					});
				}
			}
		);
	}

	// **************************************************************

	selectRecord(record) {
		this._setState({ selected: record });
	}

	pagesToLoad(newPage) {
		let page = newPage;
		let max_items = this.state.count;
		let max_pages = Math.ceil(max_items / 20);

		let min_pages = page >= 7 ? page + 4 : 10;

		var _needPages = Math.min(min_pages, max_pages);
		var _availablePages = Math.ceil(this.state.records.length / 20);

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

		parameter.field = this.props.field;
		parameter.columns = this.props.columns;
		parameter.whereClause = this.filter;

		if (this.state.searchValue) {
			parameter.search =
				this.labelField + "  like '%" + this.state.searchValue + "%'";
		}

		parameter.lastId = this.state.records[this.state.records.length - 1].Id;
		parameter.offset = 20 * pagesToLoad;

		return window.SF.invokeAction('getLookupRecords', [
			JSON.stringify(parameter)
		]);
	}

	render() {
		return (
			<React.Fragment>
				<div className="input-group">
					<input
						className="fa-lookup fa-input-border"
						type="text"
						disabled={this.props.disabled}
						placeholder={window.SF.labels.util_input_lookup_placehoder}
						aria-describedby=""
						readOnly={true}
						onClick={this.onOpenLookupModal}
						value={
							this.state.loadedInput
								? decodeEntities(this.state.recordLabel)
								: '-'
						}
					/>
					<div className="fa-lookup-icon" onClick={this.onOpenLookupModal}>
						<Icon
							svg-class="icon-search"
							name="search"
							width="14"
							height="14"
						/>
					</div>
				</div>

				<Modal
					classNames={{
						overlay: 'overlay',
						modal: 'modal fa-modal lookup-modal',
						closeButton: 'close-button'
					}}
					closeIconSvgPath={
						<path d="M14.3 11.7l6-6c.3-.3.3-.7 0-1l-.9-1c-.3-.2-.7-.2-1 0l-6 6.1c-.2.2-.5.2-.7 0l-6-6.1c-.3-.3-.7-.3-1 0l-1 1c-.2.2-.2.7 0 .9l6.1 6.1c.2.2.2.4 0 .6l-6.1 6.1c-.3.3-.3.7 0 1l1 1c.2.2.7.2.9 0l6.1-6.1c.2-.2.4-.2.6 0l6.1 6.1c.2.2.7.2.9 0l1-1c.3-.3.3-.7 0-1l-6-6c-.2-.2-.2-.5 0-.7z" />
					}
					closeIconSize={48}
					open={this.state.open}
					onClose={this.onCloseModal}
					center
				>
					<div className="fa-modal-header">
						<h2 className="fa-modal-header-title">
							{this.props.label + ' lookup'}
						</h2>
					</div>

					<div className="product-modal fa-modal-body">
						<Lookup
							onChange={record => this.selectRecord(record)}
							onSearch={this.onSearchChange}
							onPageChange={newPage => this.onPageChange(newPage)}
							data={this.state.records}
							count={this.state.count}
							columns={this.props.columns}
							selected={this.state.selected}
							disabled={this.state.fetchingRecords}
							loading={this.state.loadingOverlay}
						/>
					</div>

					<div className="fa-modal-footer">
						<button
							className="fa-button fa-button--brand"
							disabled={!this.state.selected.Id}
							onClick={this.onSave}
						>
							{window.SF.labels.btn_Save}
						</button>
					</div>
				</Modal>
			</React.Fragment>
		);
	}
}

export default LookupField;

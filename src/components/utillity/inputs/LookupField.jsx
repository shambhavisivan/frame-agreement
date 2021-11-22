import React, { Component } from 'react';
import Modal from 'react-responsive-modal';

import Icon from '../Icon';
import Lookup from '../Lookup';

import { decodeEntities, openSFLink } from '~/src/utils/shared-service';

const DEFAULT_RECORD_PER_PAGE = 20;
const DEFAULT_PAGES_TO_LOAD = 10;

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
		this.onClear = this.onClear.bind(this);
		this.loadLookupData = this.loadLookupData.bind(this);
		// this.onOpenLookupModal = this.onOpenLookupModal.bind(this);

		this.filter = null;

		if (this.props.filter) {
			this.filter = decodeEntities(this.props.filter).replace(/"/g, "'");
		}

		this.labelField = this.props.columns[0];
		this.initialRecords = [];
		this.confirmSelected = {};

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

	componentDidMount() {
		this.mounted = true;

		window.SF.invokeAction('getLookupInformation', [
			this.props.field,
			this.props.columns[0],
			this.filter,
			this.props.value || null
		]).then(async response => {
			if (!window.SF.fieldLabels.hasOwnProperty(response.object)) {
				await window.SF.invokeAction('getFieldLabels', [response.object]).then(r => {
					window.SF.fieldLabels[response.object] = r;
				});
			}

			this._setState({
				recordLabel: response.initialLabel || '',
				object: response.object,
				count: response.count,
				selected: this.props.value
					? {
							Id: this.props.value,
							Name: response.initialLabel
					  }
					: {},
				loadedInput: true,
				loadingOverlay: false
			}, () => {
				this.confirmSelected = this.state.selected;
			});
		});
	}

	componentWillUnmount() {
		this.mounted = false;
	}

	async componentDidUpdate(prevProps, prevState) {
		if (this.props.value !== prevProps.value) {
			let records = this.state.records;

			if (this.props.value && !records.length) {
				const response = await this.loadLookupData().catch(error => {
						throw new Error(error);
					}
				);
				records = decodeEntities(response);
				this.initialRecords = records;
				this._setState({
					records: records,
				});
			}
			const userSelectedLookupRecord = records.find(
				(record) => {
					return record.Id === this.props.value;
				}
			);
			this.confirmSelected = {};
			let label = '';
			let selectedId = '';

			if (userSelectedLookupRecord) {
				label = userSelectedLookupRecord[this.labelField];
				selectedId = userSelectedLookupRecord.Id;
				this.confirmSelected = userSelectedLookupRecord;
			}
			this._setState(
				{ recordLabel: label, selected: this.confirmSelected },
				() => {
					this.props.onChange(selectedId);
				}
			);
		}
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
			selected: this.confirmSelected,
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

				if (val) {
					params.search = `${this.labelField} like '%${val}%'`;
					infoMergedWhere = params.whereClause ? `${params.whereClause} and  ${params.search}` : params.search;
				}

				params.lastId = null;
				params.offset = DEFAULT_RECORD_PER_PAGE * DEFAULT_PAGES_TO_LOAD;

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

	onClear() {
		this._setState({ recordLabel: '', selected: {} }, () => {
			this.props.onChange('');
		});
	}

	onSave() {
		let _record = this.state.selected;
		this.confirmSelected = _record;
		this._setState({ recordLabel: _record[this.labelField] }, () => {
			this.props.onChange(_record.Id);
			this.onCloseModal();
		});
	}

	onOpenLookupModal(e) {
		if (this.props.disabled) {
			return false;
		}

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
				if (this.initialRecords.length) {
					this._setState({
						records: this.initialRecords,
						loadingOverlay: false
					});
				} else if (!this.state.records.length) {
					this.loadLookupData().then(
						response => {
							response = decodeEntities(response);
							this.initialRecords = response;
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
		let updatedRecord = record;

		if (this.state.selected.Id === record.Id) {
			updatedRecord = {};
		}
		this._setState({ selected: updatedRecord });
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
		console.log('You need this much results:', Math.min(max_items, min_pages * 20));
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
			parameter.search = this.labelField + "  like '%" + this.state.searchValue + "%'";
		}

		parameter.lastId = this.state.records[this.state.records.length - 1].Id;
		parameter.offset = DEFAULT_RECORD_PER_PAGE * pagesToLoad;

		return window.SF.invokeAction('getLookupRecords', [JSON.stringify(parameter)]);
	}

	loadLookupData() {
		let params = {};
		params.field = this.props.field;
		params.columns = this.props.columns;
		params.whereClause = this.filter;
		params.lastId = null;
		params.offset = DEFAULT_RECORD_PER_PAGE * DEFAULT_PAGES_TO_LOAD;

		// Call remote action
		return window.SF.invokeAction('getLookupRecords', [JSON.stringify(params)]);
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
						onClick={e => this.onOpenLookupModal(e)}
						value={this.state.loadedInput ? decodeEntities(this.state.recordLabel) : '-'}
					/>
					{this.state.selected.Id && !this.props.disabled && (
						<div
							className={'fa-lookup-icon forward' + (this.props.disabled ? ' disabled' : '')}
							onClick={() => this.onClear()}
						>
							<Icon svg-class="icon-search" name="close" width="14" height="14" />
						</div>
					)}
					<div
						className={'fa-lookup-icon ' + (this.props.disabled ? 'disabled' : '')}
						onClick={e => this.onOpenLookupModal(e)}
					>
						<Icon svg-class="icon-search" name="search" width="14" height="14" />
					</div>

					{this.state.selected.Id ? (
						<div
							className="fa-lookup-icon forward"
							onClick={e => openSFLink(this.state.selected.Id)}
						>
							<Icon svg-class="icon-forward" name="forward" width="14" height="14" />
						</div>
					) : null}
				</div>

				<Modal
					classNames={{
						overlay: 'overlay',
						modal: 'modal fa-modal lookup-modal'
					}}
					open={this.state.open}
					onClose={this.onCloseModal}
					center
				>
					<div className="fa-modal-header">
						<button className="close-modal-button" onClick={this.onCloseModal}>
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 52 52">
								<path
									fill="#fff"
									d="m31 25.4l13-13.1c0.6-0.6 0.6-1.5 0-2.1l-2-2.1c-0.6-0.6-1.5-0.6-2.1 0l-13.1 13.1c-0.4 0.4-1 0.4-1.4 0l-13.1-13.2c-0.6-0.6-1.5-0.6-2.1 0l-2.1 2.1c-0.6 0.6-0.6 1.5 0 2.1l13.1 13.1c0.4 0.4 0.4 1 0 1.4l-13.2 13.2c-0.6 0.6-0.6 1.5 0 2.1l2.1 2.1c0.6 0.6 1.5 0.6 2.1 0l13.1-13.1c0.4-0.4 1-0.4 1.4 0l13.1 13.1c0.6 0.6 1.5 0.6 2.1 0l2.1-2.1c0.6-0.6 0.6-1.5 0-2.1l-13-13.1c-0.4-0.4-0.4-1 0-1.4z"
								/>
							</svg>
						</button>
						<h2 className="fa-modal-header-title">{this.props.label + ' lookup'}</h2>
					</div>

					<div className="product-modal fa-modal-body">
						<Lookup
							onChange={record => this.selectRecord(record)}
							onSearch={this.onSearchChange}
							onPageChange={newPage => this.onPageChange(newPage)}
							data={this.state.records}
							count={this.state.count}
							columns={this.props.columns}
							object={this.state.object}
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

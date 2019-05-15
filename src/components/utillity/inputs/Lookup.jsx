import React, { Component } from 'react';
import Modal from 'react-responsive-modal';
import { connect } from 'react-redux';

import InputSearch from './InputSearch';
import Icon from '../Icon';

import Pagination from '../Pagination';
import { truncateCPField, decodeEntities } from '../../../utils/shared-service';

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

class Lookup extends React.Component {
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
		this.onCloseModal = this.onCloseModal.bind(this);
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
			loadedModal: false,
			loadingRecords: false,
			count: 0,
			pagination: {
				page: 1
			}
		};
	}

	componentWillMount() {
		window.SF.invokeAction('getLookupInformation', [
			this.props.field,
			this.props.columns[0],
			this.filter,
			this.props.value || null
		]).then(response => {
			this.setState({
				recordLabel: response.initialLabel || '',
				count: response.count,
				loadedInput: true
			});
		});
	}

	// **************************************************************
	onCloseModal(event) {
		this.setState({
			open: false,
			pagination: {
				page: 1
			}
		});
	}

	onSearchChange(val) {
		this.setState(
			{
				pagination: {
					page: 1
				},
				searchValue: val,
				loadingRecords: true,
				loadedModal: false
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

						this.setState({
							count: info.count,
							records: records,
							loadedModal: true,
							loadingRecords: false
						});
					},
					error => {
						this.setState({
							loadedModal: true,
							loadingRecords: false
						});
					}
				);
			}
		);
	}

	async onPageChange(newPage) {
		if (this.state.loadingRecords) {
			return;
		}

		let needToLoad = !!this.pagesToLoad(newPage);

		this.setState({
			pagination: { ...this.state.pagination, page: newPage },
			loadingRecords: needToLoad
		});

		if (needToLoad) {
			let newSet = await this.getRecordPage(newPage);

			this.setState(
				{
					records: [...this.state.records, ...newSet],
					loadingRecords: false
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
		this.setState({ recordLabel: this.state.selected[this.labelField] }, () => {
			this.props.onChange(this.state.selected.Id);
			this.onCloseModal();
		});
	}

	onOpenLookupModal() {
		this.setState(
			{
				loadedModal: !!this.state.records.length,
				searchValue: '',
				open: true,
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

							this.setState({
								records: response,
								loadedModal: true
							});
						},
						error => {
							console.error(error);
							this.setState({
								loadedModal: true
							});
						}
					);
				}
			}
		);
	}

	// **************************************************************

	selectRecord(record) {
		this.setState({ selected: record });
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
			<div className="input-group">
				<input
					className="fa-lookup fa-input-border"
					type="text"
					placeholder="No record selected"
					aria-describedby=""
					readOnly={true}
					onClick={this.onOpenLookupModal}
					value={
						this.state.loadedInput
							? decodeEntities(this.state.recordLabel)
							: '-'
					}

				/>
				<div
					className="fa-lookup-icon"
					onClick={this.onOpenLookupModal}
				>
					<Icon
						svg-class="icon-search"
						name="search"
						width="14"
						height="14"
					/>
				</div>
				<Modal
					classNames={{
						overlay: 'overlay',
						modal: 'modal fa-modal',
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
						<div className="modal-table-container">
							<div className="modal-navigation">
								<div className="search-container">
									<InputSearch
										placeholder={
											'Filter ' + this.props.label.toLowerCase() + ' records'
										}
										value={this.state.searchValue}
										onChange={val => {
											this.onSearchChange(val);
										}}
									/>
								</div>
							</div>

							<div className="modal-product-list">
								<div className="product-list-header">
									<div className="header-th">
										<span>Id</span>
									</div>
									{this.props.columns.map(c => {
										return (
											<div key={c} className="header-th">
												<span>
													{this.props.settings.truncate
														? truncateCPField(c)
														: c}
												</span>
											</div>
										);
									})}
								</div>

								{this.state.loadedModal && (
									<div className="product-list">
										{this.state.records
											.paginate(this.state.pagination.page, 20)
											.map(record => {
												return (
													<div
														key={record.Id}
														className={
															'product-row' +
															(this.state.selected.Id === record.Id
																? ' selected'
																: '')
														}
														onClick={() => this.selectRecord(record)}
													>
														<span>{record.Id}</span>

														{this.props.columns.map(f => {
															return (
																<span key={'field-' + f}>{record[f]}</span>
															);
														})}
													</div>
												);
											})}
									</div>
								)}

								{!this.state.loadedModal && (
									<div className="product-list">
										<RecordSkeletonRow />
										<RecordSkeletonRow />
										<RecordSkeletonRow />
										<RecordSkeletonRow />
										<RecordSkeletonRow />
										<RecordSkeletonRow />
										<RecordSkeletonRow />
										<RecordSkeletonRow />
										<RecordSkeletonRow />
										<RecordSkeletonRow />
									</div>
								)}
							</div>
						</div>
					</div>

					<div className="fa-modal-footer">
						{this.state.records.length && this.state.count ? (
							<Pagination
								totalSize={this.state.count}
								pageSize={20}
								page={this.state.pagination.page}
								restricted={true}
								disabled={this.state.loadingRecords}
								onPageChange={newPage => {
									this.onPageChange(newPage);
								}}
							/>
						) : (
							''
						)}

						<button
							className="fa-button"
							disabled={!this.state.selected.Id}
							onClick={this.onSave}
						>
							Save
						</button>
					</div>
				</Modal>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		settings: state.settings
	};
};

export default connect(
	mapStateToProps,
	null
)(Lookup);

// onPageChange={newPage => {
//   this.setState({
//     pagination: { ...this.state.pagination, page: newPage }
//   });
// }}

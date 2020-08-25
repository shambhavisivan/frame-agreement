import React, { Component } from 'react';
import { connect } from 'react-redux';

import Modal from 'react-responsive-modal';

import { getStandaloneAddons } from '~/src/actions';
import { publish, filterStandaloneAddons } from '../../api';

import Icon from '../utillity/Icon';
import Checkbox from '../utillity/inputs/Checkbox';
import InputSearch from '../utillity/inputs/InputSearch';
import Pagination from '../utillity/Pagination';
import { truncateCPField, getFieldLabel } from '../../utils/shared-service';

class AddonModal extends Component {
	constructor(props) {
		super(props);

		this._setState = this._setState.bind(this);
		this.onCloseModal = this.onCloseModal.bind(this);
		this.addAddon = this.addAddon.bind(this);
		this.togglePanel = this.togglePanel.bind(this);

		this.resetFilter = this.resetFilter.bind(this);
		this.applyFilter = this.applyFilter.bind(this);

		let _standaloneAddons = this.props.standaloneAddons;

		this.addedAddonIds = new Set(this.props.addedAddons.map(cp => cp.Id));

		this.notAddedAddons = _standaloneAddons.filter(cp => !this.addedAddonIds.has(cp.Id));

		this.state = {
			searchValue: '',
			addons: this.notAddedAddons,
			panel: false,
			expanded: false,
			actionTaken: false,
			filter: this.initFilterData(),
			addonFilter: '',
			selected: {},
			pagination: {
				page: 1,
				pageSize: 10
			}
		};

		this.addonFields = this.props.settings.FACSettings.standalone_addon_fields;
	}

	componentDidMount() {
		this.mounted = true;
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

	initFilterData() {
		let categoryMap = {};

		this.props.settings.AddonCategorizationData.forEach(cat => {
			categoryMap[cat.field] = {};

			categoryMap[cat.field].label = cat.name;
			categoryMap[cat.field].open = false;
			categoryMap[cat.field].values = {};

			cat.values.forEach(value => {
				categoryMap[cat.field].values[value] = false;
			});
		});
		return categoryMap;
	}

	onCloseModal() {
		this._setState({
			actionTaken: false,
			selected: {}
		});
		this.props.onCloseModal();
	}

	togglePanel(value) {
		this._setState({
			panel: !this.state.panel
		});
	}

	toggleFilter(name, value) {
		this._setState({
			filter: {
				...this.state.filter,
				[name]: {
					...this.state.filter[name],
					values: {
						...this.state.filter[name].values,
						[value]: !this.state.filter[name].values[value]
					}
				}
			}
		});
	}

	resetFilter(name, value) {
		this._setState({
			filter: this.initFilterData(),
			addons: this.notAddedAddons
		});
	}

	async applyFilter() {
		// Prepare data
		let filterData = [];

		for (var field in this.state.filter) {
			let cat = {
				field: field,
				values: []
			};

			for (var key in this.state.filter[field].values) {
				if (this.state.filter[field].values[key]) {
					cat.values.push(key);
				}
			}

			if (cat.values.length) {
				filterData.push(cat);
			}
		}

		let result = await filterStandaloneAddons(filterData);

		// let perFaCpFilterList = await publish('onLoadCommercialProducts', result);
		let perFaAddonList = result;

		this._setState({
			addons: perFaAddonList.filter(cp => !this.addedAddonIds.has(cp.Id))
		});
	}

	getAddonCount() {
		let addSize = this.state.addons.length;

		if (this.state.addonFilter) {
			addSize = this.state.addons.filter(cp => {
				if (this.state.addonFilter && this.state.addonFilter.length >= 2) {
					return cp.Name.toLowerCase().includes(this.state.addonFilter.toLowerCase());
				} else {
					return true;
				}
			}).length;
		}
		return addSize;
	}

	toggleExpanded() {
		this._setState({ expanded: !this.state.expanded }, () => {
			console.log('Expand:', this.state.expanded);
		});
	}

	toggleCategoryCollapse(name) {
		console.log('Toggling ', name);
		this._setState(
			{
				filter: {
					...this.state.filter,
					[name]: {
						...this.state.filter[name],
						open: !this.state.filter[name].open
					}
				}
			},
			() => {
				console.log(this.state.filter[name]);
			}
		);
	}

	selectAddon(addon) {
		let currentState = !!this.state.selected[addon.Id];
		let newState = { ...this.state.selected };
		if (currentState) {
			delete newState[addon.Id];
		} else {
			newState[addon.Id] = true;
		}

		this._setState(
			{
				selected: { ...newState }
			},
			() => {
				this._setState({
					actionTaken: true
				});
				console.log(this.state.selected);
			}
		);
	}

	addAddon() {
		this.props.onAddAddon(Object.keys(this.state.selected));
		this._setState({
			actionTaken: false,
			selected: {}
		});
	}

	render() {
		return (
			<Modal
				classNames={{
					overlay: 'overlay',
					modal: 'modal fa-modal' + (this.state.expanded ? ' expanded' : ''),
					closeButton: 'close-button'
				}}
				closeIconSvgPath={
					<path d="M14.3 11.7l6-6c.3-.3.3-.7 0-1l-.9-1c-.3-.2-.7-.2-1 0l-6 6.1c-.2.2-.5.2-.7 0l-6-6.1c-.3-.3-.7-.3-1 0l-1 1c-.2.2-.2.7 0 .9l6.1 6.1c.2.2.2.4 0 .6l-6.1 6.1c-.3.3-.3.7 0 1l1 1c.2.2.7.2.9 0l6.1-6.1c.2-.2.4-.2.6 0l6.1 6.1c.2.2.7.2.9 0l1-1c.3-.3.3-.7 0-1l-6-6c-.2-.2-.2-.5 0-.7z" />
				}
				closeIconSize={48}
				open={this.props.open}
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
					<span
						className="fa-modal-expand"
						onClick={() => {
							this.toggleExpanded();
						}}
					>
						<Icon name="expand_alt" width="24" height="24" color="white" />
					</span>
					<h2 className="fa-modal-header-title">{window.SF.labels.modal_addAddons_title}</h2>
				</div>

				<div
					className={
						'fa-product-modal fa-modal-body ' + (this.state.panel ? 'panel-open' : 'panel-closed')
					}
				>
					<div className="fa-modal-panel">
						<div className="panel-navigation">
							<div className="panel-navigation--close" onClick={this.togglePanel}>
								<Icon name="close" width="12" height="12" color="#0070d2" />
								<span>{window.SF.labels.btn_Close}</span>
							</div>
							<div>
								<div className="fa-modal-product-list-header">
									<div className="header-th">
										<span>{window.SF.labels.modal_addon_categorization_title}</span>
									</div>
								</div>
								<div className="fa-modal-product-list">
									{Object.keys(this.state.filter).map(key => {
										let category = this.state.filter[key];

										return (
											<div className="fa-modal-product-list-categories" key={key}>
												<div
													onClick={() => {
														this.toggleCategoryCollapse(key);
													}}
												>
													<Icon
														name={category.open ? 'chevrondown' : 'chevronright'}
														width="12"
														height="12"
														color="#747474"
													/>
													<span className="fa-modal-product-list-categories-item">
														{category.label}
													</span>
												</div>

												{category.open && (
													<ul>
														{Object.keys(category.values).map(val => {
															return (
																<li
																	key={val}
																	onClick={() => {
																		this.toggleFilter(key, val);
																	}}
																>
																	<Checkbox small={true} readOnly={category.values[val]} />
																	<span>{val}</span>
																</li>
															);
														})}
													</ul>
												)}
											</div>
										);
									})}
								</div>
							</div>
						</div>
						<div className="fa-modal-button-group">
							<button
								onClick={this.resetFilter}
								className="fa-button fa-button--default"
								disabled={false}
							>
								{window.SF.labels.modal_categorization_btn_clear}
							</button>
							<button
								onClick={this.applyFilter}
								className="fa-button fa-button--default"
								disabled={false}
							>
								{window.SF.labels.modal_categorization_btn_apply}
							</button>
						</div>
					</div>

					<div className="fa-modal-table-container">
						<div className="fa-modal-navigation">
							{this.props.settings.AddonCategorizationData.length && !this.state.panel ? (
								<div className="fa-flex fa-flex-middle" onClick={this.togglePanel}>
									<div className="fa-modal-categorization-switch">
										<Icon name="color_swatch" width="14" height="14" color="#0070d2" />
										<div className="fa-modal-categorization-switch-link">
											{window.SF.labels.modal_addon_categorization_switch}
										</div>
									</div>
								</div>
							) : (
								''
							)}

							<div className="search-container">
								<InputSearch
									placeholder={window.SF.labels.modal_addAddons_input_search_placeholder}
									value={this.state.searchValue}
									onChange={val => {
										this._setState({ addonFilter: val });
									}}
								/>
							</div>
						</div>

						<div>
							<div className="fa-modal-product-list-header">
								<div className="header-th">
									{getFieldLabel('cspmb__Add_On_Price_Item__c', 'name')}
								</div>
								{this.addonFields.map(f => {
									return (
										<div key={'addfield-' + f} className="header-th">
											<span>
												{getFieldLabel('cspmb__Add_On_Price_Item__c', f) || truncateCPField(f)}
											</span>
										</div>
									);
								})}
							</div>
							<div className="fa-modal-product-list">
								{this.state.addons
									.filter(add => {
										if (this.state.addonFilter && this.state.addonFilter.length >= 2) {
											return add.Name.toLowerCase().includes(this.state.addonFilter.toLowerCase());
										} else {
											return true;
										}
									})
									.paginate(this.state.pagination.page, this.state.pagination.pageSize)
									.map(add => {
										return (
											<div
												key={add.Id}
												className={'product-row' + (this.state.selected[add.Id] ? ' selected' : '')}
												onClick={() => this.selectAddon(add)}
											>
												<span>{add.Name}</span>
												{this.addonFields.map(f => {
													return (
														<span key={add.Id + '-' + f}>
															{(() => {
																if (add.hasOwnProperty(f)) {
																	if (typeof add[f] === 'boolean') {
																		let _val = add[f];
																		return (
																			<Icon
																				name={_val ? 'success' : 'clear'}
																				height="14"
																				width="14"
																				color={_val ? '#4bca81' : '#d9675d'}
																			/>
																		);
																	} else {
																		return add[f].toString();
																	}
																} else {
																	return '-';
																}
															})()}
														</span>
													);
												})}
											</div>
										);
									})}
							</div>
						</div>

						<div className="modal-pagination" />
					</div>
				</div>

				<div className="fa-modal-footer">
					<Pagination
						totalSize={this.getAddonCount()}
						pageSize={this.state.pagination.pageSize}
						page={this.state.pagination.page}
						onPageSizeChange={newPageSize => {
							this._setState({
								pagination: {
									...this.state.pagination,
									pageSize: newPageSize,
									page: 1
								}
							});
						}}
						onPageChange={newPage => {
							this._setState({
								pagination: { ...this.state.pagination, page: newPage }
							});
						}}
					/>

					<button
						onClick={this.addAddon}
						className="fa-button fa-button--brand"
						disabled={!this.state.actionTaken}
					>
						{window.SF.labels.modal_categorization_btn_add}
					</button>
				</div>
			</Modal>
		);
	}
}

const mapStateToProps = state => {
	return {
		standaloneAddons: state.standaloneAddons,
		productFields: state.productFields,
		settings: state.settings
	};
};

const mapDispatchToProps = {
	getStandaloneAddons
};

export default connect(mapStateToProps, mapDispatchToProps)(AddonModal);

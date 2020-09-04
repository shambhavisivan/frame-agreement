import React, { Component } from 'react';
import { connect } from 'react-redux';

import Icon from '../utillity/Icon';
import Pagination from '../utillity/Pagination';
import InputSearch from '../utillity/inputs/InputSearch';
import Checkbox from '../utillity/inputs/Checkbox';

import StandaloneAddon from '../negotiation/StandaloneAddon';
import { publish } from '~/src/api';

import { truncateCPField, getFieldLabel, log } from '../../utils/shared-service';
import { toggleFieldVisibility, setAddonValidation, negotiateAddons } from '~/src/actions';

import AddAddonsCTA from './AddAddonsCTA';
import SettingsContext from '~/src/utils/settings-context.js';

import { validateAddons } from '~/src/utils/validation-service';

class AddonsTab extends React.Component {
	constructor(props) {
		super(props);

		this.getAddonCount = this.getAddonCount.bind(this);
		this.onNegotiate = this.onNegotiate.bind(this);

		this.state = {
			addonFilter: '',
			page: 1,
			pageSize: 10
		};

		this._addonFilter = cp => {
			if (this.state.addonFilter && this.state.addonFilter.length >= 2) {
				return cp.Name.toLowerCase().includes(this.state.addonFilter.toLowerCase());
			} else {
				return true;
			}
		};

		this.prodDeleteSub = window.FAM.subscribe('onAfterDeleteProducts', data => {
			return new Promise(resolve => {
				this.setState({
					page: 1
				});
				resolve(data);
			});
		});
	}

	async onNegotiate(data, addonId) {
		this.props.setAddonValidation(
			this.props.faId,
			validateAddons(this.props.frameAgreements[this.props.faId]._ui.standaloneAddons, data)
		);

		data = await publish('onBeforeNegotiate', data);

		this.props.negotiateAddons(this.props.faId, addonId, data);

		window.FAM.api.validateStatusConsistency(this.props.faId);

		publish('onAfterNegotiate', this.props.frameAgreements[this.props.faId]._ui.attachment);
	}

	componentWillUnmount() {
		this.prodDeleteSub.unsubscribe();
	}

	getAddonCount() {
		let addSize = this.props.frameAgreements[this.props.faId]._ui.standaloneAddons.length;
		if (this.state.addonFilter) {
			addSize = this.props.frameAgreements[this.props.faId]._ui.standaloneAddons.filter(add => {
				if (this.state.addonFilter && this.state.addonFilter.length >= 2) {
					return add.Name.toLowerCase().includes(this.state.addonFilter.toLowerCase());
				} else {
					return true;
				}
			}).length;
		}
		return addSize;
	}

	render() {
		let standaloneAddons;

		let _addons = this.props.frameAgreements[this.props.faId]._ui.standaloneAddons || [];
		let _addonFields = this.props.settings.FACSettings.standalone_addon_fields;

		let _disableLevels = !!this.props.frameAgreements[this.props.faId]._ui.disableDiscountLevels;
		let _disableInputs = !!this.props.frameAgreements[this.props.faId]._ui.disableInlineDiscounts;

		let _editable = window.FAM.api.isAgreementEditable(this.props.faId);

		if (_addons.length) {
			standaloneAddons = (
				<div className="products-card__inner">
					<div className="products-card__header">
						<span className="products__title">
							{window.SF.labels.addons_tab_title} ({_addons.length})
						</span>
						<div className="header__inputs">
							<InputSearch
								value={this.state.addonFilter}
								bordered={true}
								onChange={val => {
									this.setState({ addonFilter: val });
								}}
								placeholder={window.SF.labels.input_quickSearchPlaceholder}
							/>
						</div>
					</div>
					<div className="product-card__container commercial-product-container-bare product-card__container--header">
						<div className="container__header">
							<div className="container__checkbox">
								<Checkbox
									className="fa-margin-right-sm"
									value={
										_addons.filter(this._addonFilter).length ===
											Object.keys(this.props.selectedAddons).length &&
										!!Object.keys(this.props.selectedAddons).length
									}
									onChange={() => {
										this.props.onSelectAllAddons(
											this.props.frameAgreements[this.props.faId]._ui.standaloneAddons.filter(
												this._addonFilter
											)
										);
									}}
								/>
							</div>
							<div className="container__fields">
								{_addonFields.map(f => {
									return (
										<span key={'header-' + f} className="list-cell">
											{getFieldLabel('cspmb__Add_On_Price_Item__c', f) || truncateCPField(f)}
										</span>
									);
								})}
							</div>
						</div>
					</div>
					{_addons
						.filter(this._addonFilter)
						.paginate(this.state.page, this.state.pageSize)
						.map(add => {
							return (
								<StandaloneAddon
									key={'add-' + add.Id}
									addon={add}
									faId={this.props.faId}
									readOnly={!_editable}
									disableInputs={_disableInputs}
									disableLevels={_disableLevels}
									onSelect={addon => this.props.onSelectAddon(addon)}
									onNegotiate={data => {
										this.onNegotiate(data, add.Id);
									}}
									attachment={this.props.frameAgreements[this.props.faId]._ui.attachment.addons}
									selected={!!this.props.selectedAddons[add.Id]}
								/>
							);
						})}
					<div className="card__bottom" />
				</div>
			);
		} else {
			standaloneAddons = (
				<div>
					<AddAddonsCTA render={!_addons.length} disabled={!_editable}/>
				</div>
			);
		}

		return (
			<SettingsContext.Provider value={this.props.settings}>
				<div className="card products-card">
					{standaloneAddons}

					<Pagination
						totalSize={this.getAddonCount()}
						pageSize={this.state.pageSize}
						page={this.state.page}
						onPageSizeChange={newPageSize => {
							this.setState({
								page: 1,
								pageSize: newPageSize
							});
						}}
						onPageChange={newPage => {
							this.setState({
								page: newPage
							});
						}}
					/>
				</div>
			</SettingsContext.Provider>
		);
	}
}

const mapStateToProps = state => {
	return {
		frameAgreements: state.frameAgreements,
		settings: state.settings,
		handlers: state.handlers,
		productFields: state.productFields
	};
};

const mapDispatchToProps = {
	toggleFieldVisibility,
	setAddonValidation,
	negotiateAddons
};

export default connect(mapStateToProps, mapDispatchToProps)(AddonsTab);

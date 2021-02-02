import React, { Component } from 'react';
import { Collapse } from 'react-collapse';
import moment from 'moment';

import { truncateCPField, isNumber, getFieldLabel, copy } from '~/src/utils/shared-service';
import NumberFormat from '~/src/components/negotiation/NumberFormat';
import Icon from './Icon';

const NOT_SET = 'not set';

const getStatusLabel = status => window.SF.labels['delta_status_' + status.toLowerCase()] || status;

const Diff = props => {
	// props.old
	// props.new
	// props.status

	if (props.new === props.old) {
		return (
			<div className="delta-charge-diff">
				<span>
					{isNumber(props.old) ? <NumberFormat value={props.old} /> : props.old.toString()}
				</span>
				<span className={'diff-status ' + props.status}>{getStatusLabel(props.status)}</span>
			</div>
		);
	}

	// == for both undefined and null

	let _old = props.old == undefined ? NOT_SET : props.old;
	let _new = props.new == undefined ? NOT_SET : props.new;

	return (
		<div className="delta-charge-diff">
			<div>
				<span className="old">
					<NumberFormat value={_old} />
				</span>
				<Icon svg-className="icon-forward" name="forward" width="10" height="10" />
				<span className="new">
					<NumberFormat value={_new} />
				</span>
			</div>
			<span className={'diff-status ' + props.status}>{getStatusLabel(props.status)}</span>
		</div>
	);
};

const DeltaAddons = props => {
	if (!props.data || !Object.keys(props.data).length) {
		return null;
	}

	// this.props.data[addId]

	return (
		<div className="delta-entity">
			<span className="entity-label">Addons</span>
			<div className="entity-delta">
				{Object.keys(props.data).map(addId => {
					let _add = props.data[addId];
					let _oneOffDOM = null;
					let _recurringDOM = null;

					if (_add.oneOff.hasOwnProperty('old_value') || _add.oneOff.hasOwnProperty('new_value')) {
						_oneOffDOM = (
							<div className="charge-container">
								<span className="charge-label">{window.SF.labels.addons_header_oneOff}:</span>
								<Diff
									old={_add.oneOff.old_value}
									new={_add.oneOff.new_value}
									status={_add.oneOff.status}
								/>
							</div>
						);
					}

					if (
						_add.recurring.hasOwnProperty('old_value') ||
						_add.recurring.hasOwnProperty('new_value')
					) {
						_recurringDOM = (
							<div className="charge-container">
								<span className="charge-label">{window.SF.labels.addons_header_recc}:</span>
								<Diff
									old={_add.recurring.old_value}
									new={_add.recurring.new_value}
									status={_add.recurring.status}
								/>
							</div>
						);
					}

					return (
						<div className="entity-item" key={addId}>
							<span className="entity-item-title">{props.getLabel(addId)}</span>
							{_oneOffDOM}
							{_recurringDOM}
						</div>
					);
				})}
			</div>
		</div>
	);
};

const DeltaProducts = props => {
	if (!props.data || !Object.keys(props.data).length) {
		return null;
	}

	console.warn(props.data);

	let _oneOff_new = props.data.hasOwnProperty('oneOff')
		? props.data.oneOff.hasOwnProperty('new_value')
			? props.data.oneOff.new_value
			: NOT_SET
		: NOT_SET;
	let _oneOff_old = props.data.hasOwnProperty('oneOff')
		? props.data.oneOff.hasOwnProperty('old_value')
			? props.data.oneOff.old_value
			: NOT_SET
		: NOT_SET;

	let _recurring_new = props.data.hasOwnProperty('recurring')
		? props.data.recurring.hasOwnProperty('new_value')
			? props.data.recurring.new_value
			: NOT_SET
		: NOT_SET;
	let _recurring_old = props.data.hasOwnProperty('recurring')
		? props.data.recurring.hasOwnProperty('old_value')
			? props.data.recurring.old_value
			: NOT_SET
		: NOT_SET;

	return (
		<div className="delta-entity">
			<span className="entity-label">{window.SF.labels.products_product_charges}</span>
			<div className="charge-container">
				<span className="charge-label">{window.SF.labels.addons_header_oneOff}:</span>
				<Diff old={_oneOff_new} new={_oneOff_old} status={props.data.oneOff.status} />
			</div>
			<div className="charge-container">
				<span className="charge-label">{window.SF.labels.addons_header_recc}:</span>
				<Diff old={_recurring_new} new={_recurring_old} status={props.data.recurring.status} />
			</div>
		</div>
	);
};

const DeltaVolume = props => {
	if (!props.data || !Object.keys(props.data).length) {
		return null;
	}

	// If no volume is defined
	if (
		!Object.values(props.data).find(
			vol => vol.hasOwnProperty('old_value') || vol.hasOwnProperty('new_value')
		)
	) {
		return null;
	}

	return (
		<div className="delta-entity">
			<span className="entity-label">{window.SF.labels.fa_volume}:</span>
			{Object.keys(props.data).map(vol => {
				if (
					props.data[vol].hasOwnProperty('old_value') ||
					props.data[vol].hasOwnProperty('new_value')
				) {
					return (
						<div className="charge-container" key={vol}>
							<span className="charge-label">{vol}:</span>
							<Diff
								old={props.data[vol].old_value}
								new={props.data[vol].new_value}
								status={props.data[vol].status}
							/>
						</div>
					);
				} else {
					return null;
				}
			})}
		</div>
	);
};

const DeltaCharges = props => {
	if (!props.data || !Object.keys(props.data).length) {
		return null;
	}

	return (
		<div className="delta-entity">
			<span className="entity-label">{window.SF.labels.products_charges}:</span>
			<div className="entity-delta">
				{Object.keys(props.data).map(chargeId => {
					let _charge = props.data[chargeId];
					let _oneOffDOM = null;
					let _recurringDOM = null;

					if (_charge.hasOwnProperty('oneOff')) {
						_oneOffDOM = (
							<div className="charge-container">
								<span className="charge-label">{window.SF.labels.addons_header_oneOff}:</span>
								<Diff
									old={_charge.oneOff.old_value}
									new={_charge.oneOff.new_value}
									status={_charge.oneOff.status}
								/>
							</div>
						);
					}

					if (_charge.hasOwnProperty('recurring')) {
						_recurringDOM = (
							<div className="charge-container">
								<span className="charge-label">{window.SF.labels.addons_header_recc}:</span>
								<Diff
									old={_charge.recurring.old_value}
									new={_charge.recurring.new_value}
									status={_charge.recurring.status}
								/>
							</div>
						);
					}

					return (
						<div className="entity-item" key={chargeId}>
							<span className="entity-item-title">{props.getLabel(chargeId)}</span>
							{_oneOffDOM}
							{_recurringDOM}
						</div>
					);
				})}
			</div>
		</div>
	);
};

const DeltaRateCards = props => {
	if (!props.data || !Object.keys(props.data).length) {
		return null;
	}

	return (
		<div className="delta-entity">
			<span className="entity-label">{window.SF.labels.products_rates}:</span>
			<div className="entity-delta">
				{Object.keys(props.data).map(rcId => {
					if (!Object.keys(props.data[rcId].rcl).length) {
						return null;
					}

					let _labels = props.getLabel(rcId);

					if (typeof _labels === 'string' || !_labels) {
						_labels = {
							Name: rcId,
							rcl: {}
						};
					}

					return (
						<div key={rcId} className="entity-item">
							<span className="entity-item-title">{_labels.Name}</span>
							{Object.keys(props.data[rcId].rcl).map(rclId => {
								let _rcl = props.data[rcId].rcl[rclId];

								return (
									<div key={rclId} className="entity-item">
										<div className="charge-container">
											<span className="charge-label">{_labels.rcl[rclId] || rclId}:</span>
											<Diff old={_rcl.old_value} new={_rcl.new_value} status={_rcl.status} />
										</div>
									</div>
								);
							})}
						</div>
					);
				})}
			</div>
		</div>
	);
};

class DeltaStructure extends Component {
	constructor(props) {
		super(props);

		// this.props.delta
		// this.props.productlabelMap
		// this.props.chargesInfoMap

		this.pm = this.props.productsLabels;
		this.cm = this.props.chargesLabels;

		this.getLabel = this.getLabel.bind(this);

		this.state = {
			open: {}
		};
	}

	getLabel(entity, id) {
		let _label = id;

		try {
			_label = this.cm[entity][id];
		} catch (err) {
			console.warn('Cannot find labels for ' + entity + ' ' + id);
			console.warn(err);
		}

		return _label;
	}

	onToggleProduct(cpId) {
		this.setState({
			open: { ...this.state.open, [cpId]: !this.state.open[cpId] }
		});
	}

	isTimestamp(num) {
		return typeof num === 'number' && num.toString().length === 13;
	}

	render() {
		if (!this.props.data) {
			console.warn('No delta found!');
			return null;
		}

		let _products = this.props.data._products;

		let _faFields = copy(this.props.data);
		delete _faFields._products;
		delete _faFields._addons;

		return (
			<div className="delta-container">
				<div className="delta-fields">
					<h3 className="delta-section-title">{window.SF.labels.delta_fa_fields}</h3>

					<div className="delta-diff-collection">
						{Object.keys(_faFields).map(field => {
							let _old = _faFields[field].old_value;
							let _new = _faFields[field].new_value;

							if (this.isTimestamp(_old)) {
								_old = moment(_old).format('L');
							}
							if (this.isTimestamp(_new)) {
								_new = moment(_new).format('L');
							}

							return (
								<div key={field} className="charge-container">
									<span className="charge-label">
										{getFieldLabel('csconta__Frame_Agreement__c', field) ||
											truncateCPField(field, true) + ': '}
									</span>

									<Diff old={_old} new={_new} status={_faFields[field].status} />
								</div>
							);
						})}
					</div>
				</div>
				<div className="delta-products-container">
					<h3 className="delta-section-title">{window.SF.labels.products_tab_title}</h3>
					<div className="delta-diff-collection">
						{Object.keys(_products).map(Id => {
							if (typeof _products[Id] === 'string') {
								return (
									<div className="delta-product-no-info" key={Id}>
										{this.pm[Id] + ': '}
										<span className={'diff-status ' + _products[Id]}>
											{getStatusLabel(_products[Id])}
										</span>
									</div>
								);
							}

							return (
								<div className="delta-product" key={Id}>
									<span
										className={'delta-product-name ' + (this.state.open[Id] ? 'expanded' : '')}
										onClick={() => this.onToggleProduct(Id)}
									>
										<Icon
											svg-className="icon-forward"
											name={this.state.open[Id] ? 'down' : 'right'}
											width="10"
											height="10"
										/>

										{this.pm[Id]}
									</span>

									<Collapse isOpened={this.state.open[Id]}>
										<DeltaVolume data={_products[Id].volume} />
										<DeltaProducts data={_products[Id].product} />
										<DeltaAddons
											getLabel={id => this.getLabel('addons', id)}
											data={_products[Id].addons}
										/>
										<DeltaCharges
											getLabel={id => this.getLabel('charges', id)}
											data={_products[Id].charges}
										/>
										<DeltaRateCards
											getLabel={(id, rcl) => this.getLabel('rateCards', id, rcl)}
											data={_products[Id].rateCard}
										/>
									</Collapse>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		);
	}
}

export default DeltaStructure;

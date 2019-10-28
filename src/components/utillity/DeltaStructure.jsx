import React, { Component } from 'react';
import { truncateCPField, copy } from '~/src/utils/shared-service';

const NOT_SET = 'not set';

const Diff = props => {
	// props.old
	// props.new
	// props.status

	if (props.new === props.old) {
		return (
			<div className="delta-charge-diff">
				<span>{props.old + ' (' + props.status + ')'}</span>
			</div>
		);
	}

	// == for both undefined and null

	let _old = props.old == undefined ? NOT_SET : props.old;
	let _new = props.new == undefined ? NOT_SET : props.new;

	return (
		<div className="delta-charge-diff">
			<span className="old">{_old}</span>
			<span>{' => '}</span>
			<span className="new">{_new}</span>
			<span className="diff-status">({props.status})</span>
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
			<p>
				<b>Addons</b>
			</p>

			{Object.keys(props.data).map(addId => {
				let _add = props.data[addId];
				let _oneOffDOM = null;
				let _recurringDOM = null;

				if (
					_add.oneOff.hasOwnProperty('old_value') ||
					_add.oneOff.hasOwnProperty('new_value')
				) {
					_oneOffDOM = (
						<div className="charge-container">
							One-Off Charge:
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
					_oneOffDOM = (
						<div className="charge-container">
							Recurring:
							<Diff
								old={_add.recurring.old_value}
								new={_add.recurring.new_value}
								status={_add.recurring.status}
							/>
						</div>
					);
				}

				return (
					<React.Fragment key={addId}>
						<h4>{props.getLabel(addId)}</h4>
						{_oneOffDOM}
						{_recurringDOM}
					</React.Fragment>
				);
			})}
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
			<b>Product Charges</b>
			<div className="charge-container">
				One-Off Charge:
				<Diff
					old={_oneOff_new}
					new={_oneOff_old}
					status={props.data.oneOff.status}
				/>
			</div>
			<div className="charge-container">
				Recurring Charge:
				<Diff
					old={_recurring_new}
					new={_recurring_old}
					status={props.data.recurring.status}
				/>
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
			<b>Volume:</b>
			{Object.keys(props.data).map(vol => {
				if (
					props.data[vol].hasOwnProperty('old_value') ||
					props.data[vol].hasOwnProperty('new_value')
				) {
					return (
						<Diff
							key={vol}
							old={props.data[vol].old_value}
							new={props.data[vol].new_value}
							status={props.data[vol].status}
						/>
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
			<p>
				<b>Charges</b>
			</p>
			{Object.keys(props.data).map(chargeId => {
				let _charge = props.data[chargeId];
				let _oneOffDOM = null;
				let _recurringDOM = null;

				if (_charge.hasOwnProperty('oneOff')) {
					_oneOffDOM = (
						<div className="charge-container">
							One-Off Charge:
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
							Recurring:
							<Diff
								old={_charge.recurring.old_value}
								new={_charge.recurring.new_value}
								status={_charge.recurring.status}
							/>
						</div>
					);
				}

				return (
					<React.Fragment key={chargeId}>
						<h4>{props.getLabel(chargeId) + ' (' + chargeId + ')'}</h4>
						{_oneOffDOM}
						{_recurringDOM}
					</React.Fragment>
				);
			})}
		</div>
	);
};

const DeltaRateCards = props => {
	if (!props.data || !Object.keys(props.data).length) {
		return null;
	}

	return (
		<div className="delta-entity">
			<b>Rate Cards</b>

			{Object.keys(props.data).map(rcId => {
				if (!Object.keys(props.data[rcId].rcl).length) {
					return null;
				}

				let _labels = props.getLabel(rcId);

				if (typeof _labels === 'string' || !_labels) {
					_labels = {
						Name: _labels,
						rcl: {}
					};
				}

				return (
					<div key={rcId} className="delta-rateCard">
						<span>{_labels.Name}</span>
						{Object.keys(props.data[rcId].rcl).map(rclId => {
							let _rcl = props.data[rcId].rcl[rclId];

							return (
								<div key={rclId} className="charge-container">
									{_labels.rcl[rclId] || rclId}
									{': '}
									<Diff
										old={_rcl.old_value}
										new={_rcl.new_value}
										status={_rcl.status}
									/>
								</div>
							);
						})}
					</div>
				);
			})}
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

	render() {
		if (!this.props.data) {
			console.warn('No delta found!');
			return null;
		}

		let _products = this.props.data._products;

		let _faFields = copy(this.props.data);
		delete _faFields._products;

		return (
			<div className="delta-container">
				<div className="delta-fields">
					<h2>Frame Agreement Fields</h2>
					<div>
						{Object.keys(_faFields).map(field => {
							return (
								<div key={field} className="charge-container">
									{truncateCPField(field)} {': '}
									<Diff
										old={_faFields[field].old_value}
										new={_faFields[field].new_value}
										status={_faFields[field].status}
									/>
								</div>
							);
						})}
					</div>
				</div>
				<div className="delta-products-container">
					<h2>Products</h2>
					<div>
						{Object.keys(_products).map(Id => {
							if (typeof _products[Id] === 'string') {
								return (
									<div className="delta-charge-diff" key={Id}>
										{this.pm[Id] + ': '}
										<span className={_products[Id]}>{_products[Id]}</span>
									</div>
								);
							}

							return (
								<div className="delta-product" key={Id}>
									<p>{this.pm[Id]}</p>
									<div>
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
											getLabel={(id, rcl) =>
												this.getLabel('rateCards', id, rcl)
											}
											data={_products[Id].rateCard}
										/>
									</div>
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

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { updateFrameAgreement, updateIgnoreSettings } from '~/src/actions';
import { publish, hasSubscription } from '~/src/api';
import { log, copy, isObject } from '~/src/utils/shared-service.js';

import SFField from '../utillity/SFField';
import Icon from '../utillity/Icon';
import Shape from '../skeletons/Shape';

export class FaFields extends React.Component {
	constructor(props) {
		super(props);
		// this.props.rows
		// this.props.onChange
		// this.props.fa
		// this.props.editable

		this.onFieldChange = this.onFieldChange.bind(this);

	}

	onFieldChange(field, value) {
		this.props.updateFrameAgreement(this.props.faId, field, value);

		this.props.onActionTaken(field, value);

		if (!hasSubscription('onFaUpdate')) {
			return;
		}

		setTimeout(() => {
			this.handleIgnoreSettingsHook();
		});
	}

	async handleIgnoreSettingsHook() {
		try {
			let _ignoreSettings = await publish('onFaUpdate', {
				ignoreSettings: copy(this.props.ignoreSettings)
			});

			if (!isObject(_ignoreSettings)) {
				throw new Error('onFaUpdate response is not an object!');
			}

			if (!!_ignoreSettings.products) {
				_ignoreSettings.products = Array.from(_ignoreSettings.products);
			}
			if (!!_ignoreSettings.tabs) {
				_ignoreSettings.tabs = Array.from(_ignoreSettings.tabs);
			}

			this.props.updateIgnoreSettings(_ignoreSettings);
		} catch (err) {
			log.bg.red('Error on custom ignore settings hook:');
			log.red(
				err.message +
					'\n' +
					Array(err.message.length)
						.fill('_')
						.join('')
			);
		}
	}

	render() {
		let _faFields = null;
		let _editable = window.FAM.api.isAgreementEditable(this.props.faId);

		if (this.props.frameAgreements[this.props.faId]._ui.headerRows.length) {
			_faFields = (
				<section className="card basket-details-card">
					{this.props.frameAgreements[this.props.faId]._ui.headerRows.map((row, i) => {
						return (
							<div className="basket-details-card__row" key={'header-row-' + i}>
								{row.map(f => {
									return (
										<SFField
											editable={
												!f.readOnly &&
												_editable &&
												!this.props
													.disableFrameAgreementOperations
											}
											onChange={this.onFieldChange}
											key={f.field}
											field={f}
											value={this.props.frameAgreements[this.props.faId][f.field] || ''}
										/>
									);
								})}
							</div>
						);
					})}
				</section>
			);
		}

		return _faFields;
	}
}

const mapStateToProps = state => {
	return {
		frameAgreements: state.frameAgreements,
		ignoreSettings: state.ignoreSettings,
		settings: state.settings,
		disableFrameAgreementOperations: state.disableFrameAgreementOperations
	};
};

const mapDispatchToProps = {
	updateFrameAgreement,
	updateIgnoreSettings
};

export default connect(mapStateToProps, mapDispatchToProps)(FaFields);

import React, { Component } from 'react';
import Modal from 'react-responsive-modal';
import { connect } from 'react-redux';

import JSONTree from 'react-json-tree';

import {
	isMaster,
	decodeEntities,
	getFieldLabel,
	truncateCPField,
	copy
} from '~/src/utils/shared-service';
import { getAttachment, getCommercialProductData } from '~/src/actions';

import Loading from '../utillity/Loading';
import Icon from '../utillity/Icon';

import DeltaStructure from '../utillity/DeltaStructure';

class DeltaModal extends Component {
	constructor(props) {
		super(props);

		this.onCloseModal = this.onCloseModal.bind(this);
		this.onPrimaryIdChange = this.onPrimaryIdChange.bind(this);
		this.onSecondaryIdChange = this.onSecondaryIdChange.bind(this);
		this.switchAgreements = this.switchAgreements.bind(this);
		this.calculateDelta = this.calculateDelta.bind(this);

		this.state = {
			deltaView: false,
			loaded: false,
			secondaryId: undefined,
			secondaryFa: {},
			primaryId: this.props.faIdOriginal,
			primaryFa: this.formatFrameAgreement(
				this.props.frameAgreements[this.props.faIdOriginal]
			),
			delta: null
		};

		this.chargesInfoMap = {};
		this.productLabelMap = this.props.commercialProducts.reduce((acc, iter) => {
			return { ...acc, [iter.Id]: iter.Name };
		}, {});
	}

	componentDidMount() {
		// this.props.faIdOriginal
		if (
			this.props.frameAgreements[this.props.faIdOriginal].hasOwnProperty(
				'csconta__replaced_frame_agreement__c'
			)
		) {
			this.onSecondaryIdChange(
				this.props.frameAgreements[this.props.faIdOriginal]
					.csconta__replaced_frame_agreement__c
			);
		} else {
			this.setState({
				loaded: true
			});
		}
	}

	// componentWillUnmount() {
	// 	this.mounted = false;

	// 	delete window.FAM.api.getActiveFrameAgreement;
	// 	for (var key in SUBSCRIPTIONS) {
	// 		SUBSCRIPTIONS[key].unsubscribe();
	// 	}
	// }

	async onPrimaryIdChange(value) {
		if (!value) {
			this.setState({ primaryId: undefined, delta: null, primaryFa: {} });
			return;
		}

		if (!this.props.frameAgreements[value]._ui.attachment) {
			// Attachment is not loaded
			await this.props.getAttachment(value);
		}

		await this.props.getAttachment(value);
		this.setState({
			primaryId: value,
			delta: null,
			primaryFa: this.formatFrameAgreement(this.props.frameAgreements[value]),
			loaded: true
		});
	}

	async onSecondaryIdChange(value) {
		if (!value) {
			this.setState({ secondaryId: undefined, delta: null, secondaryFa: {} });
			return;
		}

		if (!this.props.frameAgreements[value]._ui.attachment) {
			// Attachment is not loaded
			await this.props.getAttachment(value);
		}

		// Attachment is not loaded
		await this.props.getAttachment(value);
		this.setState({
			secondaryId: value,
			delta: null,
			secondaryFa: this.formatFrameAgreement(this.props.frameAgreements[value]),
			loaded: true
		});
	}

	async calculateDelta() {
		this.setState({ loaded: false });

		const primProdSet = new Set(
			Object.keys(
				this.props.frameAgreements[this.state.primaryId]._ui.attachment.products
			)
		);

		let _products_diff = Object.keys(
			this.props.frameAgreements[this.state.secondaryId]._ui.attachment.products
		).filter(cpId => !primProdSet.has(cpId));

		let _promiseArray = [];

		if (_products_diff.length) {
			_promiseArray.push(this.props.getCommercialProductData(_products_diff));
		}
		console.log([this.state.primaryId, this.state.secondaryId]);
		_promiseArray.push(
			window.SF.invokeAction('getDelta', [
				this.state.primaryId,
				this.state.secondaryId
			])
		);

		Promise.all(_promiseArray).then(
			response => {
				let _delta = response[response.length - 1];
				console.log(_delta);

				// Generate labeling info

				let mergedIdSet = new Set([...primProdSet, ..._products_diff]);

				let _this_cp_list = this.props.commercialProducts.filter(cp =>
					mergedIdSet.has(cp.Id)
				);

				this.chargesInfoMap.addons = _this_cp_list.reduce((acc, iter) => {
					if (iter.hasOwnProperty('_addons')) {
						let _addonMap = iter._addons.reduce((acc2, iter2) => {
							return { ...acc2, [iter2.Id]: iter2.Name };
						}, {});

						return { ...acc, ..._addonMap };
					} else return acc;
				}, {});

				this.chargesInfoMap.charges = _this_cp_list.reduce((acc, iter) => {
					if (iter.hasOwnProperty('_charges')) {
						let _charges = iter._charges.reduce((acc2, iter2) => {
							return { ...acc2, [iter2.Id]: iter2.Name };
						}, {});

						return { ...acc, ..._charges };
					} else return acc;
				}, {});

				this.chargesInfoMap.rateCards = _this_cp_list.reduce((acc, iter) => {
					if (iter.hasOwnProperty('_rateCards')) {
						let _rateCards = iter._rateCards.reduce((acc2, iter2) => {
							return {
								...acc2,
								[iter2.Id]: {
									Name: iter2.Name,
									rcl: iter2.rateCardLines.reduce(
										(acc3, iter3) => ({ ...acc3, [iter3.Id]: iter3.Name }),
										{}
									)
								}
							};
						}, {});

						return { ...acc, ..._rateCards };
					} else return acc;
				}, {});

				this.setState({ loaded: true, delta: _delta, deltaView: true });
			},
			error => {}
		);
	}

	formatFrameAgreement(fa) {
		let _faLite = copy(fa || {});

		try {
			delete _faLite._ui;
			delete _faLite.csconta__Account__r;
			_faLite.products = fa._ui.attachment.products;
			for (var key in _faLite.products) {
				delete _faLite.products[key]._allowances;
			}
		} catch (err) {}
		return _faLite;
	}

	onCloseModal() {
		this.props.onCloseModal();
	}

	switchAgreements() {
		let _prim = this.formatFrameAgreement(
			this.props.frameAgreements[this.state.primaryId]
		);
		let _sec = this.formatFrameAgreement(
			this.props.frameAgreements[this.state.secondaryId]
		);

		this.setState(
			{
				primaryId: _sec.Id,
				primaryFa: _sec,
				secondaryId: _prim.Id,
				secondaryFa: _prim
			},
			() => {
				console.log(this.state);
			}
		);
	}

	render() {
		const theme = {
			base00: '#000',
			base01: '#fff',
			base02: '#fff',
			base03: '#fff',
			base04: '#fff',
			base05: '#fff',
			base06: '#fff',
			base07: '#fff',
			base08: '#fff',
			base09: '#fff',
			base0A: '#fff',
			base0B: '#fff',
			base0C: '#fff',
			base0D: '#fff',
			base0E: '#fff',
			base0F: '#fff'
		};

		return (
			<Modal
				classNames={{
					overlay: 'overlay',
					modal: 'modal fa-modal expanded'
				}}
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
					<h2 className="fa-modal-header-title">
						{window.SF.labels.delta_title}
					</h2>
				</div>

				<div className="delta-modal fa-modal-body">
					<Loading loading={!this.state.loaded} />

					<div
						className={
							'delta-options' + (this.state.deltaView ? ' hidden' : '')
						}
					>
						<div className="delta-select">
							<select
								className="fa-select"
								value={this.state.primaryId}
								onChange={e => this.onPrimaryIdChange(e.target.value)}
							>
								<option value="">Choose a primary agreement</option>
								{Object.values(this.props.frameAgreements)
									.filter(
										fa => !isMaster(fa) && fa.Id !== this.state.secondaryId
									)
									.map(fa => {
										return (
											<option key={'prim-' + fa.Id} value={fa.Id}>
												{fa.csconta__Agreement_Name__c || fa.Id}
											</option>
										);
									})}
							</select>
						</div>

						<div
							className="delta-select-switch"
							onClick={this.switchAgreements}
						>
							<Icon color="#080707" name="replace" width="16" height="16" />
						</div>

						<div className="delta-select">
							<select
								value={this.state.secondaryId}
								className="fa-select"
								onChange={e => this.onSecondaryIdChange(e.target.value)}
							>
								<option value="">Choose a second agreement</option>

								{Object.values(this.props.frameAgreements)
									.filter(fa => !isMaster(fa) && fa.Id !== this.state.primaryId)
									.map(fa => {
										return (
											<option key={'sec-' + fa.Id} value={fa.Id}>
												{fa.csconta__Agreement_Name__c}
											</option>
										);
									})}
							</select>
						</div>
					</div>

					{!this.state.deltaView ? (
						<div className="delta-juxt">
							<div>
								{this.state.primaryId ? (
									<JSONTree
										getItemString={(type, data, itemType, itemString) => (
											<span>({itemString.replace(/\D+/g, '')})</span>
										)}
										labelRenderer={raw => (
											<span>
												{getFieldLabel('csconta__Frame_Agreement__c', raw[0]) ||
													truncateCPField(raw[0], true)}
												:
											</span>
										)}
										valueRenderer={raw => <strong>{raw}</strong>}
										hideRoot={true}
										theme={theme}
										data={this.state.primaryFa}
									/>
								) : null}
							</div>
							<div>
								{this.state.secondaryId ? (
									<JSONTree
										labelRenderer={raw => (
											<span>
												{getFieldLabel('csconta__Frame_Agreement__c', raw[0]) ||
													truncateCPField(raw[0], true)}
												:
											</span>
										)}
										valueRenderer={raw => <strong>{raw}</strong>}
										hideRoot={true}
										theme={theme}
										data={this.state.secondaryFa}
									/>
								) : null}
							</div>
						</div>
					) : (
						<div className="delta-structure-container">
							<DeltaStructure
								productsLabels={this.productLabelMap}
								chargesLabels={this.chargesInfoMap}
								data={this.state.delta}
							/>
						</div>
					)}
				</div>

				<div className="fa-modal-footer delta-footer">
					<div className="delta-bottom-container">
						{this.state.delta ? (
							<button
								className="fa-button fa-button--default"
								onClick={() =>
									this.setState({ deltaView: !this.state.deltaView })
								}
							>
								{this.state.deltaView
									? '< ' + window.SF.labels.btn_delta_switch_fa
									: window.SF.labels.btn_delta_switch_delta + ' >'}
							</button>
						) : null}

						{!this.state.deltaView ? (
							<button
								className="fa-button fa-button--default"
								onClick={this.calculateDelta}
								disabled={!this.state.secondaryId}
							>
								{window.SF.labels.btn_CalcDelta}
							</button>
						) : null}
					</div>

					<button
						className="fa-button fa-button--default"
						onClick={this.onCloseModal}
					>
						{window.SF.labels.btn_Done}
					</button>
				</div>
			</Modal>
		);
	}
}

const mapStateToProps = state => {
	return {
		frameAgreements: state.frameAgreements,
		commercialProducts: state.commercialProducts
	};
};

const mapDispatchToProps = {
	getCommercialProductData,
	getAttachment
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(DeltaModal);

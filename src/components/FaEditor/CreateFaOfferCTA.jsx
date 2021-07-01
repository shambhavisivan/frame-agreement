import React, { Component } from 'react';
import { connect } from 'react-redux';

import { toggleModals } from '~/src/actions';

export class CreateFaOfferCTA extends Component {

	onCreateOffers(e) {
		e.stopPropagation();
		this.props.toggleModals({ createOffersModal: true });
	}

	render() {
		let createFaOfferCTA = '';
		if (this.props.render) {
			createFaOfferCTA = (
				<div className="add-product-box">
					<span className="box-header-1">{window.SF.labels.addOfferCTAMessage}</span>
					<span className="box-header-2">{window.SF.labels.save_fa_products_message}</span>
					<div className="box-button-container">
						<button
							className="fa-button fa-button--brand"
							onClick={e => this.onCreateOffers(e)}
							disabled={this.props.disabled}
						>
							{window.SF.labels.btn_CreateOffers}
						</button>
					</div>
				</div>
			);
		}

		return createFaOfferCTA;
	}
}

const mapDispatchToProps = {
	toggleModals
};

export default connect(null, mapDispatchToProps)(CreateFaOfferCTA);

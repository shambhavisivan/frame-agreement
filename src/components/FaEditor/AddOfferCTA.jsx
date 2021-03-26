import React, { Component } from 'react';
import { connect } from 'react-redux';

import { toggleFieldVisibility, toggleModals } from '~/src/actions';

export class AddOfferCTA extends React.Component {

	onAddClick(e) {
		e.stopPropagation();
		this.props.toggleModals({ offersModal: true });
	}

	render() {
		let addOfferCTA = '';
		if (this.props.render) {
			addOfferCTA = (
				<div className="add-product-box">
					<span className="box-header-1">{window.SF.labels.addOfferCTAMessage}</span>
					<span className="box-header-2">{window.SF.labels.save_fa_products_message}</span>
					<div className="box-button-container">
						<button
							className="fa-button fa-button--brand"
							onClick={e => this.onAddClick(e)}
							disabled={this.props.disabled}
						>
							{window.SF.labels.btn_AddOffers}
						</button>
					</div>
				</div>
			);
		}

		return addOfferCTA;
	}
}

const mapDispatchToProps = {
	toggleModals
};

export default connect(null, mapDispatchToProps)(AddOfferCTA);

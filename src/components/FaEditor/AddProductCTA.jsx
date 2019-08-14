import React, { Component } from 'react';
import { connect } from 'react-redux';

import { toggleFieldVisibility, toggleModals } from '../../actions';

export class AddProductCTA extends React.Component {
	// constructor(props) {
	// 	super(props);
	// }

	onAddClick(e) {
		e.stopPropagation();
		this.props.toggleModals({ productModal: true });
	}

	render() {
		let addProductCTA = '';
		if (this.props.render) {
			addProductCTA = (
				<div className="add-product-box">
					<span className="box-header-1">
						{window.SF.labels.addProductCTAMessage}
					</span>
					<span className="box-header-2">
						{window.SF.labels.save_fa_products_message}
					</span>
					<div className="box-button-container">
						<button
							className="fa-button fa-button--brand"
							onClick={e => this.onAddClick(e)}
							disabled={this.props.disabled}
						>
							{window.SF.labels.btn_AddProducts}
						</button>
					</div>
				</div>
			);
		}

		return addProductCTA;
	}
}

const mapDispatchToProps = {
	toggleModals
};

export default connect(
	null,
	mapDispatchToProps
)(AddProductCTA);

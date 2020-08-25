import React, { Component } from 'react';
import { connect } from 'react-redux';

import { toggleFieldVisibility, toggleModals } from '~/src/actions';

export class AddAddonsCTA extends React.Component {

	onAddClick(e) {
		e.stopPropagation();
		this.props.toggleModals({ addonModal: true });
	}

	render() {
		let _addAddonsCTA = '';
		if (this.props.render) {
			_addAddonsCTA = (
				<div className="add-product-box">
					<span className="box-header-1">{window.SF.labels.addAddonsCTAMessage}</span>
					<span className="box-header-2">{window.SF.labels.save_fa_products_message}</span>
					<div className="box-button-container">
						<button
							className="fa-button fa-button--brand"
							onClick={e => this.onAddClick(e)}
							disabled={this.props.disabled}
						>
							{window.SF.labels.btn_AddAddons}
						</button>
					</div>
				</div>
			);
		}

		return _addAddonsCTA;
	}
}

const mapDispatchToProps = {
	toggleModals
};

export default connect(null, mapDispatchToProps)(AddAddonsCTA);

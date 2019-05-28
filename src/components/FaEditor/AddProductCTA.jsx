import React, { Component } from 'react';

class AddProductCTA extends React.Component {
	constructor(props) {
		super(props);
		// this.props.render
		// this.props.disabled
		// this.props.onClick
	}

	render() {
		let addProductCTA = '';
		if (this.props.render) {
			addProductCTA = (
				<div className="add-product-box">
					<span className="box-header-1">There are no Products in here</span>
					{(() => {
						if (this.props.disabled) {
							return (
								<span className="box-header-2">
									{window.SF.labels.save_fa_message}
								</span>
							);
						} else {
							return (
								<span className="box-header-2">
									{window.SF.labels.save_fa_products_message}
								</span>
							);
						}
					})()}
					<div className="box-button-container">
						<button
							className="fa-button fa-button--brand"
							onClick={this.props.onClick}
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

export default AddProductCTA;

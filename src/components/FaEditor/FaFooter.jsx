import React, { Component } from 'react';
import Icon from '../utillity/Icon';

class FaFooter extends React.Component {
	constructor(props) {
		super(props);
		// this.props.customData
		// this.props.standardData
		// this.props.faStatus
		// this.props.render
		// this.props.disabled
		// this.props.onCallHandler
		// this.props.onOpenCommercialProductModal
		// this.props.onOpenNegotiationModal
		// this.props.onRemoveProducts
	}

	render() {
		let customButtonsFooter = this.props.customData.filter(
			btnObj =>
				!btnObj.hidden.has(this.props.faStatus) && btnObj.location === 'Footer'
		);

		let footer = '';

		if (this.props.render) {
			footer = (
				<div className="fa-main-footer">
					{this.props.standardData.AddProducts.has(this.props.faStatus) && (
						<button
							className="fa-button fa-button--default"
							onClick={this.props.onOpenCommercialProductModal}
						>
							<Icon name="add" width="16" height="16" color="#0070d2" />
							<span className="fa-button-icon">
								{window.SF.labels.btn_AddProducts}
							</span>
						</button>
					)}

					{this.props.standardData.BulkNegotiate.has(this.props.faStatus) && (
						<button
							disabled={this.props.disabled}
							className="fa-button fa-button--default"
							onClick={this.props.onOpenNegotiationModal}
						>
							<Icon name="user" width="16" height="16" color="#0070d2" />
							<span className="fa-button-icon">
								{window.SF.labels.btn_BulkNegotiate}
							</span>
						</button>
					)}

					{this.props.standardData.DeleteProducts.has(this.props.faStatus) && (
						<button
							disabled={this.props.disabled}
							className="fa-button fa-button--default"
							onClick={this.props.onRemoveProducts}
						>
							<Icon name="delete" width="16" height="16" color="#0070d2" />
							<span className="fa-button-icon">
								{window.SF.labels.btn_DeleteProducts}
							</span>
						</button>
					)}

					{customButtonsFooter.map((btnObj, i) => {
						return (
							<button
								key={btnObj.id + i}
								id={btnObj.id}
								className="fa-button fa-button--default"
								onClick={() =>
									this.props.onCallHandler(btnObj.method, btnObj.type)
								}
							>
								<Icon
									name="salesforce1"
									width="16"
									height="16"
									color="#0070d2"
								/>
								<span className="fa-button-icon">{btnObj.label}</span>
							</button>
						);
					})}
				</div>
			);
		}

		return footer;
	}
}

export default FaFooter;

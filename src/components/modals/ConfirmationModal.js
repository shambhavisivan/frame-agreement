import React, { Component } from 'react';

class ConfirmationModal extends Component {
	constructor(props) {
		super(props);
		// this.props.title
		// this.props.message
		// this.props.onCancel
		// this.props.onConfirm
		// this.props.confirmText
	}

	render() {
		return (
			<div className="sf-modal confirmation">
				<div className="modal-header">
					<h2>{this.props.title}</h2>
				</div>
				<div className="modal-body">
					<p>{this.props.message}</p>
				</div>
				<div className="modal-footer">
					<button
						className="slds-button slds-button--neutral"
						onClick={this.props.onCancel}
					>
						Cancel
					</button>
					<button
						className="slds-button slds-button--brand"
						onClick={() => {
							this.props.onConfirm();
							this.props.onCancel();
						}}
					>
						{this.props.confirmText}
					</button>
				</div>
			</div>
		);
	}
}

export default ConfirmationModal;

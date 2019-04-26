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
			<div className="modal fa-modal">
				<div className="fa-modal-header">
					<h2 className="fa-modal-header-title">{this.props.title}</h2>
				</div>
				<div className="confirmation-modal fa-modal-body">
					<p>{this.props.message}</p>
				</div>
				<div className="fa-modal-footer">
					<button
						className="fa-button fa-button-default"
						onClick={this.props.onCancel}
					>
						{window.SF.labels.alert_btn_cancel}
					</button>
					<button
						className="fa-button fa-button--brand"
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

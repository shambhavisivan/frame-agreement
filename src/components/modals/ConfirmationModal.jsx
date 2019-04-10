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
				<div className="modal-header fa-modal-header">
					<h2 className="fa-modal-header-title">{this.props.title}</h2>
				</div>
				<div className="modal fa-modal-body">
					<p className="fa-text-center">{this.props.message}</p>
				</div>
				<div className="modal-footer">
					<button
						className="fa-button button--neutral fa-margin-right-xsm"
						onClick={this.props.onCancel}
					>
						{window.SF.labels.alert_btn_cancel}
					</button>
					<button
						className="fa-button button--brand"
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

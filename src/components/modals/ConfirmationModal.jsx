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
				<div className="modal-header">
					<h2>{this.props.title}</h2>
				</div>
				<div className="modal fa-modal-body">
					<p className="fa-text-center">{this.props.message}</p>
				</div>
				<div className="modal-footer">
					<button
						className="fa-button button--neutral fa-margin-right-xsm"
						onClick={this.props.onCancel}
					>
						Cancel
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

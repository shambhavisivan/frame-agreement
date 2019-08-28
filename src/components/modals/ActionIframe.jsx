import React, { Component } from 'react';
import Modal from 'react-responsive-modal';

class ActionIframe extends Component {
	constructor(props) {
		super(props);

		this.iframe = React.createRef();

		this.options = this.props.config.hasOwnProperty('options')
			? this.props.config.options
			: null;

		this.iFrameTitle =
			this.options && this.options.hasOwnProperty('title')
				? this.options.title
				: null;

		// Default styles
		this.styles = {
			modal: {
				maxWidth: '90%',
				width: '70%',
				height: '70%'
			}
		};

		// Override
		if (this.options) {
			let _modalStyles = {};

			if (this.options.width) {
				_modalStyles.maxWidth = '90%';
				_modalStyles.width = this.options.width;
			}

			if (this.options.height) {
				_modalStyles.height = this.options.height;
			}

			this.styles.modal = _modalStyles;
		}
	}

	render() {
		return (
			<Modal
				classNames={{
					overlay: 'overlay',
					modal:
						'fa-modal iframe-modal ' + (this.iFrameTitle ? '' : 'no-title'),
					closeButton: 'close-button'
				}}
				styles={this.styles}
				closeIconSvgPath={
					<path d="M14.3 11.7l6-6c.3-.3.3-.7 0-1l-.9-1c-.3-.2-.7-.2-1 0l-6 6.1c-.2.2-.5.2-.7 0l-6-6.1c-.3-.3-.7-.3-1 0l-1 1c-.2.2-.2.7 0 .9l6.1 6.1c.2.2.2.4 0 .6l-6.1 6.1c-.3.3-.3.7 0 1l1 1c.2.2.7.2.9 0l6.1-6.1c.2-.2.4-.2.6 0l6.1 6.1c.2.2.7.2.9 0l1-1c.3-.3.3-.7 0-1l-6-6c-.2-.2-.2-.5 0-.7z" />
				}
				closeIconSize={48}
				open={this.props.open}
				onClose={this.props.onCloseIframe}
				center
			>
				<div className="fa-modal-header">
					<button
						id={'btn-iframe-close-' + this.props.config.id}
						className="close-modal-button"
						onClick={this.props.onCloseIframe}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 52 52"
						>
							<path
								fill="#fff"
								d="m31 25.4l13-13.1c0.6-0.6 0.6-1.5 0-2.1l-2-2.1c-0.6-0.6-1.5-0.6-2.1 0l-13.1 13.1c-0.4 0.4-1 0.4-1.4 0l-13.1-13.2c-0.6-0.6-1.5-0.6-2.1 0l-2.1 2.1c-0.6 0.6-0.6 1.5 0 2.1l13.1 13.1c0.4 0.4 0.4 1 0 1.4l-13.2 13.2c-0.6 0.6-0.6 1.5 0 2.1l2.1 2.1c0.6 0.6 1.5 0.6 2.1 0l13.1-13.1c0.4-0.4 1-0.4 1.4 0l13.1 13.1c0.6 0.6 1.5 0.6 2.1 0l2.1-2.1c0.6-0.6 0.6-1.5 0-2.1l-13-13.1c-0.4-0.4-0.4-1 0-1.4z"
							/>
						</svg>
					</button>
					{this.iFrameTitle ? (
						<h2 className="fa-modal-header-title">{this.iFrameTitle}</h2>
					) : null}
				</div>
				<div className="fa-product-modal fa-modal-body">
					<iframe
						id={'iframe-' + this.props.config.id}
						src={this.props.url}
						ref={this.iframe}
						sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
					/>
				</div>
			</Modal>
		);
	}
}

export default ActionIframe;

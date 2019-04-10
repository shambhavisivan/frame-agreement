import React, { Component } from 'react';
import Modal from 'react-responsive-modal';

import './Modal.css';
import './ActionIframe.css';

class ActionIframe extends Component {
	constructor(props) {
		super(props);
		// this.props.open
		// this.props.url
	}

	render() {
		return (
			<Modal
				classNames={{
					overlay: 'overlay',
					modal: 'sf-modal',
					closeButton: 'close-button'
				}}
				closeIconSvgPath={
					<path d="M14.3 11.7l6-6c.3-.3.3-.7 0-1l-.9-1c-.3-.2-.7-.2-1 0l-6 6.1c-.2.2-.5.2-.7 0l-6-6.1c-.3-.3-.7-.3-1 0l-1 1c-.2.2-.2.7 0 .9l6.1 6.1c.2.2.2.4 0 .6l-6.1 6.1c-.3.3-.3.7 0 1l1 1c.2.2.7.2.9 0l6.1-6.1c.2-.2.4-.2.6 0l6.1 6.1c.2.2.7.2.9 0l1-1c.3-.3.3-.7 0-1l-6-6c-.2-.2-.2-.5 0-.7z" />
				}
				open={this.props.open}
				onClose={this.props.onCloseModal}
				center
			>
				<iframe src={this.props.url} />
			</Modal>
		);
	}
}

export default ActionIframe;

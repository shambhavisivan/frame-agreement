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

import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Toaster.scss';

import Icon from './Icon';

class Toast extends Component {
	constructor(props) {
		super(props);
		// this.props.type
		// this.props.title
		// this.props.message
	}

	render() {
		return (
			<div
				className={
					'toast ' +
					(this.props.type.toLowerCase() || 'info') +
					(this.props.unload ? ' unloading' : '')
				}
			>
				{this.props.title && (
					<span className="toast-title">{this.props.title}</span>
				)}
				<span className="sf-label">{this.props.message}</span>
			</div>
		);
	}
}

class Toaster extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="toaster-container">
				{this.props.toasts.map((toast, i) => {
					return (
						<Toast
							key={'toast-' + i}
							unload={i === 0}
							type={toast.type}
							title={toast.title}
							message={toast.message}
						/>
					);
				})}
			</div>
		);
	}
}

const mapStateToProps = state => {
	return { toasts: state.toasts };
};

// const mapDispatchToProps = {
//   createToast
// };

export default connect(
	mapStateToProps,
	null
)(Toaster);

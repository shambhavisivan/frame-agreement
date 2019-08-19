import React, { Component } from 'react';
import { connect } from 'react-redux';

import { removeToast } from '~/src/actions';

import Icon from './Icon';

class Toast extends Component {
	constructor(props) {
		super(props);
		// this.props.type
		// this.props.title
		// this.props.message
		// this.props.id

		this.id = (' ' + this.props.id).slice(1);

		if (this.props.timeout !== null) {
			setTimeout(() => {
				this.props.onRemove(this.id);
			}, this.props.timeout);
		}
	}

	render() {
		return (
			<div
				onClick={() => {
					this.props.onRemove(this.props.id);
				}}
				className={
					'toast ' +
					(this.props.type.toLowerCase() || 'info') +
					(this.props.unload ? ' unloading' : '')
				}
			>
				{this.props.title && (
					<span className="toast__title">{this.props.title}</span>
				)}
				<span>{this.props.message}</span>
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
							onRemove={id => {
								this.props.removeToast(id);
							}}
							id={toast.id}
							type={toast.type}
							title={toast.title}
							timeout={toast.timeout}
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

const mapDispatchToProps = {
	removeToast
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Toaster);

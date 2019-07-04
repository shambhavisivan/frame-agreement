import React, { Component } from 'react';
import { connect } from 'react-redux';

import Modal from 'react-responsive-modal';

import { filterCommercialProducts } from '../../actions';

import Icon from '../utillity/Icon';
import Checkbox from '../utillity/inputs/Checkbox';
import InputSearch from '../utillity/inputs/InputSearch';
import Pagination from '../utillity/Pagination';
import { truncateCPField, isMaster } from '../../utils/shared-service';

class FrameModal extends Component {
	constructor(props) {
		super(props);
		// this.togglePanel = this.togglePanel.bind(this);
		this.onCloseModal = this.onCloseModal.bind(this);
		this.addFrameAgreements = this.addFrameAgreements.bind(this);

		this.state = {
			// searchValue: '',
			expanded: false,
			actionTaken: false,
			faFilter: '',
			selected: {},
			pagination: {
				page: 1,
				pageSize: 10
			}
		};
	}

	onCloseModal() {
		this.setState({
			actionTaken: false,
			selected: {}
		});
		this.props.onCloseModal();
	}

	getFramesCount() {
		let eligableFa = Object.values(this.props.frameAgreements).filter(fa => {
			return fa.Id !== this.props.faId && !isMaster(fa);
		});

		let faSize = eligableFa.length;

		if (this.state.faFilter) {
			faSize = eligableFa.filter(fa => {
				if (this.state.faFilter && this.state.faFilter.length >= 2) {
					return fa.csconta__Agreement_Name__c
						.toLowerCase()
						.includes(this.state.faFilter.toLowerCase());
				} else {
					return true;
				}
			}).length;
		}
		return faSize;
	}

	toggleExpanded() {
		this.setState({ expanded: !this.state.expanded }, () => {
			console.log('Expand:', this.state.expanded);
		});
	}

	selectFa(fa) {
		let currentState = !!this.state.selected[fa.Id];
		let newState = { ...this.state.selected };
		if (currentState) {
			delete newState[fa.Id];
		} else {
			newState[fa.Id] = true;
		}

		this.setState({
			selected: { ...newState }
		});
	}

	addFrameAgreements() {
		this.props.onAddFa(Object.keys(this.state.selected));
		this.props.onCloseModal();
		this.setState({
			selected: {}
		});
	}

	render() {
		return (
			<Modal
				classNames={{
					overlay: 'overlay',
					modal: 'modal fa-modal' + (this.state.expanded ? ' expanded' : ''),
					closeButton: 'close-button'
				}}
				closeIconSvgPath={
					<path d="M14.3 11.7l6-6c.3-.3.3-.7 0-1l-.9-1c-.3-.2-.7-.2-1 0l-6 6.1c-.2.2-.5.2-.7 0l-6-6.1c-.3-.3-.7-.3-1 0l-1 1c-.2.2-.2.7 0 .9l6.1 6.1c.2.2.2.4 0 .6l-6.1 6.1c-.3.3-.3.7 0 1l1 1c.2.2.7.2.9 0l6.1-6.1c.2-.2.4-.2.6 0l6.1 6.1c.2.2.7.2.9 0l1-1c.3-.3.3-.7 0-1l-6-6c-.2-.2-.2-.5 0-.7z" />
				}
				closeIconSize={48}
				open={this.props.open}
				onClose={this.onCloseModal}
				center
			>
				<div className="fa-modal-header">
					<button className="close-modal-button" onClick={this.onCloseModal}>
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
					<span
						className="fa-modal-expand"
						onClick={() => {
							this.toggleExpanded();
						}}
					>
						<Icon name="expand_alt" width="24" height="24" color="white" />
					</span>
					<h2 className="fa-modal-header-title">
						{window.SF.labels.modal_addProduct_title}
					</h2>
				</div>

				<div className="fa-product-modal fa-modal-body panel-closed">
					<div className="fa-modal-table-container">
						<div className="fa-modal-navigation">
							<div className="search-container">
								<InputSearch
									placeholder={window.SF.labels.modal_addFa_title}
									value={this.state.faFilter}
									onChange={val => {
										this.setState({ faFilter: val });
									}}
								/>
							</div>
						</div>

						<div>
							<div className="fa-modal-product-list-header">
								<div className="header-th">
									{window.SF.labels.faNameHeaderCell}
								</div>
								{this.props.faFields.map(f => {
									return (
										<div key={f.name} className="header-th">
											<span>{truncateCPField(f.name)}</span>
										</div>
									);
								})}
							</div>
							<div className="fa-modal-product-list">
								{Object.values(this.props.frameAgreements)
									.filter(fa => {
										return (
											fa.Id !== this.props.faId &&
											!isMaster(fa) &&
											!this.props.frameAgreements[
												this.props.faId
											]._ui.attachment.products.hasOwnProperty(fa.Id)
										);
									})
									.filter(fa => {
										if (
											this.state.faFilter &&
											this.state.faFilter.length >= 2
										) {
											return fa.csconta__Agreement_Name__c
												.toLowerCase()
												.includes(this.state.faFilter.toLowerCase());
										} else {
											return true;
										}
									})
									.paginate(
										this.state.pagination.page,
										this.state.pagination.pageSize
									)
									.map(fa => {
										return (
											<div
												key={fa.Id}
												className={
													'product-row' +
													(this.state.selected[fa.Id] ? ' selected' : '')
												}
												onClick={() => this.selectFa(fa)}
											>
												<span>
													{fa.csconta__Agreement_Name__c || '-- anonymous --'}
												</span>
												{this.props.faFields.map(f => {
													return (
														<span key={fa.Id + '-' + f.name}>
															{fa[f.name] || '-'}
														</span>
													);
												})}
											</div>
										);
									})}
							</div>
						</div>

						<div className="modal-pagination" />
					</div>
				</div>

				<div className="fa-modal-footer">
					<Pagination
						totalSize={this.getFramesCount()}
						pageSize={this.state.pagination.pageSize}
						page={this.state.pagination.page}
						onPageSizeChange={newPageSize => {
							this.setState({
								pagination: {
									...this.state.pagination,
									pageSize: newPageSize,
									page: 1
								}
							});
						}}
						onPageChange={newPage => {
							this.setState({
								pagination: { ...this.state.pagination, page: newPage }
							});
						}}
					/>

					<button
						onClick={this.addFrameAgreements}
						className="fa-button fa-button--brand"
						disabled={!Object.keys(this.state.selected).length}
					>
						{window.SF.labels.modal_categorization_btn_add}
					</button>
				</div>
			</Modal>
		);
	}
}

const mapStateToProps = state => {
	return {
		frameAgreements: state.frameAgreements,
		faFields: state.faFields,
		settings: state.settings
	};
};

// const mapDispatchToProps = {
// 	filterCommercialProducts
// };

export default connect(
	mapStateToProps,
	null
)(FrameModal);

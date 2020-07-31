import React, { Component } from 'react';

import Pagination from './Pagination';
import { openSFLink, truncateCPField, getFieldLabel } from '~/src/utils/shared-service.js';

const CUBE_DIAGONAL_HALF = (Math.sqrt(2) * 20) / 2;

class UsageTypePopup extends Component {
	constructor(props) {
		super(props);
		this.main = React.createRef();

		this.updateTooltipPosition = this.updateTooltipPosition.bind(this);

		this.cubeOffset_x = this.props.chip.width / 2 - CUBE_DIAGONAL_HALF;

		this.state = {
			translate_above: 0,
			translate_below: 0
		};
	}

	componentDidMount() {
		this.updateTooltipPosition();
	}

	updateTooltipPosition() {
		// top (px) = popup_heigth + chip_heigth + (CUBE_DIAGONAL_HALF / 2)

		//Unmounted
		if (!this.main.current) {
			return;
		}

		let translate_above =
			this.main.current.getBoundingClientRect().height +
			this.props.chip.height +
			CUBE_DIAGONAL_HALF;
		translate_above = translate_above * -1;

		let translate_below = CUBE_DIAGONAL_HALF;

		this.setState({ translate_above, translate_below });
	}

	render() {
		if (!this.props.chip) {
			return null;
		}

		let _calculating = this.state.translate_above + this.state.translate_below === 0;

		let _cubeStyle = {
			right: this.cubeOffset_x + 'px'
		};

		let _style = {
			transform:
				'translateY(' +
				(this.props.below ? this.state.translate_above : this.state.translate_below) +
				'px)'
		};

		return (
			<div
				style={_style}
				ref={this.main}
				className={
					'ut-popup' +
					(_calculating ? ' invisible ' : '') +
					(this.props.below ? ' above' : ' below')
				}
			>
				<div className="ut-popup-content">
					<div style={_cubeStyle} className="ut-cube" />
					<div className="ut-popup-user-content">
						<UsageTypeTable
							fields={this.props.fields}
							onUpdatePosition={this.updateTooltipPosition}
							allowance={this.props.allowance}
						/>
					</div>
				</div>
			</div>
		);
	}
}

class UsageTypeTable extends Component {
	constructor(props) {
		super(props);

		// this.props.allowances
		this.state = {
			pagination: {
				page: 1
			}
		};

		this.mainUt = this.props.allowance.mainUsageType || {};
		this.childUt = this.mainUt.hasOwnProperty('childUsageTypes') ? this.mainUt.childUsageTypes : [];
	}

	render() {
		return (
			<React.Fragment>
				<table className="ut-table" align="left" width="100%">
					<thead>
						<tr>
							<th>{window.SF.labels.usage_type_name_field}</th>
							{this.props.fields.map(field => (
								<th key={'uth-' + field}>
									{getFieldLabel('cspmb__Usage_Type__c', field) || truncateCPField(field, true)}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{this.childUt.paginate(this.state.pagination.page, 10).map(ut => {
							return (
								<tr key={ut.Id}>
									<td>
										<span className="table-link" onClick={() => openSFLink(ut.Id)}>
											{ut.Name}
										</span>
									</td>

									{this.props.fields.map(field => (
										<td key={'ut-' + field}>
											{ut.hasOwnProperty(field) ? ut[field].toString() : 'N/A'}
										</td>
									))}
								</tr>
							);
						})}
					</tbody>
				</table>
				<Pagination
					totalSize={this.childUt.length}
					pageSize={10}
					page={this.state.pagination.page}
					restricted={true}
					onPageChange={newPage => {
						this.setState(
							{
								pagination: { ...this.state.pagination, page: newPage }
							},
							() => {
								this.props.onUpdatePosition();
							}
						);
					}}
				/>
			</React.Fragment>
		);
	}
}

class UsageType extends Component {
	constructor(props) {
		super(props);

		this.chip = React.createRef();

		this.updateTooltipPosition = this.updateTooltipPosition.bind(this);

		window.updateTooltipPosition = this.updateTooltipPosition;

		this.mainUt = this.props.allowance.mainUsageType || {};
		this.childUt = this.mainUt.hasOwnProperty('childUsageTypes') ? this.mainUt.childUsageTypes : [];

		this.state = {
			below: true,
			top: null
		};
	}

	componentDidMount() {
		// on the scroll event wee need to check if the chip is above or below the page equator and recalculate
		window.addEventListener('scroll', this.updateTooltipPosition, true);

		// initial calculations
		this.updateTooltipPosition();
	}

	componentWillUnmount() {
		// remove the event listener
		window.removeEventListener('scroll', this.updateTooltipPosition);
	}

	updateTooltipPosition() {
		// getBoundingClientRect will return everything there is about elements dimensions
		const chip_dimensions = this.chip.current.getBoundingClientRect();
		// header is not a part of the first relative container we need to tkae it into consideration
		const header_height = document.getElementsByClassName('fa-secondary-header')[0].clientHeight;

		// Is the chip below or above the pages equator
		let _below = window.innerHeight / 2 < chip_dimensions.top - header_height;

		this.setState({
			below: _below,
			chip: chip_dimensions
		});
	}

	render() {
		let _title = window.SF.labels.usage_type_undefined;

		if (this.mainUt.Name) {
			_title = this.mainUt.Name + ' (' + this.childUt.length + ')';
		}

		return (
			<React.Fragment>
				<div
					className={
						'fa-chip-expander fa-chip-expander--' + (this.childUt.length ? 'usage' : 'active')
					}
				>
					<span
						ref={this.chip}
						className={'fa-chip fa-chip--' + (this.childUt.length ? 'usage hover' : 'active')}
						onClick={() => {
							this.childUt.length && this.props.onOpen();
						}}
					>
						{_title}
					</span>
				</div>

				{this.props.open && this.state.chip ? (
					<UsageTypePopup
						below={this.state.below}
						chip={this.state.chip}
						allowance={this.props.allowance}
						fields={this.props.fields}
					/>
				) : null}
			</React.Fragment>
		);
	}
}

export default UsageType;

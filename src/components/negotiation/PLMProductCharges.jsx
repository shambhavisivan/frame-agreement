import React, { Component } from 'react';

import Icon from '../utillity/Icon';
import NumberFormat from './NumberFormat';

export class PLMProductCharges extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="table-container">
				<div className="table-list-header">
					<div className="list-cell">{window.SF.labels.product_charge_header_name}</div>
					<div className="list-cell">{window.SF.labels.product_charge_header_oneOff}</div>
					<div className="list-cell">{window.SF.labels.product_charge_header_recc}</div>
				</div>

				<ul className="table-list">
					<li className="list-row">
						<div className="list-cell">
							<Icon name="priority" width="14" color='#ccc' /> On product
						</div>
						<div className="list-cell">
							<NumberFormat value={this.props.product.cspmb__One_Off_Charge__c} />
						</div>
						<div className="list-cell">
							<NumberFormat value={this.props.product.cspmb__Recurring_Charge__c} />
						</div>
					</li>
				</ul>
			</div>
		);
	}
}

export default PLMProductCharges;

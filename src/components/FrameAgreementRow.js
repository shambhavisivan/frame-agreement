import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Icon from './utillity/Icon';

class FrameAgreementRow extends React.Component {
	constructor(props) {
		super(props);
		this.statusClass =
			'chip ' +
			(this.props.agreement.csconta__Status__c === 'Draft' ? '' : 'chip-dark');
	}

	// onTextChange(event) {
	//     this.setState({
	//         value: event.target.value
	//     });
	// }

	render() {
		return (
			<Link
				className="panel"
				to={`/agreement/${this.props.agreement.Id}`}
			>
				<div className="panel-title">
					<Icon
						name="threedots_vertical"
						width="16"
						height="16"
						color="#0070d2"
					/>
					<span className="fa-row-text">
						{this.props.agreement.csconta__Agreement_Name__c}
					</span>
				</div>
				<span className={this.statusClass}>
					{this.props.agreement.csconta__Status__c}
				</span>
			</Link>
		);
	}
}
export default FrameAgreementRow;

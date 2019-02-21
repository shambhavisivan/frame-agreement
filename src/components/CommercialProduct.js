import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Icon from './utillity/Icon';

class CommercialProduct extends React.Component {
	constructor(props) {
		super(props);
		this.fields = [...this.props.fields];
		this.fields.unshift('Name');
	}

	// onTextChange(event) {
	//     this.setState({
	//         value: event.target.value
	//     });
	// }

	render() {
		return (
			<div className="commercial-product-container">
				{this.fields.map(pif => {
					return (
						<span key={'facp-' + this.props.product.Id + '-' + pif}>
							{this.props.product[pif] || '-'}
						</span>
					);
				})}
			</div>
		);
	}
}
export default CommercialProduct;

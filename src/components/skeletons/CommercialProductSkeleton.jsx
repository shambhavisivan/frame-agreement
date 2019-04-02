import React, { Component } from 'react';

import './CommercialProductSkeleton.scss';

class CommercialProductSkeleton extends Component {
	constructor(props) {
		super(props);
		// this.props.count
		this.products = new Array(this.props.count);
		for (var i = 0; i < this.products.length; i++) {
			this.products[i] = i;
		}
	}

	render() {
		return (
			<div className="skeleton-cp-container">
				<div className="skeleton-cp-header" />
				<div className="skeleton-cp-table-header" />
				{this.products.map((cp, i) => {
					return <div key={i} className="skeleton-cp-table-item" />;
				})}
			</div>
		);
	}
}

export default CommercialProductSkeleton;

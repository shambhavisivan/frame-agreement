import React, { Component } from 'react';

import Shape from './Shape';

class CommercialProductSkeleton extends Component {
	constructor(props) {
		super(props);
		this.count = this.props.count > 10 ? 10 : this.props.count;
		this.products = new Array(this.count + 1);
		for (var i = 0; i < this.products.length; i++) {
			this.products[i] = i;
		}
	}

	render() {
		return (
			<div className="skeleton-container skeleton-cp">
				<div className="skeleton-header">
					<Shape width={153} height={28} />
					<Shape width={515} height={28} />
				</div>

				{this.products.map((cp, i) => {
					return (
						<div key={i} className="skeleton-table-item">
							<div className="skeleton-right">
								<Shape width={28} height={28} />
								<Shape width={112} height={28} />
							</div>
							<Shape width={145} height={28} />
							<Shape width={145} height={28} />
							<Shape width={145} height={28} />
						</div>
					);
				})}
			</div>
		);
	}
}

export default CommercialProductSkeleton;
